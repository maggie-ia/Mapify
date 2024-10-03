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
from app.utils.exceptions import TextProcessingError
import logging

text_processing = Blueprint('text_processing', __name__)
logger = logging.getLogger(__name__)

@text_processing.route('/process', methods=['POST'])
@jwt_required()
def process_text():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    
    if not operation or not text:
        return jsonify({"error": "Operación o texto faltante"}), 400
    
    try:
        result = perform_operation(operation, text)
        return jsonify({"result": result}), 200
    except TextProcessingError as e:
        logger.error(f"Error de procesamiento de texto: {str(e)}")
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({"error": "Ocurrió un error inesperado"}), 500

def perform_operation(operation, text):
    if operation == 'summarize':
        return summarize_text(text)
    elif operation == 'paraphrase':
        return paraphrase_text(text)
    elif operation == 'synthesize':
        return synthesize_text(text)
    elif operation == 'relevantPhrases':
        return extract_relevant_phrases(text)
    elif operation == 'conceptMap':
        return generate_concept_map(text)
    elif operation == 'translate':
        target_language = request.json.get('targetLanguage')
        if not target_language:
            raise ValueError("Se requiere el idioma de destino para la traducción")
        return translate_text(text, target_language)
    else:
        raise ValueError("Operación no soportada")
