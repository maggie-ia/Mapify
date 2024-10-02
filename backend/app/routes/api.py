from flask import Blueprint
from .text_processing import text_processing
from .membership import membership

api = Blueprint('api', __name__)

api.register_blueprint(text_processing)
api.register_blueprint(membership)

# Aquí puedes agregar otras rutas generales de la API si es necesario
