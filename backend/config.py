import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Firebase (si es necesario)
    FIREBASE_CONFIG = {
        # Añade aquí la configuración de Firebase si la tienes
    }

    # Configuración de DeepL (si es necesario)
    DEEPL_API_KEY = os.environ.get('DEEPL_API_KEY')

    # Configuración de almacenamiento de archivos (si es necesario)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}