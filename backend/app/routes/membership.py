from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.membership import Membership
from app.services.membership_service import (
    get_membership_info, update_membership, start_trial,
    get_usage_history, get_notifications, get_renewal_reminder
)

membership = Blueprint('membership', __name__)

@membership.route('/membership-info', methods=['GET'])
@jwt_required()
def membership_info():
    user_id = get_jwt_identity()
    info = get_membership_info(user_id)
    return jsonify(info), 200

@membership.route('/update-membership', methods=['POST'])
@jwt_required()
def update_user_membership():
    user_id = get_jwt_identity()
    data = request.json
    new_membership_type = data.get('membership_type')
    
    if new_membership_type not in ['free', 'basic', 'premium']:
        return jsonify({"error": "Invalid membership type"}), 400

    updated_info = update_membership(user_id, new_membership_type)
    return jsonify(updated_info), 200

@membership.route('/start-trial', methods=['POST'])
@jwt_required()
def start_user_trial():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.is_trial or user.membership_type != 'free':
        return jsonify({"error": "User is not eligible for a trial"}), 400

    start_trial(user_id)
    return jsonify({"message": "Trial started successfully"}), 200

@membership.route('/usage-history', methods=['GET'])
@jwt_required()
def get_user_usage_history():
    user_id = get_jwt_identity()
    history = get_usage_history(user_id)
    return jsonify([{
        'operation_type': h.operation_type,
        'timestamp': h.timestamp.isoformat(),
        'details': h.details
    } for h in history]), 200

@membership.route('/notifications', methods=['GET'])
@jwt_required()
def get_user_notifications():
    user_id = get_jwt_identity()
    notifications = get_notifications(user_id)
    return jsonify(notifications), 200

@membership.route('/renewal-reminder', methods=['GET'])
@jwt_required()
def get_user_renewal_reminder():
    user_id = get_jwt_identity()
    reminder = get_renewal_reminder(user_id)
    return jsonify({"reminder": reminder}), 200

@membership.route('/membership-prices', methods=['GET'])
def get_membership_prices():
    memberships = Membership.query.all()
    prices = {membership.name: float(membership.price) for membership in memberships}
    return jsonify(prices), 200