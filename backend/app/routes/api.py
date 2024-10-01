from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.services.text_processing import (
    summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, extract_relevant_phrases, translate_text
)
from app.services.membership_service import (
    can_perform_operation, can_export, increment_operation, increment_export, 
    get_membership_info, update_membership, can_translate_to_language, get_page_limit,
    start_trial, get_usage_history, check_trial_expiration, get_notifications,
    get_renewal_reminder
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
    user = User.query.get(user_id)

    if not user or not text or not operation:
        return jsonify({"error": "Invalid request"}), 400

    check_trial_expiration(user_id)

    if not can_perform_operation(user_id):
        return jsonify({"error": "Operation limit reached for your membership level"}), 403

    # Check page limit
    page_limit = get_page_limit(user_id)
    if len(text.split()) > page_limit * 250:  # Assuming average of 250 words per page
        return jsonify({"error": f"Document exceeds the {page_limit} page limit for your membership level"}), 403

    result = None
    if operation == 'summarize':
        result = summarize_text(text)
    elif operation == 'paraphrase':
        result = paraphrase_text(text)
    elif operation == 'synthesize':
        result = synthesize_text(text)
    elif operation == 'concept_map':
        if user.membership_type in ['basic', 'premium'] or user.is_trial:
            max_nodes = None if user.membership_type == 'premium' or user.is_trial else 6
            result = generate_concept_map(text, max_nodes)
        else:
            return jsonify({"error": "Upgrade membership to access this feature"}), 403
    elif operation == 'relevant_phrases':
        result = extract_relevant_phrases(text)
    elif operation == 'translate':
        target_language = data.get('target_language')
        if not target_language:
            return jsonify({"error": "Target language is required for translation"}), 400
        if not can_translate_to_language(user_id, target_language):
            return jsonify({"error": "Translation to this language is not available in your membership level"}), 403
        result = translate_text(text, target_language)
    else:
        return jsonify({"error": "Invalid operation"}), 400

    # Save the operation result
    new_document = Document(content=text, user_id=user_id, operation_type=operation, result=result)
    db.session.add(new_document)
    db.session.commit()

    increment_operation(user_id, operation)

    return jsonify({"result": result}), 200

@api.route('/export', methods=['POST'])
@jwt_required()
def export_result():
    data = request.json
    document_id = data.get('document_id')
    export_format = data.get('format')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not document_id or not export_format:
        return jsonify({"error": "Invalid request"}), 400

    check_trial_expiration(user_id)

    if not can_export(user_id):
        return jsonify({"error": "Export limit reached for your membership level"}), 403

    document = Document.query.get(document_id)
    if not document or document.user_id != user_id:
        return jsonify({"error": "Document not found"}), 404

    # Implement export logic here (e.g., generate PDF, DOCX, or TXT file)
    # For now, we'll just return a success message

    increment_export(user_id)

    return jsonify({"message": f"Export successful in {export_format} format"}), 200

@api.route('/membership-info', methods=['GET'])
@jwt_required()
def membership_info():
    user_id = get_jwt_identity()
    check_trial_expiration(user_id)
    info = get_membership_info(user_id)
    return jsonify(info), 200

@api.route('/update-membership', methods=['POST'])
@jwt_required()
def update_user_membership():
    user_id = get_jwt_identity()
    data = request.json
    new_membership_type = data.get('membership_type')
    
    if new_membership_type not in ['free', 'basic', 'premium']:
        return jsonify({"error": "Invalid membership type"}), 400

    updated_info = update_membership(user_id, new_membership_type)
    return jsonify(updated_info), 200

@api.route('/start-trial', methods=['POST'])
@jwt_required()
def start_user_trial():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.is_trial or user.membership_type != 'free':
        return jsonify({"error": "User is not eligible for a trial"}), 400

    start_trial(user_id)
    return jsonify({"message": "Trial started successfully"}), 200

@api.route('/usage-history', methods=['GET'])
@jwt_required()
def get_user_usage_history():
    user_id = get_jwt_identity()
    history = get_usage_history(user_id)
    return jsonify([{
        'operation_type': h.operation_type,
        'timestamp': h.timestamp.isoformat(),
        'details': h.details
    } for h in history]), 200

@api.route('/notifications', methods=['GET'])
@jwt_required()
def get_user_notifications():
    user_id = get_jwt_identity()
    notifications = get_notifications(user_id)
    return jsonify(notifications), 200

@api.route('/renewal-reminder', methods=['GET'])
@jwt_required()
def get_renewal_reminder():
    user_id = get_jwt_identity()
    reminder = get_renewal_reminder(user_id)
    return jsonify(reminder), 200

@api.route('/localization', methods=['GET'])
def get_localization_info():
    # Aquí deberías implementar la lógica para determinar la ubicación del usuario
    # Por ahora, devolveremos información predeterminada
    return jsonify({
        "currency": "USD",
        "countryCode": "US"
    })

# ... (resto del código existente)