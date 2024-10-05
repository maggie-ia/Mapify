import logging
from logging.handlers import RotatingFileHandler
import os
from flask import request
from pythonjsonlogger import jsonlogger

class RequestFormatter(logging.Formatter):
    def format(self, record):
        record.url = request.url
        record.remote_addr = request.remote_addr
        return super().format(record)

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        if not log_record.get('timestamp'):
            log_record['timestamp'] = record.created
        if log_record.get('level'):
            log_record['level'] = log_record['level'].upper()
        else:
            log_record['level'] = record.levelname

def setup_logging(app):
    if not os.path.exists('logs'):
        os.mkdir('logs')

    # Configurar el logger principal
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
    json_formatter = CustomJsonFormatter('%(timestamp)s %(level)s %(name)s %(message)s')
    error_file_handler.setFormatter(json_formatter)
    error_file_handler.setLevel(logging.ERROR)
    error_logger = logging.getLogger('mapify_error_logger')
    error_logger.addHandler(error_file_handler)
    error_logger.setLevel(logging.ERROR)

    # Configurar el logger JSON para todos los logs
    json_handler = RotatingFileHandler('logs/mapify_all.json', maxBytes=10240, backupCount=10)
    json_handler.setFormatter(json_formatter)
    json_handler.setLevel(logging.DEBUG)
    app.logger.addHandler(json_handler)

    app.logger.info('Logging setup completed')