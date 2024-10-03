from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import logging

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

    def can_translate_to_language(self, language):
        if self.is_trial or self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            allowed_languages = ['en', 'es', 'fr', 'de']
            return language in allowed_languages
        else:  # free
            return language in ['en', 'es']

    def log_error(self, error_message):
        logger = logging.getLogger('mapify_error_logger')
        logger.error(f"User {self.id} - {error_message}")
