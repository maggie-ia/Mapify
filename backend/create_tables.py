import os
import sys
from sqlalchemy import inspect

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models import User, Document, Operation, Export

app = create_app()

def create_tables():
    with app.app_context():
        print(f"Attempting to connect to database: {app.config['SQLALCHEMY_DATABASE_URI']}")
        try:
            # Create tables in the correct order
            tables = [User.__table__, Document.__table__, Operation.__table__, Export.__table__]
            for table in tables:
                if not inspect(db.engine).has_table(table.name):
                    print(f"Creating table: {table.name}")
                    table.create(db.engine)
                else:
                    print(f"Table {table.name} already exists")

            print("All tables created successfully.")

            # Verify existing tables
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables in the database: {existing_tables}")

            # Verify if all expected tables exist
            expected_tables = set([User.__tablename__, Document.__tablename__, Operation.__tablename__, Export.__tablename__])
            print(f"Expected tables based on models: {expected_tables}")

            missing_tables = expected_tables - set(existing_tables)
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