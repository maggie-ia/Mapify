from .text_operations import (
    summarize_text, paraphrase_text, synthesize_text, generate_relevant_phrases,
    generate_concept_map, translate_text, solve_problem, check_grammar
)
from app.utils.exceptions import (
    TextProcessingError, SummarizationError, ParaphraseError, SynthesisError,
    RelevantPhrasesError, TranslationError, ConceptMapError, ProblemSolvingError
)
from app.models.user import User
from flask_jwt_extended import get_jwt_identity
import logging

logger = logging.getLogger(__name__)

def process_text(operation, text, target_language=None):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logger.error(f"Usuario no encontrado: {user_id}")
        raise TextProcessingError("Usuario no encontrado")

    operations = {
        'translate': lambda: translate_text(text, target_language) if user.can_translate_to_language(target_language) else None,
        'summarize': lambda: summarize_text(text),
        'paraphrase': lambda: paraphrase_text(text),
        'synthesize': lambda: synthesize_text(text),
        'conceptMap': lambda: generate_concept_map(text),
        'relevantPhrases': lambda: generate_relevant_phrases(text),
        'problemSolving': lambda: solve_problem(text),
        'grammarCheck': lambda: check_grammar(text)
    }

    try:
        if operation not in operations:
            logger.warning(f"Operación no soportada: {operation}")
            raise TextProcessingError("Operación no soportada")

        result = operations[operation]()
        if result is None and operation == 'translate':
            error_message = f"El usuario {user_id} intentó una traducción no autorizada al idioma {target_language}"
            logger.warning(error_message)
            user.log_error(error_message)
            raise TranslationError("Idioma de traducción no autorizado")

        logger.info(f"Operación {operation} completada con éxito para el usuario {user_id}")
        return result
    except Exception as e:
        error_message = f"Error al procesar {operation} para el usuario {user_id}: {str(e)}"
        logger.error(error_message)
        user.log_error(error_message)
        raise TextProcessingError("Ocurrió un error al procesar su solicitud")