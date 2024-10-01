from app.models.user import User
from app import db

def can_perform_operation(user_id):
    user = User.query.get(user_id)
    return user.can_perform_operation()

def can_export(user_id):
    user = User.query.get(user_id)
    return user.can_export()

def increment_operation(user_id):
    user = User.query.get(user_id)
    user.increment_operation()

def increment_export(user_id):
    user = User.query.get(user_id)
    user.increment_export()

def get_membership_info(user_id):
    user = User.query.get(user_id)
    return {
        'membership_type': user.membership_type,
        'weekly_operations': user.weekly_operations,
        'weekly_exports': user.weekly_exports
    }