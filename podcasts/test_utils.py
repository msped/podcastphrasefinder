from unittest.mock import patch
from django.test import TestCase
from requests.exceptions import RequestException

from .utils import (
    call_api,
    get_transcript,
    check_for_private_video,
    get_avatar
)

class TestUtils(TestCase):

    def setUp(self):
        self.channel_id = 'test_channe_id'

    @patch('podcasts.utils.requests.get')
    def test_call_api_success(self, mock_get):
        # Mock the response object and its json() method
        mock_response = mock_get.return_value
        mock_response.json.return_value = {'success': True}

        result = call_api('https://example.com/api')

        self.assertEqual(result, {'success': True})
        mock_get.assert_called_once_with('https://example.com/api', timeout=10)

    @patch('podcasts.utils.requests.get')
    def test_call_api_error(self, mock_get):
        # Mock raising an exception when making the request
        mock_get.side_effect = RequestException('Something went wrong')

        result = call_api('https://example.com/api')

        self.assertIsNone(result)
        mock_get.assert_called_once_with('https://example.com/api', timeout=10)

    @patch('youtube_transcript_api.YouTubeTranscriptApi.get_transcript')
    def test_get_transcript_failure(self, mock_get_transcript):
        expected_error_message = 'Could not retrieve a transcript for ' \
            'the video https://www.youtube.com/watch?v=aVsz7OP-AcQ'
        mock_get_transcript.side_effect = Exception(expected_error_message)
        transcript, error = get_transcript('aVsz7OP-AcQ')
        self.assertIn(
            expected_error_message,
            transcript
        )
        self.assertTrue(error)

    @patch('podcasts.utils.call_api')
    def test_check_for_private_video_true(self, mock_call_api):
        mock_call_api.return_value = {}
        mock_call_api.status_code = 404
        response = check_for_private_video('Xw1EKgEl_RY')
        self.assertTrue(response)

    @patch('podcasts.utils.call_api')
    def test_check_for_private_video_false(self, mock_call_api):
        mock_call_api.return_value = {}
        mock_call_api.status_code = 200
        response = check_for_private_video('7moEbc-xYF8')
        self.assertFalse(response)

    @patch('podcasts.utils.call_api')
    def test_get_avatar(self, mock_call_api):
        mock_response = {
            'items': [
                {
                    'snippet': {
                        'thumbnails': {
                            'high': {
                                'url': 'https://example.com/avatar.jpg'
                            }
                        }
                    }
                }
            ]
        }
        mock_call_api.return_value = mock_response

        avatar_url = get_avatar(self.channel_id)

        self.assertEqual(avatar_url, 'https://example.com/avatar.jpg')
