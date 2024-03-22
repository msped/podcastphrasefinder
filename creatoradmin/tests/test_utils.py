from rest_framework.test import APITestCase

from ..utils import get_video_id, convert_date_from_picker


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

    def test_convert_valid_date(self):
        self.assertEqual(convert_date_from_picker(
            '12/25/2020'), '2020-12-25T00:00:01Z')

    def test_convert_invalid_date_format(self):
        with self.assertRaises(ValueError):
            convert_date_from_picker('25/12/2020')

    def test_convert_empty_string(self):
        with self.assertRaises(ValueError):
            convert_date_from_picker('')
