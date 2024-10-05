from .auth_utils import (
    is_password_secure, send_verification_email, send_password_reset_email,
    generate_reset_token, verify_phone_number
)
from .firebase_auth import verify_firebase_token
from .user_management import (
    register_user, verify_email, enable_two_factor, verify_two_factor,
    reset_password, change_password, logout_all_devices, log_user_activity
)
from .google_auth import authenticate_with_google
from .sms_auth import verify_sms_code
from app.models.user import User
from app import db
import logging

logger = logging.getLogger(__name__)

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
