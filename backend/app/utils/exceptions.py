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

class AuthenticationError(Exception):
    """Excepción para errores de autenticación."""
    pass

class MembershipError(Exception):
    """Excepción para errores relacionados con la membresía."""
    pass

class ExportError(Exception):
    """Excepción para errores durante la exportación de resultados."""
    pass