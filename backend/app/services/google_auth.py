from google.oauth2 import id_token
from google.auth.transport import requests
from flask import current_app
from app.models.user import User
from .user_management import register_user, log_user_activity

def authenticate_with_google(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), current_app.config['GOOGLE_CLIENT_ID'])
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        user_email = idinfo['email']
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            user = register_user(idinfo['name'], user_email, None, idinfo['sub'])
        
        log_user_activity(user.id, 'login_google')
        return user
    except ValueError:
        raise AuthenticationError("Invalid Google token")