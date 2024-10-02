from flask import Blueprint
from .text_processing import text_processing
from .membership import membership

api = Blueprint('api', __name__)

api.register_blueprint(text_processing)
api.register_blueprint(membership)

<<<<<<< HEAD
# Aquí puedes agregar otras rutas generales de la API si es necesario
=======
# Aquí puedes agregar otras rutas generales de la API si es necesario
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
