class AuthenticationError(Exception):
    """Excepción para errores de autenticación."""
    pass

class AuthorizationError(Exception):
    """Excepción para errores de autorización."""
    pass

class ValidationError(Exception):
    """Excepción para errores de validación de datos."""
    pass

class ResourceNotFoundError(Exception):
    """Excepción para recursos no encontrados."""
    pass

class DatabaseError(Exception):
    """Excepción para errores relacionados con la base de datos."""
    pass

class ExternalServiceError(Exception):
    """Excepción para errores en servicios externos."""
    pass