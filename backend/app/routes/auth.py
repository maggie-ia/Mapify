from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth_service import (
    authenticate_user, register_user, verify_email, enable_two_factor,
    verify_two_factor, reset_password, change_password, logout_all_devices,
    initiate_password_reset
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = register_user(data['username'], data['email'], data['password'])
        return jsonify({"message": "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        result = authenticate_user(data['email'], data['password'])
        if 'requires_2fa' in result:
            return jsonify({"message": "Se requiere autenticación de dos factores", "user_id": result['user_id']}), 200
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email_route():
    data = request.get_json()
    if verify_email(data['user_id'], data['token']):
        return jsonify({"message": "Correo electrónico verificado exitosamente"}), 200
    return jsonify({"error": "Token de verificación inválido"}), 400

@auth_bp.route('/enable-2fa', methods=['POST'])
@jwt_required()
def enable_2fa():
    user_id = get_jwt_identity()
    secret = enable_two_factor(user_id)
    if secret:
        return jsonify({"secret": secret}), 200
    return jsonify({"error": "No se pudo habilitar 2FA"}), 400

@auth_bp.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    data = request.get_json()
    try:
        result = verify_two_factor(data['user_id'], data['token'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

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
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    if reset_password(data['token'], data['new_password']):
        return jsonify({"message": "Contraseña restablecida exitosamente"}), 200
    return jsonify({"error": "Token inválido o expirado"}), 400

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password_route():
    user_id = get_jwt_identity()
    data = request.get_json()
    if change_password(user_id, data['old_password'], data['new_password']):
        return jsonify({"message": "Contraseña cambiada exitosamente"}), 200
    return jsonify({"error": "No se pudo cambiar la contraseña"}), 400

@auth_bp.route('/logout-all', methods=['POST'])
@jwt_required()
def logout_all():
    user_id = get_jwt_identity()
    logout_all_devices(user_id)
    return jsonify({"message": "Se ha cerrado sesión en todos los dispositivos"}), 200