from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config
from .utils.logger import setup_logger
from .utils.error_handler import setup_error_handlers
<<<<<<< HEAD
import logging
from .config.logging_config import setup_logging
=======
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    setup_logger(app)
    setup_error_handlers(app)
<<<<<<< HEAD
    setup_logging(app)

    from .routes import bp as main_bp
    from .routes import main, auth, text_processing, membership, chat
    app.register_blueprint(main_bp)
    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(text_processing, url_prefix='/api')
    app.register_blueprint(membership, url_prefix='/membership')
    app.register_blueprint(chat, url_prefix='/chat')

    # Configurar el logger para la aplicación
    app.logger.setLevel(logging.INFO)
    app.logger.info('Mapify application startup')

    return app

from . import models
=======

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
>>>>>>> 04e77d524bae34fb8e59c2e49fffece4081ec6b3
