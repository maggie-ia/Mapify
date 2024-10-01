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
    db.session.commit()

def increment_export(user_id):
    user = User.query.get(user_id)
    user.increment_export()
    db.session.commit()

def get_membership_info(user_id):
    user = User.query.get(user_id)
    return {
        'membership_type': user.membership_type,
        'operations_remaining': user.operations_remaining,
        'exports_remaining': user.exports_remaining
    }