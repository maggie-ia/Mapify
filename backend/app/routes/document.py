from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.document import Document
from app.models.user import User
from app import db
from werkzeug.utils import secure_filename
import os
from app.utils.file_validators import validate_file_type, validate_file_size

document_bp = Blueprint('document', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@document_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    try:
        validate_file_type(file.filename, ALLOWED_EXTENSIONS)
        validate_file_size(file, user.get_max_file_size())
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), filename)
    file.save(file_path)
    
    new_document = Document(
        filename=filename,
        content=file.read().decode('utf-8'),
        user_id=user_id,
        file_type=filename.rsplit('.', 1)[1].lower()
    )
    db.session.add(new_document)
    db.session.commit()
    
    return jsonify({"message": "File uploaded successfully", "document_id": new_document.id}), 201

@document_bp.route('/list', methods=['GET'])
@jwt_required()
def list_documents():
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": doc.id,
        "filename": doc.filename,
        "created_at": doc.created_at,
        "file_type": doc.file_type
    } for doc in documents]), 200

@document_bp.route('/<int:doc_id>/summarize', methods=['POST'])
@jwt_required()
def summarize_document(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    summary = summarize_text(document.content)
    return jsonify({"summary": summary}), 200

@document_bp.route('/<int:doc_id>/paraphrase', methods=['POST'])
@jwt_required()
def paraphrase_document(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    paraphrased = paraphrase_text(document.content)
    return jsonify({"paraphrased": paraphrased}), 200

@document_bp.route('/<int:doc_id>/synthesize', methods=['POST'])
@jwt_required()
def synthesize_document(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    synthesis = synthesize_text(document.content)
    return jsonify({"synthesis": synthesis}), 200

@document_bp.route('/<int:doc_id>/relevant_phrases', methods=['POST'])
@jwt_required()
def extract_relevant_phrases_from_document(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    relevant_phrases = extract_relevant_phrases(document.content)
    return jsonify({"relevant_phrases": relevant_phrases}), 200

@document_bp.route('/<int:doc_id>/concept_map', methods=['POST'])
@jwt_required()
def create_concept_map(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    user = User.query.get(get_jwt_identity())
    max_nodes = 6  # Por defecto para membresía básica
    if user.membership_type == 'premium':
        max_nodes = None  # Sin límite para membresía premium
    
    concept_map_image = generate_concept_map(document.content, max_nodes)
    
    return send_file(
        BytesIO(concept_map_image),
        mimetype='image/png',
        as_attachment=True,
        download_name=f'concept_map_{doc_id}.png'
    )

@document_bp.route('/<int:doc_id>/translate', methods=['POST'])
@jwt_required()
def translate_document(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    target_language = request.json.get('target_language')
    if not target_language:
        return jsonify({"message": "Target language is required"}), 400
    
    user = User.query.get(get_jwt_identity())
    allowed_languages = ['en', 'es', 'fr', 'de']  # Idiomas permitidos para membresía básica
    if user.membership_type != 'premium' and target_language not in allowed_languages:
        return jsonify({"message": "Language not available for your membership level"}), 403
    
    translated_text = translate_text(document.content, target_language)
    return jsonify({"translated_text": translated_text}), 200
