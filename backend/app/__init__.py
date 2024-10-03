from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config
from .utils.logger import setup_logger
from .utils.error_handler import setup_error_handlers

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

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app