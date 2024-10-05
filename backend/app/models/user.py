from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pyotp
import logging
import secrets
from .user_membership import UserMembership
from .user_activity import UserActivity
from .user_permissions import UserPermissions

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
    
    def log_error(self, error_message):
        logger = logging.getLogger('mapify_error_logger')
        logger.error(f"User {self.id} - {error_message}")

    
    def can_use_problem_solving(self):
            return True  # Disponible para todas las membresías   

    def get_membership_info(self):
        self._reset_counters_if_needed()
        return {
            'membership_type': self.membership_type,
            'membership_duration': self.membership_duration,
            'membership_price': self.membership_price,
            'membership_start_date': self.membership_start_date.isoformat(),
            'membership_end_date': self.membership_end_date.isoformat(),
            'is_trial': self.is_trial,
            'trial_end_date': self.trial_end_date.isoformat() if self.trial_end_date else None,
            'weekly_operations_remaining': self.get_weekly_operations_remaining(),
            'weekly_exports_remaining': self.get_weekly_exports_remaining(),
            'page_limit': self.get_page_limit(),
            'can_create_concept_maps': self.membership_type != 'free' or self.is_trial,
            'concept_map_node_limit': float('inf') if self.membership_type == 'premium' or self.is_trial else 6 if self.membership_type == 'basic' else 0,
            'chat_usage_remaining': self.get_chat_usage_remaining(),
            'can_use_problem_solving': self.can_use_problem_solving(),
            'problem_solving_limit': self.get_problem_solving_limit()
        }

    def get_problem_solving_limit(self):
            if self.is_trial or self.membership_type == 'premium':
                return float('inf')  # Sin límite
            elif self.membership_type == 'basic':
                return 20  # 20 usos por mes
            else:  # free
                return 5   # 5 usos por semana

    def get_weekly_operations_remaining(self):
        if self.is_trial or self.membership_type == 'premium':
            return float('inf')
        elif self.membership_type == 'basic':
            return max(0, 10 - self.weekly_operations)
        else:  # free
            return max(0, 3 - self.weekly_operations)

    def get_weekly_exports_remaining(self):
        if self.is_trial or self.membership_type == 'premium':
            return float('inf')
        elif self.membership_type == 'basic':
            return max(0, 10 - self.weekly_exports)
        else:  # free
            return max(0, 1 - self.weekly_exports)

    def get_chat_usage_remaining(self):
        if self.membership_type == 'premium':
            return float('inf')
        elif self.membership_type == 'basic':
            return max(0, 50 - self.chat_usage_count)
        else:  # free
            return max(0, 10 - self.chat_usage_count)
    
    def has_permission(self, permission):
        return permission in self.permissions

    def add_permission(self, permission):
        if permission not in self.permissions:
            self.permissions.append(permission)

    def remove_permission(self, permission):
        if permission in self.permissions:
            self.permissions.remove(permission)

    def add_active_session(self, jti, device_info):
        self.active_sessions.append({
            'jti': jti,
            'device_info': device_info,
            'created_at': datetime.utcnow().isoformat()
        })

    def remove_active_session(self, jti):
        self.active_sessions = [session for session in self.active_sessions if session['jti'] != jti]

class RevokedToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

