import re
import secrets
from flask import current_app
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from firebase_admin import auth as firebase_auth
from app.models.user import User, UserActivity
from app.utils.exceptions import AuthenticationError
from app import db
from app.services.auth_service import log_user_activity,register_user

logger = logging.getLogger(__name__)

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
