from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from .config.logging_config import setup_logging

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

    from app.routes import main
    app.register_blueprint(main)

    from app.routes import auth
    app.register_blueprint(auth, url_prefix='/auth')

    from app.routes import text_processing
    app.register_blueprint(text_processing, url_prefix='/api')

    return app

from app import models