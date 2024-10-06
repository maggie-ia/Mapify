import logging
from logging.handlers import RotatingFileHandler
import os
from flask import request, has_request_context
from datetime import datetime

try:
    from pythonjsonlogger import jsonlogger
except ImportError:
    jsonlogger = None
    print("Warning: jsonlogger not found. Using basic logger instead.")

class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None

        # Use a safer string formatting method
        log_message = self._fmt % record.__dict__
        if record.url:
            log_message += f" - URL: {record.url}"
        if record.remote_addr:
            log_message += f" - IP: {record.remote_addr}"
        return log_message

class CustomJsonFormatter(jsonlogger.JsonFormatter if jsonlogger else logging.Formatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        if not log_record.get('timestamp'):
            log_record['timestamp'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        if log_record.get('level'):
            log_record['level'] = log_record['level'].upper()
        else:
            log_record['level'] = record.levelname

def setup_logging(app):
    if not os.path.exists('logs'):
        os.mkdir('logs')

    file_handler = RotatingFileHandler('logs/mapify.log', maxBytes=10240, backupCount=10)
    formatter = RequestFormatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)

    error_file_handler = RotatingFileHandler('logs/mapify_errors.log', maxBytes=10240, backupCount=10)
    json_formatter = CustomJsonFormatter('%(timestamp)s %(level)s %(name)s %(message)s')
    error_file_handler.setFormatter(json_formatter)
    error_file_handler.setLevel(logging.ERROR)
    error_logger = logging.getLogger('mapify_error_logger')
    error_logger.addHandler(error_file_handler)
    error_logger.setLevel(logging.ERROR)

    if jsonlogger:
        json_handler = RotatingFileHandler('logs/mapify_all.json', maxBytes=10240, backupCount=10)
        json_handler.setFormatter(json_formatter)
        json_handler.setLevel(logging.DEBUG)
        app.logger.addHandler(json_handler)

    app.logger.info('Logging setup completed')