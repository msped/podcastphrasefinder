import itsdangerous
from django.test import TestCase, override_settings
from django.conf import settings

from ..utils import generate_time_based_token

# Mock settings for testing purposes


@override_settings(SECRET_KEY="testsecret")
class GenerateTimeBasedTokenTestCase(TestCase):
    def test_generate_time_based_token(self):
        token_object = {"podcast_id": 1}
        token = generate_time_based_token(token_object)

        serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)

        loaded_data = serializer.loads(token)
        self.assertEqual(loaded_data["podcast_id"], 1)
        self.assertTrue("timestamp" in loaded_data)

    def test_expired_token(self):
        token_object = {"podcast_id": 1}
        token = generate_time_based_token(token_object)

        serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)

        with self.assertRaises(itsdangerous.BadTimeSignature):
            loaded_data = serializer.loads(token, max_age=-1)

    def test_tampered_token(self):
        token_object = {"podcast_id": 1}
        token = generate_time_based_token(token_object)
        token += "xxxxxkxkxkx"

        serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)

        with self.assertRaises(itsdangerous.BadSignature):
            loaded_data = serializer.loads(token)
