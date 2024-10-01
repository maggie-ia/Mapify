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
    return user.get_membership_info()

def update_membership(user_id, new_membership_type):
    user = User.query.get(user_id)
    user.update_membership(new_membership_type)
    return user.get_membership_info()

def can_translate_to_language(user_id, language):
    user = User.query.get(user_id)
    return user.can_translate_to_language(language)

def get_page_limit(user_id):
    user = User.query.get(user_id)
    return user.get_page_limit()