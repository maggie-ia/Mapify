import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde .env
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # Database configuration
    DB_HOST = os.environ.get('DB_HOST')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_NAME = os.environ.get('DB_NAME')
    
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configuración de Firebase
    FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
    FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
    FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n') if os.getenv("FIREBASE_PRIVATE_KEY") else None
    FIREBASE_PRIVATE_KEY_ID = os.getenv("FIREBASE_PRIVATE_KEY_ID")
    FIREBASE_CLIENT_ID = os.getenv("FIREBASE_CLIENT_ID")

    # Configuración de DeepL
    DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")

    # Configuración de subida de archivos
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER") or os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'txt', 'docx'}