import os
import sys

# Añadir el directorio padre al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app, db
from backend.config import Config

app = create_app()

def create_tables():
    with app.app_context():
        print(f"Attempting to connect to database: {Config.SQLALCHEMY_DATABASE_URI}")
        try:
            db.create_all()
            print("Tables created successfully.")
            # Imprimir las tablas creadas
            for table in db.metadata.tables:
                print(f"Created table: {table}")
        except Exception as e:
            print(f"An error occurred while creating tables: {e}")

if __name__ == "__main__":
    create_tables()