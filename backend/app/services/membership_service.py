from app.models.user import User
from app.models.membership import Membership
from app import db
from datetime import datetime, timedelta

def can_use_problem_solving(user_id):
    user = User.query.get(user_id)
    return user.can_use_problem_solving()

def get_problem_solving_limit(user_id):
    user = User.query.get(user_id)
    return user.get_problem_solving_limit()

def increment_problem_solving_usage(user_id):
    user = User.query.get(user_id)
    # Implementar la lógica para incrementar el uso de la resolución de problemas
    # Esto dependerá de cómo decidas rastrear el uso (por ejemplo, un nuevo campo en el modelo de usuario)
    db.session.commit()

def can_perform_operation(user_id, operation_type):
    user = User.query.get(user_id)

def can_use_problem_solving(user_id):
    user = User.query.get(user_id)
    return user.can_use_problem_solving()

def get_problem_solving_limit(user_id):
    user = User.query.get(user_id)
    return user.get_problem_solving_limit()

def increment_problem_solving_usage(user_id):
    user = User.query.get(user_id)
    # Implementar la lógica para incrementar el uso de la resolución de problemas
    # Esto dependerá de cómo decidas rastrear el uso (por ejemplo, un nuevo campo en el modelo de usuario)
    db.session.commit()

    if user.membership_type == 'premium':
        return True
    elif user.membership_type == 'basic':
        if operation_type == 'chat':
            return user.chat_usage_count < 50  # 50 usos por mes para básico
    else:  # free
        if operation_type == 'chat':
            return user.chat_usage_count < 10  # 10 usos por mes para gratuito
    return False

def increment_operation(user_id, operation_type):
    user = User.query.get(user_id)
    if operation_type == 'chat':
        user.chat_usage_count += 1
        if user.chat_usage_reset is None or datetime.utcnow() - user.chat_usage_reset > timedelta(days=30):
            user.chat_usage_count = 1
            user.chat_usage_reset = datetime.utcnow()
    db.session.commit()

def get_membership_info(user_id):
    user = User.query.get(user_id)
    membership_info = user.get_membership_info()
    membership_info['current_price'] = user.membership_price
    membership_info['current_market_price'] = Membership.get_price(user.membership_type, user.membership_duration)
    return membership_info

def update_membership(user_id, new_membership_type, new_duration):
    user = User.query.get(user_id)
    current_price = Membership.get_price(new_membership_type, new_duration)
    user.update_membership(new_membership_type, new_duration, current_price)
    updated_info = user.get_membership_info()
    return updated_info

def can_export(user_id):
    user = User.query.get(user_id)
    return user.can_export()

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
        days_until_renewal = (user.membership_end_date - datetime.utcnow()).days
        if days_until_renewal <= 7:
            current_price = Membership.get_price(user.membership_type, user.membership_duration)
            if current_price > user.membership_price:
                return f"Tu membresía se renovará en {days_until_renewal} días. El nuevo precio será de ${current_price:.2f}."
            else:
                return f"Tu membresía se renovará en {days_until_renewal} días al precio actual de ${user.membership_price:.2f}."
    return None
