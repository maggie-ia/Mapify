from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.document import Document
from app.services.text_processing import summarize_text, paraphrase_text
from app.services.concept_map_service import generate_concept_map
from app import db
from werkzeug.utils import secure_filename
import os
from io import BytesIO

document_bp = Blueprint('document', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@document_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        new_document = Document(
            filename=filename,
            content=content,
            user_id=get_jwt_identity(),
            file_type=filename.rsplit('.', 1)[1].lower()
        )
        db.session.add(new_document)
        db.session.commit()
        
        return jsonify({"message": "File uploaded successfully"}), 201
    return jsonify({"message": "File type not allowed"}), 400

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

@document_bp.route('/<int:doc_id>/concept_map', methods=['POST'])
@jwt_required()
def create_concept_map(doc_id):
    document = Document.query.get_or_404(doc_id)
    if document.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    
    max_nodes = 6  # Por defecto para membresía básica
    
    concept_map_image = generate_concept_map(document.content, max_nodes)
    
    return send_file(
        BytesIO(concept_map_image),
        mimetype='image/png',
        as_attachment=True,
        download_name=f'concept_map_{doc_id}.png'
    )