import logging
from app.utils.exceptions import (
    SummarizationError,
    ParaphraseError,
    SynthesisError,
    RelevantPhrasesError,
    TranslationError,
    ConceptMapError
)
import re
import base64
from io import BytesIO
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import numpy as np
import spacy
import networkx as nx
import matplotlib.pyplot as plt
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from deep_translator import GoogleTranslator
import language_tool_python
import PyPDF2
import docx
import pytesseract
from app.services.text_operations import process_text
from app.services.membership_service import can_perform_operation, increment_operation
from app.utils.exceptions import TextProcessingError
from flask import current_app
from app.models.user import User
from app.services.translation_service import translate_text
<<<<<<< HEAD
from app.utils.error_handler import AppError
=======
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3

text_processing = Blueprint('text_processing', __name__)
logger = logging.getLogger(__name__)

summarizer = pipeline("summarization")
nlp = spacy.load("es_core_news_sm")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('es')

<<<<<<< HEAD
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
=======
class AppError(Exception):
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3

def validate_text_input(text, max_length=10000):
    if not text:
        raise AppError("El texto de entrada está vacío")
    if len(text) > max_length:
        raise AppError(f"El texto excede la longitud máxima permitida de {max_length} caracteres")

def summarize_text(text, max_length=150, min_length=50):
    validate_text_input(text)
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Error al resumir el texto: {str(e)}")
<<<<<<< HEAD
        raise AppError("No se pudo generar el resumen del texto")
=======
        raise SummarizationError("No se pudo generar el resumen del texto")
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3

def paraphrase_text(text):
    validate_text_input(text)
    try:
        paraphrased = paraphraser(text, max_length=len(text), do_sample=True, top_k=50, top_p=0.95, num_return_sequences=1)[0]['generated_text']
        return paraphrased
    except Exception as e:
        logger.error(f"Error al parafrasear el texto: {str(e)}")
        raise ParaphraseError("No se pudo parafrasear el texto. Por favor, intente con un texto diferente.")

def synthesize_text(text):
    validate_text_input(text)
    try:
        summary = summarize_text(text, max_length=100, min_length=30)
        synthesis = paraphrase_text(summary)
        return synthesis
    except Exception as e:
        logger.error(f"Error al sintetizar el texto: {str(e)}")
        raise SynthesisError("No se pudo sintetizar el texto. Por favor, verifique el contenido e intente nuevamente.")

<<<<<<< HEAD
def identify_problem_type(text):
    patterns = {
        "matemática": r'\b(?:calcul[ae]|encuentr[ae]|determin[ae])\b',
        "física": r'\b(?:velocidad|aceleración|fuerza|energía)\b',
        "química": r'\b(?:mol[es]?|concentración|pH)\b'
    }
    for problem_type, pattern in patterns.items():
        if re.search(pattern, text, re.IGNORECASE):
            return problem_type
    return "general"
    

def solve_problem(text):
    problem_type = identify_problem_type(text)
    methods = [
        ("Método analítico", "Resolver el problema usando ecuaciones y fórmulas."),
        ("Método numérico", "Utilizar algoritmos computacionales para aproximar la solución."),
        ("Método gráfico", "Representar visualmente el problema y su solución.")
    ]
    step_by_step = explain_problem(text)
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

def solve_problem_analytical(problem):
    # Implementar método analítico
    return "Solución analítica del problema utilizando ecuaciones y fórmulas matemáticas."

def solve_problem_numerical(problem):
    # Implementar método numérico
    return "Solución numérica del problema utilizando algoritmos computacionales."

def solve_problem_graphical(problem):
    # Implementar método gráfico
    return "Solución gráfica del problema utilizando representaciones visuales."

def get_additional_resources(problem):
    """
    Proporciona recursos adicionales relacionados con el problema.
    """
    # En una implementación real, esto podría ser una llamada a una base de datos o API
    resources = [
        {
            "title": f"Khan Academy - Resolución de problemas de {problem_type}",
            "url": f"https://es.khanacademy.org/math/{problem_type}"
        },
        {
            "title": "Wolfram Alpha - Calculadora y solucionador de problemas",
            "url": "https://www.wolframalpha.com/"
        },
        {
            "title": "MIT OpenCourseWare - Métodos de resolución de problemas",
            "url": "https://ocw.mit.edu/courses/mathematics/"
        }
    ]
    return resources

def explain_problem(text):
    steps = [
        "Paso 1: Identificar las variables y datos conocidos del problema.",
        "Paso 2: Determinar qué se está pidiendo calcular o encontrar.",
        "Paso 3: Seleccionar la fórmula o método apropiado para resolver el problema.",
        "Paso 4: Aplicar el método seleccionado, mostrando cada paso del cálculo.",
        "Paso 5: Verificar que la solución tenga sentido en el contexto del problema.",
        "Paso 6: Interpretar el resultado y formular una conclusión."
    ]
    return "\n".join(steps)

def summarize_text(text, max_length=150, min_length=50):
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logger.error(f"Error al resumir el texto: {str(e)}")
        raise SummarizationError("No se pudo generar el resumen del texto.")

def paraphrase_text(text):
    try:
        paraphrased = paraphraser(text, max_length=len(text), do_sample=True, top_k=50, top_p=0.95, num_return_sequences=1)[0]['generated_text']
        return paraphrased
    except Exception as e:
        logger.error(f"Error al parafrasear el texto: {str(e)}")
        raise ParaphraseError("No se pudo parafrasear el texto.")

def synthesize_text(text):
    try:
        summary = summarize_text(text, max_length=100, min_length=30)
        synthesis = paraphrase_text(summary)
        return synthesis
    except Exception as e:
        logger.error(f"Error al sintetizar el texto: {str(e)}")
        raise SynthesisError("No se pudo sintetizar el texto.")  

def generate_relevant_phrases(text, num_phrases=5):
=======
def generate_relevant_phrases(text, num_phrases=5):
    validate_text_input(text)
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3
    try:
        sentences = text.split('.')
        vectorizer = TfidfVectorizer(stop_words='spanish')
        tfidf_matrix = vectorizer.fit_transform(sentences)
        sentence_scores = tfidf_matrix.sum(axis=1).A1
        top_sentence_indices = sentence_scores.argsort()[-num_phrases:][::-1]
        relevant_phrases = [sentences[i].strip() for i in top_sentence_indices]
        return relevant_phrases
    except Exception as e:
        logger.error(f"Error al extraer frases relevantes: {str(e)}")
        raise RelevantPhrasesError("No se pudieron extraer frases relevantes. Por favor, intente con un texto más largo.")

<<<<<<< HEAD
def extract_relevant_phrases(text, num_phrases=5):
    try:
        sentences = text.split('.')
        vectorizer = TfidfVectorizer(stop_words='spanish')
        tfidf_matrix = vectorizer.fit_transform(sentences)
        sentence_scores = tfidf_matrix.sum(axis=1).A1
        top_sentence_indices = sentence_scores.argsort()[-num_phrases:][::-1]
        relevant_phrases = [sentences[i].strip() for i in top_sentence_indices]
        return relevant_phrases
    except Exception as e:
        logger.error(f"Error al extraer frases relevantes: {str(e)}")
        raise RelevantPhrasesError("No se pudieron extraer frases relevantes.")

def translate_text(text, target_language):
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        logger.error(f"Error al traducir el texto: {str(e)}")
        raise TranslationError("No se pudo traducir el texto.")

def generate_concept_map(text):
=======
def generate_concept_map(text):
    validate_text_input(text)
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3
    try:
        doc = nlp(text)
        G = nx.Graph()
        
        # Extraer entidades y conceptos clave
        entities = [ent.text for ent in doc.ents]
        noun_chunks = [chunk.text for chunk in doc.noun_chunks]
        
        # Añadir nodos al grafo
        G.add_node("Concepto Central", size=3000, color='lightblue')
        for i, concept in enumerate(set(entities + noun_chunks)[:5]):  # Limitar a 5 conceptos
            G.add_node(concept, size=2000, color='lightgreen')
            G.add_edge("Concepto Central", concept)
        
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(G)
        nx.draw(G, pos, with_labels=True, node_color=[node[1]['color'] for node in G.nodes(data=True)], 
                node_size=[node[1]['size'] for node in G.nodes(data=True)], font_size=8, font_weight='bold')
        
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        logger.error(f"Error al generar el mapa conceptual: {str(e)}")
<<<<<<< HEAD
        raise ConceptMapError("No se pudo generar el mapa conceptual.")

def check_grammar(text):
    matches = tool.check(text)
    return [str(error) for error in matches]


def extract_text_from_file(file_path):
    file_extension = file_path.split('.')[-1].lower()
    
    if file_extension in ['jpg', 'jpeg', 'png']:
        return pytesseract.image_to_string(file_path)
    elif file_extension == 'pdf':
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            return " ".join([page.extract_text() for page in reader.pages])
    elif file_extension in ['doc', 'docx']:
        doc = docx.Document(file_path)
        return " ".join([paragraph.text for paragraph in doc.paragraphs])
    else:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
        
def process_text(user_id, operation, text, target_language=None):
    user = User.query.get(user_id)
    if not user:
        logger.error(f"Usuario no encontrado: {user_id}")
        return {"error": "Usuario no encontrado"}, 404


    operations = {
        'translate': lambda: translate_text(text, target_language) if user.can_translate_to_language(target_language) else None,
        'summarize': lambda: summarize_text(text),
        'paraphrase': lambda: paraphrase_text(text),
        'synthesize': lambda: synthesize_text(text),
        'conceptMap': lambda: generate_concept_map(text),
        'relevantPhrases': lambda: extract_relevant_phrases(text),
        'problemSolving': lambda: solve_problem(text)
    }

    try:
        if operation not in operations:
            logger.warning(f"Operación no soportada: {operation}")
            return {"error": "Operación no soportada"}, 400

        result = operations[operation]()
        if result is None and operation == 'translate':
            error_message = f"El usuario {user_id} intentó una traducción no autorizada al idioma {target_language}"
            logger.warning(error_message)
            user.log_error(error_message)
            return {"error": "Idioma de traducción no autorizado"}, 403

        logger.info(f"Operación {operation} completada con éxito para el usuario {user_id}")
        return {"result": result}, 200
    except Exception as e:
        error_message = f"Error al procesar {operation} para el usuario {user_id}: {str(e)}"
        logger.error(error_message)
        user.log_error(error_message)
        return {"error": "Ocurrió un error al procesar su solicitud"}, 500

def get_writing_assistance(text, membership_type):
    matches = tool.check(text)
    suggestions = []
    
    for match in matches:
        if membership_type == 'premium' or (membership_type == 'basic' and match.ruleIssueType in ['grammar', 'typos']):
            suggestion = {
                'original': text[match.offset:match.offset + match.errorLength],
                'suggested': match.replacements[0] if match.replacements else '',
                'message': match.message,
                'type': match.ruleIssueType
            }
            suggestions.append(suggestion)
    
    return suggestions[:10]  # Limitar a 10 sugerencias para evitar sobrecarga
=======
        raise ConceptMapError("No se pudo generar el mapa conceptual. Por favor, intente con un texto más estructurado.")

def translate_text(text, target_language):
    validate_text_input(text)
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        logger.error(f"Error al traducir el texto: {str(e)}")
        raise TranslationError("No se pudo traducir el texto. Por favor, verifique el idioma de destino e intente nuevamente.")

def check_grammar(text):
    validate_text_input(text)
    matches = tool.check(text)
    return [str(error) for error in matches]
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3
