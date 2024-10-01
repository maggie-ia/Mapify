import os
import mysql.connector
import firebase_admin
from firebase_admin import credentials, auth
import requests
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Configuración de la base de datos usando variables de entorno
DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_PORT = os.getenv('DB_PORT', 3306)

# Configuración de Firebase usando variables de entorno
FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n') if os.getenv("FIREBASE_PRIVATE_KEY") else None,
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_EMAIL").replace("firebase-adminsdk", "firebase-adminsdk.certs") if os.getenv("FIREBASE_CLIENT_EMAIL") else None
}

# Configuración de DeepL usando variables de entorno
DEEPL_API_KEY = os.getenv('DEEPL_API_KEY')


# Prueba de conexión a la base de datos MySQL
def test_mysql_connection():
    print("Probando conexión a la base de datos MySQL...")
    try:
        # Crear conexión usando mysql.connector con variables de entorno
        db_config = {
            'host': DB_HOST,
            'user': DB_USER,
            'password': DB_PASSWORD,
            'database': DB_NAME,
            'port': int(DB_PORT)
        }
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print("Conexión a MySQL exitosa.")
        connection.close()
    except Exception as e:
        print(f"Error al conectar con MySQL: {e}")


# Prueba de conexión a Firebase
def test_firebase_connection():
    print("Probando conexión a Firebase...")
    try:
        # Inicializar Firebase con el diccionario FIREBASE_CONFIG
        cred = credentials.Certificate(FIREBASE_CONFIG)
        firebase_admin.initialize_app(cred)
        # Realizar una operación de prueba en Firebase (listar usuarios)
        users = auth.list_users().users
        print(f"Conexión a Firebase exitosa. Usuarios en Firebase: {len(users)}")
    except Exception as e:
        print(f"Error al conectar con Firebase: {e}")


# Prueba de la API de DeepL
def test_deepl_api():
    print("Probando conexión a la API de DeepL...")
    try:
        # URL para verificar la cuenta de DeepL
        url = "https://api-free.deepl.com/v2/usage"
        headers = {"Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}"}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Conexión a la API de DeepL exitosa. Información de uso: {data}")
        else:
            print(f"Error al conectar con la API de DeepL. Código de estado: {response.status_code}, Detalles: {response.text}")
    except Exception as e:
        print(f"Error al conectar con la API de DeepL: {e}")


# Ejecutar todas las pruebas
if __name__ == "__main__":
    print("Iniciando pruebas de conexión para Mapify...\n")
    test_mysql_connection()
    print()
    test_firebase_connection()
    print()
    test_deepl_api()
    print("\nPruebas completadas.")
