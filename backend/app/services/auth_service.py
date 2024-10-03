from app.models.user import User
from app.utils.exceptions import AuthenticationError
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
import logging

logger = logging.getLogger(__name__)

def authenticate_user(email, password):
    try:
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return access_token
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
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return new_user
    except Exception as e:
        logger.error(f"Error de registro: {str(e)}")
        db.session.rollback()
        raise AuthenticationError("Error durante el registro")