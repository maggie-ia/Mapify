from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config
from .utils.logger import setup_logger
from .utils.error_handler import setup_error_handlers
import logging
from .config.logging_config import setup_logging
from .extensions import db, migrate, jwt, cache

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configuración de caché
    cache_config = {
        'CACHE_TYPE': 'simple',
        'CACHE_DEFAULT_TIMEOUT': 300
    }
    app.config.from_mapping(cache_config)
    cache.init_app(app)

    setup_logger(app)
    setup_error_handlers(app)
    setup_logging(app)

    from .routes import bp as main_bp
    from .routes import main, auth, text_processing, membership, chat, metrics
    app.register_blueprint(main_bp)
    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(text_processing, url_prefix='/api')
    app.register_blueprint(membership, url_prefix='/membership')
    app.register_blueprint(chat, url_prefix='/chat')
    app.register_blueprint(metrics, url_prefix='/metrics')

    app.logger.setLevel(logging.INFO)
    app.logger.info('Mapify application startup')

    return app

from . import models