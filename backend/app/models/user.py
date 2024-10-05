from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pyotp
import logging
import secrets

logger = logging.getLogger(__name__)

class User(db.Model, UserMembership, UserPermissions):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    email_verified = db.Column(db.Boolean, default=False)
    two_factor_enabled = db.Column(db.Boolean, default=False)
    two_factor_secret = db.Column(db.String(32))
    failed_login_attempts = db.Column(db.Integer, default=0)
    account_locked_until = db.Column(db.DateTime)
    refresh_token_jti = db.Column(db.String(64))
    email_verification_token = db.Column(db.String(64))
    email_verification_sent_at = db.Column(db.DateTime)
    reset_token = db.Column(db.String(64))
    reset_token_expiration = db.Column(db.DateTime)
    active_sessions = db.Column(db.JSON, default=[])
    phone_number = db.Column(db.String(20))
    phone_verified = db.Column(db.Boolean, default=False)
    phone_verification_code = db.Column(db.String(6))
    phone_verification_expiration = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.failed_login_attempts >= 5 and self.account_locked_until > datetime.utcnow():
            return False
        if not check_password_hash(self.password_hash, password):
            self.failed_login_attempts += 1
            if self.failed_login_attempts >= 5:
                self.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
            db.session.commit()
            return False
        self.failed_login_attempts = 0
        db.session.commit()
        return True
    
    def generate_email_verification_token(self):
        token = secrets.token_urlsafe(32)
        self.email_verification_token = token
        self.email_verification_sent_at = datetime.utcnow()
        db.session.commit()
        return token

    def verify_email(self, token):
        if self.email_verification_token == token and \
           datetime.utcnow() - self.email_verification_sent_at < timedelta(hours=24):
            self.email_verified = True
            self.email_verification_token = None
            db.session.commit()
            return True
        return False

    def enable_two_factor(self):
        self.two_factor_secret = pyotp.random_base32()
        self.two_factor_enabled = True
        db.session.commit()
        return self.two_factor_secret

    def verify_two_factor(self, token):
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)

    def is_password_secure(self, password):
        if len(password) < 8:
            return False
        if not any(char.isupper() for char in password):
            return False
        if not any(char.islower() for char in password):
            return False
        if not any(char.isdigit() for char in password):
            return False
        if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in password):
            return False
        return True
    
    def generate_2fa_secret(self):
        self.two_factor_secret = pyotp.random_base32()
        self.is_two_factor_enabled = True
    
    def verify_2fa(self, token):
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)
    
    def generate_reset_token(self):
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiration = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        return self.reset_token

    def verify_reset_token(self, token):
        if self.reset_token_expiration < datetime.utcnow():
            return False
        return self.reset_token == token
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'membership_type': self.membership_type,
            'is_two_factor_enabled': self.two_factor_enabled
        }

    def generate_email_verification_token(self):
        token = secrets.token_urlsafe(32)
        self.email_verification_token = token
        self.email_verification_sent_at = datetime.utcnow()
        db.session.commit()
        return token

    def verify_email(self, token):
        if self.email_verification_token == token and \
           datetime.utcnow() - self.email_verification_sent_at < timedelta(hours=24):
            self.email_verified = True
            self.email_verification_token = None
            db.session.commit()
            return True
        return False

    def enable_two_factor(self):
        self.two_factor_secret = pyotp.random_base32()
        self.two_factor_enabled = True
        db.session.commit()
        return self.two_factor_secret

    def verify_two_factor(self, token):
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)

    def is_password_secure(self, password):
        if len(password) < 8:
            return False
        if not any(char.isupper() for char in password):
            return False
        if not any(char.islower() for char in password):
            return False
        if not any(char.isdigit() for char in password):
            return False
        if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in password):
            return False
        return True

    def generate_reset_token(self):
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiration = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        return self.reset_token

class UserActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.String(255))

    def renew_membership(self):
        if self.membership_type != 'free':
            self.membership_start_date = datetime.utcnow()
            if self.membership_duration == 'monthly':
                self.membership_end_date = self.membership_start_date + timedelta(days=30)
            elif self.membership_duration == 'sixMonths':
                self.membership_end_date = self.membership_start_date + timedelta(days=180)
            elif self.membership_duration == 'yearly':
                self.membership_end_date = self.membership_start_date + timedelta(days=365)
        db.session.commit()
    
    def log_error(self, error_message):
        logger = logging.getLogger('mapify_error_logger')
        logger.error(f"User {self.id} - {error_message}")     

class RevokedToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

