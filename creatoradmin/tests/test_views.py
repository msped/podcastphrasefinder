from unittest.mock import MagicMock, patch
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient


class TestEpisodeRelatedViews(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/creator/youtube/add/check'
        self.user = User.objects.create_user(
            username='admin', password='admin')
        self.client.force_authenticate(user=self.user)
        self.mocked_get_transcript = patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        self.mock_get_transcript.return_value = [
            {'text': 'transcript'}]

    def tearDown(self):
        self.mocked_get_transcript.stop()

    @patch('creatoradmin.utils.get_video_id')
    @patch('podcasts.models.Episode.objects')
    def test_post_with_existing_video_id(self, mock_get_video_id, mock_episode_objects):
        mock_get_video_id.return_value = 'videoID'
        mock_episode_objects.filter.return_value.exists.return_value = True
        response = self.client.post(
            self.url, {'url': 'https://www.youtube.com/watch?v=videoID'})
        self.assertEqual(response.status_code, 226)

    @patch('creatoradmin.utils.get_video_id')
    def test_post_with_new_video_id(
        self, mock_get_video_id
    ):
        mock_get_video_id.return_value = "superdifferentvideoid"

        response = self.client.post(
            self.url, {'url': 'https://www.youtube.com/watch?v=superdifferentvideoid'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['text'], 'transcript')
        self.assertFalse(response.data['error'])
