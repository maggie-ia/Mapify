from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app import db
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already registered"}), 400
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

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

@auth_bp.route('/upgrade', methods=['POST'])
@jwt_required()
def upgrade_membership():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    new_membership = data.get('membership_type')
    if new_membership in ['basic', 'premium']:
        user.membership_type = new_membership
        db.session.commit()
        return jsonify({"message": f"Membership upgraded to {new_membership}"}), 200
    return jsonify({"message": "Invalid membership type"}), 400