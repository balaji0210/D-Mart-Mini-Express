import os
import sys

# Set up module resolution for Django backend and apps
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
APPS_DIR = os.path.join(BACKEND_DIR, 'apps')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if APPS_DIR not in sys.path:
    sys.path.insert(0, APPS_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
