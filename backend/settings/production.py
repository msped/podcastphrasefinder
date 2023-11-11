from .base import *
import dj_database_url
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

DEBUG = False

CORS_ALLOWED_ORIGINS = [
    'https://podcastphrasefinder.com',
    'https://www.podcastphrasefinder.com'

]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly'
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('POSTGRES_URL'),
        conn_health_checks=True,
        conn_max_age=600
    )
}


CSRF_TRUSTED_ORIGINS = [
    'https://podcastphrasefinder.com',
    'https://www.podcastphrasefinder.com'
]

STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")

sentry_sdk.init(
    dsn=os.environ.get('sentry_dns'),
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True
)
