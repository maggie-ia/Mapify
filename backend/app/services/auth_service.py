from app.models.user import User, UserActivity
from app.utils.exceptions import AuthenticationError
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import check_password_hash
import logging
from datetime import datetime, timedelta
import pyotp

logger = logging.getLogger(__name__)

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

def register_user(username, email, password):
    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise AuthenticationError("El correo electrónico ya está registrado")
        
        if not is_password_secure(password):
            raise AuthenticationError("La contraseña no cumple con los requisitos de seguridad")

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

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

def reset_password(email):
    user = User.query.filter_by(email=email).first()
    if user:
        reset_token = generate_reset_token()
        user.password_reset_token = reset_token
        user.password_reset_expiration = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        send_password_reset_email(user.email, reset_token)
        log_user_activity(user.id, 'password_reset_requested')
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
    # Implement logic to invalidate all refresh tokens for the user
    log_user_activity(user_id, 'logout_all_devices')
    pass

def log_user_activity(user_id, activity_type, details=None):
    new_activity = UserActivity(user_id=user_id, activity_type=activity_type, details=details)
    db.session.add(new_activity)
    db.session.commit()

def is_password_secure(password):
    # Implement password security checks
    pass

def send_verification_email(email, token):
    # Implement email sending logic
    pass

def send_password_reset_email(email, token):
    # Implement email sending logic
    pass

def generate_reset_token():
    # Implement token generation logic
    pass