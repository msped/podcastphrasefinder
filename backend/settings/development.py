from .base import *

DEBUG = True

CORS_ALLOW_ALL_ORIGINS = True

# Allow feeds served from localhost (e.g. fixture feeds via python -m http.server)
RSS_ALLOW_PRIVATE_HOSTS = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        'TEST': {
            'NAME': 'testdatabase'
        }
    }
}
