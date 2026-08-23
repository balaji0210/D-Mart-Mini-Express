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

# Default Supabase Database URL fallback for Vercel serverless functions
DEFAULT_SUPABASE_URL = "postgresql://postgres.ihlfpapcvfhvvafvioce:22112004Balaji%40@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
if not os.environ.get('DATABASE_URL'):
    os.environ['DATABASE_URL'] = DEFAULT_SUPABASE_URL

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

import django
django.setup()

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
