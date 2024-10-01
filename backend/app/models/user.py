from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    membership_type = db.Column(db.String(20), default='free')
    weekly_operations = db.Column(db.Integer, default=0)
    weekly_exports = db.Column(db.Integer, default=0)
    last_reset = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def can_perform_operation(self):
        self._reset_counters_if_needed()
        if self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            return self.weekly_operations < 10
        else:  # free
            return self.weekly_operations < 3

    def can_export(self):
        self._reset_counters_if_needed()
        if self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            return self.weekly_exports < 10
        else:  # free
            return self.weekly_exports < 1

    def increment_operation(self):
        self._reset_counters_if_needed()
        self.weekly_operations += 1
        db.session.commit()

    def increment_export(self):
        self._reset_counters_if_needed()
        self.weekly_exports += 1
        db.session.commit()

    def _reset_counters_if_needed(self):
        now = datetime.utcnow()
        if now - self.last_reset > timedelta(days=7):
            self.weekly_operations = 0
            self.weekly_exports = 0
            self.last_reset = now
            db.session.commit()