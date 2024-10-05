from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()

class TextProcessingError(Exception):
    """Excepción base para errores de procesamiento de texto."""
    pass

class SummarizationError(TextProcessingError):
    """Excepción para errores durante la summarización."""
    pass

class ParaphraseError(TextProcessingError):
    """Excepción para errores durante la paráfrasis."""
    pass

class SynthesisError(TextProcessingError):
    """Excepción para errores durante la síntesis."""
    pass

class ConceptMapError(TextProcessingError):
    """Excepción para errores durante la generación de mapas conceptuales."""
    pass

class TranslationError(TextProcessingError):
    """Excepción para errores durante la traducción."""
    pass

class RelevantPhrasesError(TextProcessingError):
    """Excepción para errores durante la extracción de frases relevantes."""
    pass

class ProblemSolvingError(TextProcessingError):
    """Excepción para errores durante la resolución de problemas."""
    pass