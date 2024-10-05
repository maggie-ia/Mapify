import logging
from logging.handlers import RotatingFileHandler
import os
from flask import request

class RequestFormatter(logging.Formatter):
    def format(self, record):
        record.url = request.url
        record.remote_addr = request.remote_addr
        return super().format(record)

def setup_logging(app):
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/mapify.log', maxBytes=10240, backupCount=10)
    formatter = RequestFormatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d] - from %(remote_addr)s - %(url)s'
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)

    # Configurar el logger de errores
    error_file_handler = RotatingFileHandler('logs/mapify_errors.log', maxBytes=10240, backupCount=10)
    error_file_handler.setFormatter(formatter)
    error_file_handler.setLevel(logging.ERROR)
    error_logger = logging.getLogger('mapify_error_logger')
    error_logger.addHandler(error_file_handler)
    error_logger.setLevel(logging.ERROR)