from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.models.membership import Membership
from app.services.text_processing import (
    summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, extract_relevant_phrases, translate_text
)
from app.services.membership_service import (
    can_perform_operation, can_export, increment_operation, increment_export, 
    get_membership_info, update_membership, can_translate_to_language, get_page_limit
)
from app import db

api = Blueprint('api', __name__)

@api.route('/process', methods=['POST'])
@jwt_required()
def process_text():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    target_language = data.get('targetLanguage')
    page_count = data.get('pageCount')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not text or not operation:
        return jsonify({"error": "Invalid request"}), 400

    if not can_perform_operation(user_id):
        return jsonify({"error": "Operation limit reached for your membership level"}), 403

    # Check page limit
    page_limit = get_page_limit(user_id)
    if page_count > page_limit:
        return jsonify({"error": f"Document exceeds the {page_limit} page limit for your membership level"}), 403

    result = None
    if operation == 'summarize':
        result = summarize_text(text)
    elif operation == 'paraphrase':
        result = paraphrase_text(text)
    elif operation == 'synthesize':
        result = synthesize_text(text)
    elif operation == 'conceptMap':
        if user.membership_type in ['basic', 'premium']:
            max_nodes = None if user.membership_type == 'premium' else 6
            result = generate_concept_map(text, max_nodes)
        else:
            return jsonify({"error": "Upgrade membership to access this feature"}), 403
    elif operation == 'relevantPhrases':
        result = extract_relevant_phrases(text)
    elif operation == 'translate':
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

    increment_operation(user_id)

    return jsonify({"result": result}), 200

@api.route('/export', methods=['POST'])
@jwt_required()
def export_result():
    data = request.json
    result = data.get('result')
    export_format = data.get('format')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not result or not export_format:
        return jsonify({"error": "Invalid request"}), 400

    if not can_export(user_id):
        return jsonify({"error": "Export limit reached for your membership level"}), 403

    # Implement export logic here (e.g., generate PDF, DOCX, or TXT file)
    # For now, we'll just return a success message

    increment_export(user_id)

    return jsonify({"message": f"Export successful in {export_format} format"}), 200

@api.route('/membership-info', methods=['GET'])
@jwt_required()
def membership_info():
    user_id = get_jwt_identity()
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

@api.route('/membership-prices', methods=['GET'])
def get_membership_prices():
    memberships = Membership.query.all()
    prices = {membership.name: float(membership.price) for membership in memberships}
    return jsonify(prices), 200