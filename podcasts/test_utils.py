from unittest.mock import patch
from django.test import TestCase
from requests.exceptions import RequestException

from .utils import call_api

class TestUtils(TestCase):
    @patch('podcasts.utils.requests.get')
    def test_call_api_success(self, mock_get):
        # Mock the response object and its json() method
        mock_response = mock_get.return_value
        mock_response.json.return_value = {'success': True}

        result = call_api('https://example.com/api')

        self.assertEqual(result, {'success': True})
        mock_get.assert_called_once_with('https://example.com/api', timeout=5)

    @patch('podcasts.utils.requests.get')
    def test_call_api_error(self, mock_get):
        # Mock raising an exception when making the request
        mock_get.side_effect = RequestException('Something went wrong')

        result = call_api('https://example.com/api')

        self.assertIsNone(result)
        mock_get.assert_called_once_with('https://example.com/api', timeout=5)
