import itsdangerous
from datetime import datetime, timezone
from django.conf import settings


def generate_time_based_token(token_object):
    token_object['timestamp'] = datetime.now(tz=timezone.utc).timestamp()
    serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)
    token = serializer.dumps(token_object)
    return token
