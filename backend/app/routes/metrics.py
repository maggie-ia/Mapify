from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.metrics_service import get_user_metrics, get_system_metrics
from app.utils.permissions import admin_required

metrics = Blueprint('metrics', __name__)

@metrics.route('/user', methods=['GET'])
@jwt_required()
def user_metrics():
    user_id = get_jwt_identity()
    metrics = get_user_metrics(user_id)
    return jsonify(metrics), 200

@metrics.route('/system', methods=['GET'])
@jwt_required()
@admin_required
def system_metrics():
    metrics = get_system_metrics()
    return jsonify(metrics), 200