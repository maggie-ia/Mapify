import os
import sys

# Añadir el directorio padre al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app, db

app = create_app()

def create_tables():
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")

if __name__ == "__main__":
    create_tables()