from rest_framework.test import APITestCase

from ..utils import get_video_id


class TestUtilsFunctions(APITestCase):

    def test_valid_youtube_url(self):
        response = get_video_id("https://www.youtube.com/watch?v=abc123")
        self.assertEqual(response, "abc123")

    def test_youtube_url_without_http(self):
        response = get_video_id("www.youtube.com/watch?v=abc123")
        self.assertEqual(response, "abc123")

    def test_youtube_url_with_invalid_query_parameter(self):
        response = get_video_id("https://www.youtube.com/watch?v=")
        self.assertIsNone(response)

    def test_youtube_url_without_query_parameter(self):
        response = get_video_id("https://www.youtube.com/watch")
        self.assertIsNone(response)

    def test_empty_string(self):
        response = get_video_id("")
        self.assertIsNone(response)
