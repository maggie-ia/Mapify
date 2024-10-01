import os
import sys
from sqlalchemy import inspect

# Añadir el directorio padre al sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models import User, Document, Operation, Export

app = create_app()

def create_tables():
    with app.app_context():
        print(f"Attempting to connect to database: {app.config['SQLALCHEMY_DATABASE_URI']}")
        try:
            # Intentar crear las tablas
            db.create_all()
            print("create_all() executed without errors.")

            # Verificar qué tablas existen realmente en la base de datos
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables in the database: {existing_tables}")

            # Verificar si todas las tablas definidas en los modelos existen
            expected_tables = set([User.__tablename__, Document.__tablename__, Operation.__tablename__, Export.__tablename__])
            print(f"Expected tables based on models: {expected_tables}")

            missing_tables = expected_tables - set(existing_tables)
            if missing_tables:
                print(f"Warning: The following tables are missing: {missing_tables}")
                print("Attempting to create missing tables individually...")
                for table in missing_tables:
                    if table == User.__tablename__:
                        User.__table__.create(db.engine)
                    elif table == Document.__tablename__:
                        Document.__table__.create(db.engine)
                    elif table == Operation.__tablename__:
                        Operation.__table__.create(db.engine)
                    elif table == Export.__tablename__:
                        Export.__table__.create(db.engine)
                print("Individual table creation attempt completed.")
            else:
                print("All expected tables exist in the database.")

        except Exception as e:
            print(f"An error occurred while creating tables: {e}")
            print("Error details:")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    create_tables()