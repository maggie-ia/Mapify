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
    monthly_reset = db.Column(db.DateTime, default=datetime.utcnow)

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
        if now - self.monthly_reset > timedelta(days=30):
            self.monthly_reset = now
        db.session.commit()

    def get_page_limit(self):
        if self.membership_type == 'premium':
            return float('inf')  # Sin límite
        elif self.membership_type == 'basic':
            return 10
        else:  # free
            return 5

    def can_translate_to_language(self, language):
        if self.membership_type == 'premium':
            return True
        elif self.membership_type == 'basic':
            allowed_languages = ['en', 'es', 'fr', 'de']  # Ejemplo de 4 idiomas
            return language in allowed_languages
        else:  # free
            return language in ['en', 'es']  # Solo inglés y español para usuarios gratuitos

    def update_membership(self, new_membership_type):
        self.membership_type = new_membership_type
        self._reset_counters_if_needed()
        db.session.commit()

    def get_membership_info(self):
        self._reset_counters_if_needed()
        return {
            'membership_type': self.membership_type,
            'weekly_operations_remaining': self.get_weekly_operations_remaining(),
            'weekly_exports_remaining': self.get_weekly_exports_remaining(),
            'page_limit': self.get_page_limit(),
            'can_create_concept_maps': self.membership_type != 'free',
            'concept_map_node_limit': float('inf') if self.membership_type == 'premium' else 6 if self.membership_type == 'basic' else 0
        }

    def get_weekly_operations_remaining(self):
        if self.membership_type == 'premium':
            return float('inf')
        elif self.membership_type == 'basic':
            return max(0, 10 - self.weekly_operations)
        else:  # free
            return max(0, 3 - self.weekly_operations)

    def get_weekly_exports_remaining(self):
        if self.membership_type == 'premium':
            return float('inf')
        elif self.membership_type == 'basic':
            return max(0, 10 - self.weekly_exports)
        else:  # free
            return max(0, 1 - self.weekly_exports)