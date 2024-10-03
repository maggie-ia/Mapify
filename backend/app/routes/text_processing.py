from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.services.text_processing import (
    summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, extract_relevant_phrases, translate_text,
    get_writing_assistance, solve_problem
)
from app.services.membership_service import (
    can_perform_operation, increment_operation, get_page_limit,
    can_translate_to_language, get_concept_map_node_limit
)
from app import db
from marshmallow import Schema, fields, validate

text_processing = Blueprint('text_processing', __name__)

class ProcessTextSchema(Schema):
    operation = fields.Str(required=True, validate=validate.OneOf([
        'summarize', 'paraphrase', 'synthesize', 'conceptMap', 
        'relevantPhrases', 'translate', 'problemSolving'
    ]))
    text = fields.Str(required=True)
    targetLanguage = fields.Str()
    pageCount = fields.Int(required=True, validate=validate.Range(min=1))

@text_processing.route('/process', methods=['POST'])
@jwt_required()
def process_text():
    schema = ProcessTextSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify({"error": "Invalid input", "details": errors}), 400

    data = schema.load(request.json)
    operation = data['operation']
    text = data['text']
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not can_perform_operation(user_id, operation):
        return jsonify({"error": "Operation limit reached for your membership level"}), 403

    page_limit = get_page_limit(user_id)
    if data['pageCount'] > page_limit:
        return jsonify({"error": f"Document exceeds the {page_limit} page limit for your membership level"}), 403

    try:
        result = perform_operation(operation, text, data, user_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Save the operation result
    new_document = Document(content=text, user_id=user_id, operation_type=operation, result=result)
    db.session.add(new_document)
    db.session.commit()

    increment_operation(user_id, operation)

    return jsonify({"result": result}), 200

def perform_operation(operation, text, data, user_id):
    if operation == 'summarize':
        return summarize_text(text)
    elif operation == 'paraphrase':
        return paraphrase_text(text)
    elif operation == 'synthesize':
        return synthesize_text(text)
    elif operation == 'conceptMap':
        max_nodes = get_concept_map_node_limit(user_id)
        return generate_concept_map(text, max_nodes)
    elif operation == 'relevantPhrases':
        return extract_relevant_phrases(text)
    elif operation == 'translate':
        target_language = data.get('targetLanguage')
        if not target_language:
            raise ValueError("Target language is required for translation")
        if not can_translate_to_language(user_id, target_language):
            raise ValueError("Translation to this language is not available in your membership level")
        return translate_text(text, target_language)
    elif operation == 'problemSolving':
        return solve_problem(text)
    else:
        raise ValueError("Unsupported operation")

# ... keep existing code for other routes