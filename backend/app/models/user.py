from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pyotp
import logging
import secrets

logger = logging.getLogger(__name__)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    membership_type = db.Column(db.String(20), default='free')
    membership_duration = db.Column(db.String(20), default='monthly')
    membership_price = db.Column(db.Float, default=0.0)
    membership_start_date = db.Column(db.DateTime, default=datetime.utcnow)
    membership_end_date = db.Column(db.DateTime, default=datetime.utcnow)
    weekly_operations = db.Column(db.Integer, default=0)
    weekly_exports = db.Column(db.Integer, default=0)
    last_reset = db.Column(db.DateTime, default=datetime.utcnow)
    monthly_reset = db.Column(db.DateTime, default=datetime.utcnow)
    trial_end_date = db.Column(db.DateTime)
    is_trial = db.Column(db.Boolean, default=False)
    chat_usage_count = db.Column(db.Integer, default=0)
    chat_usage_reset = db.Column(db.DateTime, default=datetime.utcnow)
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
    is_active = db.Column(db.Boolean, default=True)

    def deactivate_account(self):
        self.is_active = False
        db.session.commit()

    def get_max_file_size(self):
        if self.membership_type == 'premium':
            return 50 * 1024 * 1024  # 50 MB
        elif self.membership_type == 'basic':
            return 20 * 1024 * 1024  # 20 MB
        else:
            return 5 * 1024 * 1024  # 5 MB
    
    def generate_reset_token(self):
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiration = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token

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

    class UserActivity(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        activity_type = db.Column(db.String(50), nullable=False)
        timestamp = db.Column(db.DateTime, default=datetime.utcnow)
        details = db.Column(db.String(255))

        user = db.relationship('User', backref=db.backref('activities', lazy=True))
    
    def generate_2fa_secret(self):
        self.two_factor_secret = pyotp.random_base32()
        self.is_two_factor_enabled = True
    
    def verify_2fa(self, token):
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)
    
    def generate_reset_token(self):
        self.reset_password_token = pyotp.random_base32()
        self.reset_password_expire = datetime.utcnow() + timedelta(hours=1)
    
    def verify_reset_token(self, token):
        if self.reset_password_expire < datetime.utcnow():
            return False
        return self.reset_password_token == token
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'membership_type': self.membership_type,
            'is_two_factor_enabled': self.is_two_factor_enabled
        }
    
    def start_trial(self, days=14):
        self.is_trial = True
        self.trial_end_date = datetime.utcnow() + timedelta(days=days)
        self.membership_type = 'premium'
        self.membership_price = 0.0
        self.membership_duration = 'monthly'
        self.membership_end_date = self.trial_end_date

    def end_trial(self):
        self.is_trial = False
        self.membership_type = 'free'
        self.membership_price = 0.0
        self.membership_duration = 'monthly'
        self.membership_end_date = datetime.utcnow()

    def update_membership(self, new_membership_type, new_duration, new_price):
        self.membership_type = new_membership_type
        self.membership_duration = new_duration
        self.membership_price = new_price
        self.membership_start_date = datetime.utcnow()
        
        if new_duration == 'monthly':
            self.membership_end_date = self.membership_start_date + timedelta(days=30)
        elif new_duration == 'sixMonths':
            self.membership_end_date = self.membership_start_date + timedelta(days=180)
        elif new_duration == 'yearly':
            self.membership_end_date = self.membership_start_date + timedelta(days=365)
        
        self._reset_counters_if_needed()
        db.session.commit()

    def can_perform_operation(self):
        self._reset_counters_if_needed()
        if self.is_trial or self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            return self.weekly_operations < 10
        else:  # free
            return self.weekly_operations < 3

    def can_use_chat(self):
        self._reset_chat_usage_if_needed()
        if self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            return self.chat_usage_count < 50  # 50 usos por mes para básico
        else:  # free
            return self.chat_usage_count < 10  # 10 usos por mes para gratuito

    def increment_chat_usage(self):
        self._reset_chat_usage_if_needed()
        self.chat_usage_count += 1
        db.session.commit()

    def _reset_chat_usage_if_needed(self):
        now = datetime.utcnow()
        if now - self.chat_usage_reset > timedelta(days=30):
            self.chat_usage_count = 0
            self.chat_usage_reset = now
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
