from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.services.text_operations import process_text
from app.services.membership_service import can_perform_operation, increment_operation
from app.services.membership_service import (
    can_perform_operation, increment_operation, get_page_limit,
    can_translate_to_language, get_concept_map_node_limit
)
from app import db
from marshmallow import Schema, fields, validate
from app.services.text_processing import *
from app.utils.exceptions import TextProcessingError
import logging

text_processing = Blueprint('text_processing', __name__)
logger = logging.getLogger(__name__)

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
def process_text_route():
    data = request.json
    operation = data.get('operation')
    text = data.get('text')
    target_language = data.get('targetLanguage')
    
    if not operation or not text:
        return jsonify({"error": "Operación o texto faltante"}), 400
    
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not can_perform_operation(user, operation):
        return jsonify({"error": "Límite de operaciones alcanzado"}), 403
    
    try:
        result = process_text(operation, text, target_language)
        increment_operation(user, operation)
        return jsonify({"result": result}), 200
    except TextProcessingError as e:
        logger.error(f"Error de procesamiento de texto: {str(e)}")
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({"error": "Ocurrió un error inesperado"}), 500

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
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    try:
        new_document = Document(content=text, user_id=user_id, operation_type=operation, result=result)
        db.session.add(new_document)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error saving operation result"}), 500

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

def solve_problem(text):
    """
    Intenta resolver un problema matemático, físico o químico.
    """
    problem_type = identify_problem_type(text)
    methods = generate_solution_methods(text, problem_type)
    step_by_step = explain_problem(text, problem_type)
    resources = get_additional_resources(problem_type)
    
    return {
        "problem_type": problem_type,
        "methods": methods,
        "step_by_step": step_by_step,
        "resources": resources
    }

def generate_solution_methods(text, problem_type):
    # Implementa la lógica para generar métodos de solución
    # Por ahora, usaremos métodos genéricos
    return [
        ("Método analítico", "Resolver el problema usando ecuaciones y fórmulas."),
        ("Método numérico", "Utilizar algoritmos computacionales para aproximar la solución."),
        ("Método gráfico", "Representar visualmente el problema y su solución.")
    ]

def explain_problem(text, problem_type):
    # Implementa la lógica para explicar el problema paso a paso
    # Por ahora, usaremos una explicación genérica
    return f"""
    1. Identifica las variables y datos conocidos del problema.
    2. Determina qué se está pidiendo calcular o encontrar.
    3. Selecciona la fórmula o método apropiado para resolver el problema.
    4. Aplica el método seleccionado, mostrando cada paso del cálculo.
    5. Verifica que la solución tenga sentido en el contexto del problema.
    6. Interpreta el resultado y formula una conclusión.
    """

def get_additional_resources(problem_type):
    # Implementa la lógica para obtener recursos adicionales
    # Por ahora, usaremos recursos genéricos
    return [
        {
            "title": f"Khan Academy - Resolución de problemas de {problem_type}",
            "url": f"https://es.khanacademy.org/math/{problem_type}"
        },
        {
            "title": "Wolfram Alpha - Calculadora y solucionador de problemas",
            "url": "https://www.wolframalpha.com/"
        }
    ]


@text_processing.route('/writing-assistance', methods=['POST'])
@jwt_required()
def writing_assistance():
    data = request.json
    text = data.get('text')
    membership_type = data.get('membershipType')
    user_id = get_jwt_identity()

    if not text or not membership_type:
        return jsonify({"error": "Invalid request"}), 400

    if not can_perform_operation(user_id, 'writingAssistant'):
        return jsonify({"error": "Operation limit reached for your membership level"}), 403

    suggestions = get_writing_assistance(text, membership_type)

    increment_operation(user_id, 'writingAssistant')

    return jsonify({"suggestions": suggestions}), 200