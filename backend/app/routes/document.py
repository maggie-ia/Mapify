from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.document import Document
from app import db
from app.utils.file_validators import validate_file_type, validate_file_size
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.membership_service import get_page_limit

document = Blueprint('document', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@document.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado ningún archivo"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No se ha seleccionado ningún archivo"}), 400
    
    try:
        validate_file_type(file.filename, ALLOWED_EXTENSIONS)
        validate_file_size(file, MAX_FILE_SIZE)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    user_id = get_jwt_identity()
    page_limit = get_page_limit(user_id)
    
    # Aquí procesarías el archivo y contarías las páginas
    # Por ahora, asumiremos que tenemos una función para contar páginas
    page_count = count_pages(file)
    
    if page_count > page_limit:
        return jsonify({"error": f"El documento excede el límite de {page_limit} páginas para su nivel de membresía"}), 403

    filename = secure_filename(file.filename)
    # Aquí implementarías la lógica para guardar el archivo y crear un objeto Document
    # Por ejemplo:
    # file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # file.save(file_path)
    # document = Document(filename=filename, file_path=file_path, user_id=user_id)
    # db.session.add(document)
    # db.session.commit()

    return jsonify({"message": "Archivo subido exitosamente", "document_id": document.id}), 201

def count_pages(file):
    # Implementar la lógica de conteo de páginas aquí
    # Esta es una función de marcador de posición
    return 1  # Por demostración, siempre devuelve 1 página

@document.route('/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    document = Document.query.get_or_404(document_id)
    # Verificar si el usuario actual tiene permiso para acceder a este documento
    if document.user_id != get_jwt_identity():
        return jsonify({"error": "Acceso no autorizado"}), 403
    return jsonify({"id": document.id, "filename": document.filename, "created_at": document.created_at}), 200

@document.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    document = Document.query.get_or_404(document_id)
    # Verificar si el usuario actual tiene permiso para eliminar este documento
    if document.user_id != get_jwt_identity():
        return jsonify({"error": "Acceso no autorizado"}), 403
    db.session.delete(document)
    db.session.commit()
    return jsonify({"message": "Documento eliminado exitosamente"}), 200

@document.route('/user', methods=['GET'])
@jwt_required()
def get_user_documents():
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": doc.id, "filename": doc.filename, "created_at": doc.created_at} for doc in documents]), 200