from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
import logging
from logging.handlers import RotatingFileHandler
from .config.logging_config import setup_logging
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    setup_logging(app)

    from app.routes import main, auth, text_processing, membership, chat
    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(text_processing, url_prefix='/api')
    app.register_blueprint(membership, url_prefix='/membership')
    app.register_blueprint(chat, url_prefix='/chat')

    # Configurar el logger para la aplicación
    app.logger.setLevel(logging.INFO)
    app.logger.info('Mapify application startup')

    return app

from app import models