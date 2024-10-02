from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.services.text_processing import (
    summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, extract_relevant_phrases, translate_text
)
from app.services.membership_service import (
    can_perform_operation, increment_operation, get_page_limit,
    can_translate_to_language
)
from app import db

text_processing = Blueprint('text_processing', __name__)

@text_processing.route('/process', methods=['POST'])
@jwt_required()
def process_text():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not text or not operation:
        return jsonify({"error": "Invalid request"}), 400

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