from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.services.text_processing import (
    summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, extract_relevant_phrases, translate_text
)
from app.services.membership_service import (
    can_perform_operation, can_export, increment_operation, increment_export, get_membership_info
)
from app import db

api = Blueprint('api', __name__)

@api.route('/process', methods=['POST'])
@jwt_required()
def process_text():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    user_id = get_jwt_identity()

    if not can_perform_operation(user_id):
        return jsonify({"error": "Operation limit reached for your membership level"}), 403

    result = None
    if operation == 'summarize':
        result = summarize_text(text)
    elif operation == 'paraphrase':
        result = paraphrase_text(text)
    elif operation == 'synthesize':
        result = synthesize_text(text)
    elif operation == 'concept_map':
        user = User.query.get(user_id)
        max_nodes = None if user.membership_type == 'premium' else 6
        result = generate_concept_map(text, max_nodes)
    elif operation == 'relevant_phrases':
        result = extract_relevant_phrases(text)
    elif operation == 'translate':
        target_language = data.get('target_language')
        if not target_language:
            return jsonify({"error": "Target language is required for translation"}), 400
        result = translate_text(text, target_language)
    else:
        return jsonify({"error": "Invalid operation"}), 400

    increment_operation(user_id)

    return jsonify({"result": result}), 200

@api.route('/export', methods=['POST'])
@jwt_required()
def export_result():
    user_id = get_jwt_identity()

    if not can_export(user_id):
        return jsonify({"error": "Export limit reached for your membership level"}), 403

    # Implementar lógica de exportación aquí

    increment_export(user_id)

    return jsonify({"message": "Export successful"}), 200

@api.route('/membership-info', methods=['GET'])
@jwt_required()
def membership_info():
    user_id = get_jwt_identity()
    info = get_membership_info(user_id)
    return jsonify(info), 200