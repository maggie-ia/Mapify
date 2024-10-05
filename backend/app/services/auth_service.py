import os
from flask import current_app
from app.models.user import User, UserActivity
from app.utils.exceptions import AuthenticationError
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import check_password_hash
import logging
from datetime import datetime, timedelta
import pyotp
import re
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials


def deactivate_user_account(user_id):
    user = User.query.get(user_id)
    if user:
        user.deactivate_account()
        log_user_activity(user.id, 'account_deactivated')
        return True
    return False



logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
})
firebase_admin.initialize_app(cred)

def verify_firebase_token(token):
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token['uid']
        user = User.query.filter_by(firebase_uid=uid).first()
        if not user:
            # Si el usuario no existe en nuestra base de datos, lo creamos
            email = decoded_token.get('email')
            username = decoded_token.get('name', email.split('@')[0])
            user = register_user(username, email, None, uid)
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        log_user_activity(user.id, 'login')
        return {'access_token': access_token, 'refresh_token': refresh_token}
    except Exception as e:
        logger.error(f"Error de autenticación con Firebase: {str(e)}")
        raise AuthenticationError("Error durante la autenticación con Firebase")

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

def verify_email(user_id, token):
    user = User.query.get(user_id)
    if user and user.verify_email(token):
        user.email_verified = True
        db.session.commit()
        log_user_activity(user.id, 'email_verified')
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

def verify_two_factor(user_id, token):
    user = User.query.get(user_id)
    if user and user.verify_two_factor(token):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        log_user_activity(user.id, '2fa_verified')
        return {'access_token': access_token, 'refresh_token': refresh_token}
    raise AuthenticationError("Código 2FA inválido")

def reset_password(token, new_password):
    user = User.query.filter_by(password_reset_token=token).first()
    if user and user.password_reset_expiration > datetime.utcnow():
        if is_password_secure(new_password):
            user.set_password(new_password)
            user.password_reset_token = None
            user.password_reset_expiration = None
            db.session.commit()
            log_user_activity(user.id, 'password_reset_completed')
            return True
    return False

def change_password(user_id, old_password, new_password):
    user = User.query.get(user_id)
    if user and user.check_password(old_password):
        if is_password_secure(new_password):
            user.set_password(new_password)
            db.session.commit()
            log_user_activity(user.id, 'password_changed')
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

def log_user_activity(user_id, activity_type, details=None):
    new_activity = UserActivity(user_id=user_id, activity_type=activity_type, details=details)
    db.session.add(new_activity)
    db.session.commit()

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

def send_verification_email(email, token):
    subject = "Verifica tu correo electrónico"
    body = f"Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace: {current_app.config['FRONTEND_URL']}/verify-email?token={token}"
    send_email(email, subject, body)

def send_password_reset_email(email, token):
    subject = "Restablecimiento de contraseña"
    body = f"Para restablecer tu contraseña, haz clic en el siguiente enlace: {current_app.config['FRONTEND_URL']}/reset-password?token={token}"
    send_email(email, subject, body)

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

def send_email(to_email, subject, body):
    smtp_server = current_app.config['SMTP_SERVER']
    smtp_port = current_app.config['SMTP_PORT']
    smtp_username = current_app.config['SMTP_USERNAME']
    smtp_password = current_app.config['SMTP_PASSWORD']
    from_email = current_app.config['FROM_EMAIL']

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        logger.info(f"Correo enviado exitosamente a {to_email}")
    except Exception as e:
        logger.error(f"Error al enviar correo a {to_email}: {str(e)}")
        raise

def generate_reset_token():
    return secrets.token_urlsafe(32)

def verify_phone_number(phone_number, verification_code):
    try:
        # Verificar el código de verificación con Firebase
        decoded_token = firebase_auth.verify_phone_number(phone_number, verification_code)
        uid = decoded_token['uid']
        
        # Buscar o crear el usuario en nuestra base de datos
        user = User.query.filter_by(firebase_uid=uid).first()
        if not user:
            user = register_user(username=phone_number, email=None, password=None, firebase_uid=uid)
        
        # Marcar el número de teléfono como verificado
        user.phone_verified = True
        user.phone_number = phone_number
        db.session.commit()
        
        log_user_activity(user.id, 'phone_verified')
        return True
    except Exception as e:
        logger.error(f"Error al verificar el número de teléfono: {str(e)}")
        return False

