from app.models.user import User
from app import db
import pyotp
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def register_user(username, email, password=None, firebase_uid=None):
    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise AuthenticationError("El correo electrónico ya está registrado")
        
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
        return True
    return False

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