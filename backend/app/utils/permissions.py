from functools import wraps
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from flask import jsonify

def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or not user.has_permission(permission):
                return jsonify({"error": "Permission denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

class Permission:
    READ_DOCUMENT = 'read_document'
    WRITE_DOCUMENT = 'write_document'
    DELETE_DOCUMENT = 'delete_document'
    SUMMARIZE = 'summarize'
    PARAPHRASE = 'paraphrase'
    TRANSLATE = 'translate'
    CREATE_CONCEPT_MAP = 'create_concept_map'
    EXPORT_DOCUMENT = 'export_document'
    MANAGE_USERS = 'manage_users'
