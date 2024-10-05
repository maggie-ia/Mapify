from flask import jsonify
import logging

logger = logging.getLogger(__name__)

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

def handle_app_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    logger.error(f"AppError: {error.message}", exc_info=True)
    return response

def setup_error_handlers(app):
    app.register_error_handler(AppError, handle_app_error)
    
    @app.errorhandler(404)
    def not_found_error(error):
        logger.error("404 error occurred", exc_info=True)
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("500 error occurred", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

def log_error(message, extra=None):
    if extra:
        logger.error(f"{message} - Extra info: {extra}", exc_info=True)
    else:
        logger.error(message, exc_info=True)