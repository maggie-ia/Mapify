from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

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

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
