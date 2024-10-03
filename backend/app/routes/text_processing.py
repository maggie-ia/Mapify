from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.services.text_operations import process_text
from app.services.membership_service import can_perform_operation, increment_operation
from app.utils.exceptions import TextProcessingError
import logging

text_processing = Blueprint('text_processing', __name__)
logger = logging.getLogger(__name__)

@text_processing.route('/process', methods=['POST'])
@jwt_required()
def process_text_route():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    target_language = data.get('targetLanguage')
    
    if not operation or not text:
        return jsonify({"error": "Operación o texto faltante"}), 400
    
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not can_perform_operation(user_id, operation):
        return jsonify({"error": "Límite de operaciones alcanzado"}), 403
    
    try:
        result = process_text(operation, text, target_language)
        increment_operation(user_id, operation)
        return jsonify({"result": result}), 200
    except TextProcessingError as e:
        logger.error(f"Error de procesamiento de texto: {str(e)}")
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({"error": "Ocurrió un error inesperado"}), 500