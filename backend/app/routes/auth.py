from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from app.models.user import User
from app.services.auth_service import (
    register_user, verify_firebase_token, verify_email, enable_two_factor,
    verify_two_factor, reset_password, change_password, logout_all_devices,
    authenticate_with_google, verify_sms_code, initiate_password_reset,
    verify_phone_number, delete_user_account, deactivate_user_account,
    update_membership
)
from app import db
from app.utils.permissions import permission_required, Permission
from app.utils.error_handler import handle_error
from firebase_admin import auth as firebase_auth

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = register_user(data['username'], data['email'], data['password'])
        return jsonify({"message": "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico."}), 201
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        firebase_token = data.get('firebase_token')
        if not firebase_token:
            return jsonify({"error": "Se requiere token de Firebase"}), 400
        result = verify_firebase_token(firebase_token)
        return jsonify(result), 200
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email_route():
    data = request.get_json()
    try:
        if verify_email(data['user_id'], data['token']):
            return jsonify({"message": "Correo electrónico verificado exitosamente"}), 200
        return jsonify({"error": "Token de verificación inválido"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/enable-2fa', methods=['POST'])
@jwt_required()
def enable_2fa():
    user_id = get_jwt_identity()
    try:
        secret = enable_two_factor(user_id)
        if secret:
            return jsonify({"secret": secret}), 200
        return jsonify({"error": "No se pudo habilitar 2FA"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    data = request.get_json()
    try:
        result = verify_two_factor(data['user_id'], data['token'])
        return jsonify(result), 200
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/logout-all', methods=['POST'])
@jwt_required()
def logout_all():
    user_id = get_jwt_identity()
    try:
        logout_all_devices(user_id)
        return jsonify({"message": "Se ha cerrado sesión en todos los dispositivos"}), 200
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/manage-permissions', methods=['POST'])
@jwt_required()
@permission_required(Permission.MANAGE_USERS)
def manage_permissions():
    data = request.json
    user_id = data.get('user_id')
    permission = data.get('permission')
    action = data.get('action')  # 'add' or 'remove'

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if action == 'add':
        user.add_permission(permission)
    elif action == 'remove':
        user.remove_permission(permission)
    else:
        return jsonify({"error": "Invalid action"}), 400

    db.session.commit()
    return jsonify({"message": "Permissions updated successfully"}), 200

@auth_bp.route('/send-sms-code', methods=['POST'])
def send_sms_code_route():
    phone_number = request.json.get('phone_number')
    try:
        verification_id = firebase_auth.create_phone_number_verification(phone_number)
        return jsonify({"verification_id": verification_id, "message": "SMS code sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send SMS code: {str(e)}"}), 400

@auth_bp.route('/verify-sms-code', methods=['POST'])
def verify_sms_code_route():
    verification_id = request.json.get('verification_id')
    code = request.json.get('code')
    try:
        result = firebase_auth.verify_phone_number(verification_id, code)
        user = create_or_get_user_by_phone(result.phone_number)
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({
            "message": "Phone number verified successfully",
            "user_id": user.id,
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to verify SMS code: {str(e)}"}), 401

def create_or_get_user_by_phone(phone_number):
    user = User.query.filter_by(phone_number=phone_number).first()
    if not user:
        user = User(phone_number=phone_number)
        db.session.add(user)
        db.session.commit()
    return user

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        result = authenticate_with_google(token)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=new_access_token), 200

@auth_bp.route('/initiate-password-reset', methods=['POST'])
def initiate_password_reset_route():
    data = request.get_json()
    try:
        result = initiate_password_reset(data['email'])
        if result:
            return jsonify({"message": "Se ha enviado un correo con instrucciones para restablecer la contraseña"}), 200
        else:
            return jsonify({"error": "No se encontró un usuario con ese correo electrónico"}), 404
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    try:
        if reset_password(data['token'], data['new_password']):
            return jsonify({"message": "Contraseña restablecida exitosamente"}), 200
        return jsonify({"error": "Token inválido o expirado"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password_route():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        if change_password(user_id, data['old_password'], data['new_password']):
            return jsonify({"message": "Contraseña cambiada exitosamente"}), 200
        return jsonify({"error": "No se pudo cambiar la contraseña"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "membership_type": user.membership_type
    }), 200

@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

@auth_bp.route('/deactivate-account', methods=['POST'])
@jwt_required()
def deactivate_account():
    user_id = get_jwt_identity()
    try:
        if deactivate_user_account(user_id):
            return jsonify({"message": "Cuenta desactivada exitosamente"}), 200
        return jsonify({"error": "No se pudo desactivar la cuenta"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    try:
        delete_user_account(user_id)
        return jsonify({"message": "Cuenta eliminada exitosamente"}), 200
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/verify-phone', methods=['POST'])
def verify_phone_route():
    data = request.get_json()
    try:
        result = verify_phone_number(data['phone_number'], data['verification_code'])
        if result:
            return jsonify({"message": "Número de teléfono verificado exitosamente"}), 200
        return jsonify({"error": "Código de verificación inválido"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/upgrade-membership', methods=['POST'])
@jwt_required()
def upgrade_membership_route():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    try:
        result = update_membership(current_user_id, data['new_membership_type'], data['new_duration'])
        if result:
            return jsonify({"message": "Membresía actualizada exitosamente", "new_membership": result}), 200
        return jsonify({"error": "No se pudo actualizar la membresía"}), 400
    except Exception as e:
        return handle_error(e)