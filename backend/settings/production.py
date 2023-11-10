from .base import *
import dj_database_url

DEBUG = False

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://127.0.0.1:3000',
    'https://localhost:3000',
]

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('POSTGRES_URL'),
        conn_health_checks=True,
        conn_max_age=600
    )
}
