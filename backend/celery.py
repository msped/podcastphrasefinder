from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
if os.environ.get('DJANGO_SETTINGS_MODULE') == "backend.settings.development":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.production')

app = Celery('backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()