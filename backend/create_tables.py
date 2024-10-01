import os
import sys
from sqlalchemy import inspect

# Añadir el directorio padre al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app, db
from backend.config import Config

app = create_app()

def create_tables():
    with app.app_context():
        print(f"Attempting to connect to database: {Config.SQLALCHEMY_DATABASE_URI}")
        try:
            # Intentar crear las tablas
            db.create_all()
            print("create_all() executed without errors.")

            # Verificar qué tablas existen realmente en la base de datos
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables in the database: {existing_tables}")

            # Verificar si todas las tablas definidas en los modelos existen
            expected_tables = db.metadata.tables.keys()
            print(f"Expected tables based on models: {expected_tables}")

            missing_tables = set(expected_tables) - set(existing_tables)
            if missing_tables:
                print(f"Warning: The following tables are missing: {missing_tables}")
            else:
                print("All expected tables exist in the database.")

        except Exception as e:
            print(f"An error occurred while creating tables: {e}")
            print("Error details:")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    create_tables()