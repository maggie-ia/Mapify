from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_caching import Cache
import logging
from config import Config
from .utils.logger import setup_logger
from .utils.error_handler import setup_error_handlers
from .config.logging_config import setup_logging

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Inicialización de extensiones
    init_extensions(app)

    # Configuración de Sentry
    setup_sentry(app)

    # Configuración del caché
    setup_cache(app)

    # Configuración de logging
    setup_logging_and_error_handlers(app)

    # Registro de blueprints
    register_blueprints(app)

    return app

def init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

def setup_sentry(app):
    if app.config.get('SENTRY_DSN'):
        try:
            import sentry_sdk
            from sentry_sdk.integrations.flask import FlaskIntegration
            sentry_sdk.init(
                dsn=app.config['SENTRY_DSN'],
                integrations=[FlaskIntegration()]
            )
            app.logger.info("Sentry initialized successfully")
        except ImportError:
            app.logger.warning("Sentry SDK not found. Sentry integration disabled.")

def setup_cache(app):
    cache_config = {
        'CACHE_TYPE': 'simple',
        'CACHE_DEFAULT_TIMEOUT': 300
    }
    app.config.from_mapping(cache_config)
    cache.init_app(app)

def setup_logging_and_error_handlers(app):
    setup_logger(app)
    setup_error_handlers(app)
    setup_logging(app)

def register_blueprints(app):
    from .routes import bp as main_bp
    from .routes import main, auth, text_processing, membership, chat, metrics

    app.register_blueprint(main_bp)
    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(text_processing, url_prefix='/api')
    app.register_blueprint(membership, url_prefix='/membership')
    app.register_blueprint(chat, url_prefix='/chat')
    app.register_blueprint(metrics, url_prefix='/metrics')

# Import models after the application initialization
from . import models