from flask import jsonify
import logging
from .error_monitoring import monitor_error

logger = logging.getLogger(__name__)

class AppError(Exception):
    def __init__(self, message, status_code=400, payload=None, error_type=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload
        self.error_type = error_type or self.__class__.__name__

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['error_type'] = self.error_type
        return rv

def handle_app_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    logger.error(f"{error.error_type}: {error.message}", exc_info=True)
    monitor_error(error.error_type)
    return response

def setup_error_handlers(app):
    app.register_error_handler(AppError, handle_app_error)
    
    @app.errorhandler(404)
    def not_found_error(error):
        logger.error("NotFoundError", exc_info=True)
        monitor_error("NotFoundError")
        return jsonify({"error": "Not found", "error_type": "NotFoundError"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("InternalServerError", exc_info=True)
        monitor_error("InternalServerError")
        return jsonify({"error": "Internal server error", "error_type": "InternalServerError"}), 500

def log_error(message, error_type=None, extra=None):
    error_type = error_type or "GenericError"
    if extra:
        logger.error(f"{error_type}: {message} - Extra info: {extra}", exc_info=True)
    else:
        logger.error(f"{error_type}: {message}", exc_info=True)
    monitor_error(error_type)