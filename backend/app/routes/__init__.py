from flask import Blueprint
from .auth import auth
from .document import document
from .text_processing import text_processing
from .membership import membership
from .chat import chat

api = Blueprint('api', __name__)

api.register_blueprint(auth, url_prefix='/auth')
api.register_blueprint(document, url_prefix='/document')
api.register_blueprint(text_processing, url_prefix='/process')
api.register_blueprint(membership, url_prefix='/membership')
api.register_blueprint(chat, url_prefix='/chat')