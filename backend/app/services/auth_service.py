from app.models import User, UserActivity
from app.utils.exceptions import AuthenticationError
from app.services.auth_utils import log_user_activity, generate_reset_token, send_password_reset_email, send_verification_email
from werkzeug.security import check_password_hash
import logging
from datetime import datetime, timedelta
from app import db
import pyotp
import re
import secrets
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_jwt_extended import create_access_token, create_refresh_token, get_jti
from google.oauth2 import id_token
from google.auth.transport import requests
import phonenumbers
from app.models import RevokedToken
from app.extensions import db, cache
from flask_caching import Cache
import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials
from flask import current_app
from app.models import Membership

logger = logging.getLogger(__name__)

def register_user(username, email, password=None, firebase_uid=None):
    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise AuthenticationError("El correo electrónico ya está registrado")
        
        if password and not is_password_secure(password):
            raise AuthenticationError("La contraseña no cumple con los requisitos de seguridad")

        new_user = User(username=username, email=email, firebase_uid=firebase_uid)
        if password:
            new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        if not firebase_uid:
            verification_token = new_user.generate_email_verification_token()
            send_verification_email(new_user.email, verification_token)

        log_user_activity(new_user.id, 'register')
        return new_user
    except Exception as e:
        logger.error(f"Error de registro: {str(e)}")
        db.session.rollback()
        raise AuthenticationError("Error durante el registro")

def log_user_activity(user_id, activity_type, details=None):
    new_activity = UserActivity(user_id=user_id, activity_type=activity_type, details=details)
    db.session.add(new_activity)
    db.session.commit()

def verify_email(user_id, token):
    user = User.query.get(user_id)
    if user and user.verify_email(token):
        user.email_verified = True
        db.session.commit()
        log_user_activity(user.id, 'email_verified')
        return True
    return False

def verify_two_factor(user_id, token):
    user = User.query.get(user_id)
    if user and user.verify_two_factor(token):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        log_user_activity(user.id, '2fa_verified')
        return {'access_token': access_token, 'refresh_token': refresh_token}
    raise AuthenticationError("Código 2FA inválido")

def change_password(user_id, old_password, new_password):
    user = User.query.get(user_id)
    if user and user.check_password(old_password):
        if is_password_secure(new_password):
            user.set_password(new_password)
            db.session.commit()
            log_user_activity(user.id, 'password_changed')
            return True
    return False

def is_password_secure(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def initiate_password_reset(email):
    user = User.query.filter_by(email=email).first()
    if user:
        reset_token = generate_reset_token()
        user.password_reset_token = reset_token
        user.password_reset_expiration = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        send_password_reset_email(user.email, reset_token)
        log_user_activity(user.id, 'password_reset_initiated')
        return True
    return False

def logout_all_devices(user_id):
    user = User.query.get(user_id)
    if user:
        user.refresh_token_jti = secrets.token_hex(32)
        db.session.commit()
        log_user_activity(user_id, 'logout_all_devices')
        return True
    return False

def enable_two_factor(user_id):
    user = User.query.get(user_id)
    if user:
        secret = pyotp.random_base32()
        user.two_factor_secret = secret
        user.two_factor_enabled = True
        db.session.commit()
        log_user_activity(user.id, 'enable_2fa')
        return secret
    return None

def authenticate_user(email, password):
    try:
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            if user.two_factor_enabled:
                return {'requires_2fa': True, 'user_id': user.id}
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            log_user_activity(user.id, 'login')
            return {'access_token': access_token, 'refresh_token': refresh_token}
        else:
            raise AuthenticationError("Credenciales inválidas")
    except Exception as e:
        logger.error(f"Error de autenticación: {str(e)}")
        raise AuthenticationError("Error durante la autenticación")

def revoke_token(jti):
    try:
        revoked_token = RevokedToken(jti=jti)
        db.session.add(revoked_token)
        db.session.commit()
        logger.info(f"Token revoked: {jti}")
    except Exception as e:
        logger.error(f"Error revoking token: {str(e)}")
        db.session.rollback()
        raise AuthenticationError("Error al revocar el token")

def is_token_revoked(jti):
    return RevokedToken.query.filter_by(jti=jti).first() is not None

def enable_2fa(user_id):
    user = User.query.get(user_id)
    if user:
        user.generate_2fa_secret()
        db.session.commit()
        return user.two_factor_secret
    return None

def verify_2fa(user_id, token):
    user = User.query.get(user_id)
    if user and user.verify_2fa(token):
        return True
    return False

def deactivate_user_account(user_id):
    user = User.query.get(user_id)
    if user:
        user.deactivate_account()
        log_user_activity(user.id, 'account_deactivated')
        return True
    return False

def delete_user_account(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        log_user_activity(user_id, 'account_deleted')
    else:
        raise AuthenticationError("Usuario no encontrado")

def update_membership(user_id: int, new_membership_type: str, new_duration: str) -> dict:

    try:

        user = User.query.get(user_id)
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        current_price = Membership.get_price(new_membership_type, new_duration)
        if current_price is None:
            raise AuthenticationError("Tipo de membresía o duración inválida")
        user.update_membership(new_membership_type, new_duration, current_price)
        db.session.commit()
        log_user_activity(user.id, 'membership_updated')
        return user.get_membership_info()
    except Exception as e:
        logger.error(f"Error al actualizar la membresía: {str(e)}")
        db.session.rollback()
        raise AuthenticationError("Error al actualizar la membresía")

