import logging
from flask_jwt_extended import get_jwt_identity
import spacy
from transformers import pipeline
import language_tool_python
from app.models.user import User
from app.utils.exceptions import (
    TextProcessingError, SummarizationError, ParaphraseError, SynthesisError,
    RelevantPhrasesError, TranslationError, ConceptMapError, ProblemSolvingError
)
from app.utils.error_handler import AppError, log_error
from app.services.text_operations import (
    translate_text, summarize_text, paraphrase_text, synthesize_text,
    generate_concept_map, generate_relevant_phrases, solve_problem, check_grammar
)
from app.extensions import cache, db
from sqlalchemy.orm import with_lockmode
from rq import Queue
from redis import Redis

logger = logging.getLogger(__name__)

nlp = spacy.load("es_core_news_sm")
summarizer = pipeline("summarization")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")
tool = language_tool_python.LanguageTool('es')

# Configuración de la cola de tareas
redis_conn = Redis()
q = Queue('text_processing', connection=redis_conn)

def validate_text_input(text, max_length=10000):
    if not text:
        raise AppError("El texto de entrada está vacío")
    if len(text) > max_length:
        raise AppError(f"El texto excede la longitud máxima permitida de {max_length} caracteres")

@cache.memoize(timeout=3600)  # Cache for 1 hour
def cached_summarize_text(text):
    return summarize_text(text)

@cache.memoize(timeout=3600)  # Cache for 1 hour
def cached_paraphrase_text(text):
    return paraphrase_text(text)

def process_text(operation, text, target_language=None):
    user_id = get_jwt_identity()
    user = User.query.with_lockmode('update').get(user_id)
    if not user:
        log_error(f"Usuario no encontrado: {user_id}")
        raise TextProcessingError("Usuario no encontrado")

    validate_text_input(text)

    operations = {
        'translate': lambda: translate_text(text, target_language) if user.can_translate_to_language(target_language) else None,
        'summarize': lambda: cached_summarize_text(text),
        'paraphrase': lambda: cached_paraphrase_text(text),
        'synthesize': lambda: synthesize_text(text),
        'conceptMap': lambda: generate_concept_map(text),
        'relevantPhrases': lambda: generate_relevant_phrases(text),
        'problemSolving': lambda: solve_problem(text),
        'grammarCheck': lambda: check_grammar(text)
    }

    try:
        if operation not in operations:
            log_error(f"Operación no soportada: {operation}", extra={"user_id": user_id})
            raise TextProcessingError("Operación no soportada")

        # Encolar la tarea para procesamiento asíncrono
        job = q.enqueue(operations[operation])
        result = job.result

        if result is None and operation == 'translate':
            error_message = f"El usuario {user_id} intentó una traducción no autorizada al idioma {target_language}"
            log_error(error_message, extra={"user_id": user_id, "target_language": target_language})
            raise TranslationError("Idioma de traducción no autorizado")

        logger.info(f"Operación {operation} completada con éxito para el usuario {user_id}")
        return result
    except Exception as e:
        error_message = f"Error al procesar {operation} para el usuario {user_id}: {str(e)}"
        log_error(error_message, extra={"user_id": user_id, "operation": operation})
        raise TextProcessingError("Ocurrió un error al procesar su solicitud")
    finally:
        db.session.commit()

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