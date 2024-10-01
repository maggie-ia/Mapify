from app.models.user import User
from app.models.usage_history import UsageHistory
from app.models.membership import Membership
from app import db
from datetime import datetime, timedelta

def get_membership_info(user_id):
    user = User.query.get(user_id)
    membership_info = user.get_membership_info()
    membership_info['current_price'] = user.membership_price
    membership_info['current_market_price'] = Membership.get_price(user.membership_type)
    return membership_info

def update_membership(user_id, new_membership_type):
    user = User.query.get(user_id)
    current_price = Membership.get_price(new_membership_type)
    user.update_membership(new_membership_type, current_price)
    updated_info = user.get_membership_info()
    return updated_info

def can_perform_operation(user_id):
    user = User.query.get(user_id)
    return user.can_perform_operation()

def can_export(user_id):
    user = User.query.get(user_id)
    return user.can_export()

def increment_operation(user_id, operation_type):
    user = User.query.get(user_id)
    user.increment_operation()
    add_usage_history(user_id, operation_type)

def increment_export(user_id):
    user = User.query.get(user_id)
    user.increment_export()
    add_usage_history(user_id, 'export')

def can_translate_to_language(user_id, language):
    user = User.query.get(user_id)
    return user.can_translate_to_language(language)

def get_page_limit(user_id):
    user = User.query.get(user_id)
    return user.get_page_limit()

def start_trial(user_id, days=14):
    user = User.query.get(user_id)
    user.start_trial(days)
    db.session.commit()

def add_usage_history(user_id, operation_type, details=None):
    new_history = UsageHistory(user_id=user_id, operation_type=operation_type, details=details)
    db.session.add(new_history)
    db.session.commit()

def get_usage_history(user_id):
    return UsageHistory.query.filter_by(user_id=user_id).order_by(UsageHistory.timestamp.desc()).all()

def check_trial_expiration(user_id):
    user = User.query.get(user_id)
    if user.is_trial and datetime.utcnow() > user.trial_end_date:
        user.end_trial()
        db.session.commit()
        return True
    return False

def get_notifications(user_id):
    user = User.query.get(user_id)
    notifications = []
    
    if user.is_trial:
        days_left = (user.trial_end_date - datetime.utcnow()).days
        if days_left <= 3:
            notifications.append(f"Tu período de prueba terminará en {days_left} días.")
    
    if user.membership_type != 'premium':
        operations_left = user.get_weekly_operations_remaining()
        if operations_left <= 2:
            notifications.append(f"Te quedan solo {operations_left} operaciones esta semana.")
    
    return notifications

def get_renewal_reminder(user_id):
    user = User.query.get(user_id)
    if user.membership_type in ['basic', 'premium']:
        days_until_renewal = (user.monthly_reset - datetime.utcnow()).days
        if days_until_renewal <= 7:
            current_price = Membership.get_price(user.membership_type)
            if current_price > user.membership_price:
                return f"Tu membresía se renovará en {days_until_renewal} días. El nuevo precio será de ${current_price:.2f}."
            else:
                return f"Tu membresía se renovará en {days_until_renewal} días al precio actual de ${user.membership_price:.2f}."
    return None