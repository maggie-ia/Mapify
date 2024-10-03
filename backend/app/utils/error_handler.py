import logging
from flask import jsonify

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

def handle_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    logger.error(f"Error: {error.message}", exc_info=True)
    return response

def setup_error_handlers(app):
    app.register_error_handler(AppError, handle_error)
    
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("An internal error occurred", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500