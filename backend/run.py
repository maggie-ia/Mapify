import sys
import os

# Add the virtual environment's site-packages to the Python path
venv_path = os.path.dirname(os.path.dirname(sys.executable))
site_packages = os.path.join(venv_path, 'Lib', 'site-packages')
sys.path.insert(0, site_packages)

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run()