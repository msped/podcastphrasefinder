from unittest.mock import patch
from django.test import TestCase
from requests.exceptions import RequestException

from ..models import Podcast, Transcript
from ..utils import (
    call_api,
    get_transcript,
    check_for_private_video,
    get_avatar,
    create_transcript_models
)


class TestUtils(TestCase):

    def setUp(self):
        self.channel_id = 'test_channe_id'
        Podcast.objects.create(
            id=1,
            name='test',
            channel_id='test0987654321',
            avatar='https//www.example.com'
        )
        Podcast.objects.create(
            id=2,
            name='test podcast',
            channel_id='test3490439783',
            avatar='https//www.example.com'
        )

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

    @patch('youtube_transcript_api.YouTubeTranscriptApi.get_transcript')
    def test_create_transcript_models(self, mock_get_transcript):
        transcript = 'test' * 80
        mock_get_transcript.return_value = [transcript, transcript]
        video_data = [
            {
                'video_id': 'Test5678',
                'channel_id': 1,
                'title': 'Test title 2',
                'published_date': '2023-12-29T23:00:20Z'
            },
            {
                'video_id': 'Test91011',
                'channel_id': 1,
                'title': 'Test title 3',
                'published_date': '2024-03-10T23:00:20Z'
            }
        ]
        response = create_transcript_models(video_data)
        self.assertEqual(len(response), 2)
        self.assertEqual(
            Transcript.objects.all().count(),
            2
        )

    @patch('youtube_transcript_api.YouTubeTranscriptApi.get_transcript')
    def test_create_transcript_models_less_then_3000(self, mock_get_transcript):
        mock_get_transcript.return_value = 'test test test'
        video_data = [{
            'video_id': 'Test1234',
            'channel_id': 2,
            'title': 'Test title',
            'published_date': '2023-09-10T23:00:20Z'
        }]
        response = create_transcript_models(video_data)
        # print(response)
        self.assertEqual(response[0].video_id, 'Test1234')
        self.assertEqual(response[0].channel.id, 2)
        self.assertEqual(response[0].title, 'Test title')
        self.assertEqual(response[0].published_date, '2023-09-10T23:00:20Z')
        self.assertTrue(response[0].private_video)
        self.assertFalse(response[0].exclusive)
        self.assertFalse(response[0].is_draft)

    def test_create_transcript_models_no_episodes(self):
        response = create_transcript_models([])
        self.assertEqual(response, 'No episodes found.')
