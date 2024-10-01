import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql+pymysql://username:password@localhost/mapify_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Firebase
    FIREBASE_CONFIG = {
        # Añade aquí la configuración de Firebase
    }

    # Configuración de DeepL
    DEEPL_API_KEY = os.environ.get('DEEPL_API_KEY')

    # Configuración de almacenamiento de archivos
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}