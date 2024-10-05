from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.services.auth_service import (
    authenticate_user, register_user, verify_email, enable_two_factor, verify_firebase_token,
    verify_two_factor, reset_password, change_password, logout_all_devices,
    authenticate_with_google, send_sms_code, verify_sms_code, revoke_token, verify_2fa, initiate_password_reset,
    verify_phone_number, delete_user_account
)
from app import db
from app.utils.error_handler import handle_error

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

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email_route():
    data = request.get_json()
    try:
        if verify_email(data['user_id'], data['token']):
            return jsonify({"message": "Correo electrónico verificado exitosamente"}), 200
        return jsonify({"error": "Token de verificación inválido"}), 400
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


@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    try:
        delete_user_account(user_id)
        return jsonify({"message": "Cuenta eliminada exitosamente"}), 200
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

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    try:
        if reset_password(data['token'], data['new_password']):
            return jsonify({"message": "Contraseña restablecida exitosamente"}), 200
        return jsonify({"error": "Token inválido o expirado"}), 400
    except Exception as e:
        return handle_error(e)

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        result = authenticate_with_google(token)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

