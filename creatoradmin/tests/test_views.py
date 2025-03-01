import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from unittest.mock import patch
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from organisations.models import Membership
from podcasts.models import Podcast, Episode

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TestVideoIdCheck(APITestCase):
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
        shutil.rmtree(tempfile.gettempdir(), ignore_errors=True)

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


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TestAddYoutubeEpisodeView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/creator/youtube/add'
        self.user = User.objects.create_user(
            username='admin', password='admin')
        self.client.force_authenticate(user=self.user)
        self.podcast = Podcast.objects.create(
            name='Test Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        Membership.objects.create(
            user=self.user, role='Owner', podcast=self.podcast, is_primary=True
        )

    @patch('creatoradmin.utils.get_video_id')
    @patch('creatoradmin.utils.convert_date_from_picker')
    def test_add_youtube_episode_valid(self, mock_get_video_id, mock_convert_date_from_picker):
        mock_get_video_id.return_value = 'test9876'
        mock_convert_date_from_picker.return_value = '2021-01-01T00:00:01Z'

        payload = {
            'title': 'New Episode',
            'transcript': 'This is a transcript.',
            'exclusive': '',
            'url': 'https://www.youtube.com/watch?v=test9876',
            'error_occurred': '',
            'published_date': '01/01/2021',
            'is_draft': ''
        }

        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Episode.objects.count(), 1)
        episode = Episode.objects.first()
        self.assertEqual(episode.title, payload['title'])

    @patch('creatoradmin.utils.get_video_id')
    @patch('creatoradmin.utils.convert_date_from_picker')
    def test_add_youtube_episode_invalid(self, mock_get_video_id, mock_convert_date_from_picker):
        mock_get_video_id.return_value = 'test4567'
        mock_convert_date_from_picker.return_value = '2021-01-01T00:00:01Z'

        payload = {
            'title': 'New Episode',
            'exclusive': '',
            'url': '',  # no url will provide video_id error
            'error_occurred': '',
            'published_date': '01/01/2021',
            'is_draft': '',
            'transcript': 'This is a transcript.',
        }

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('video_id', response.data['episode'])


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TestCreatorEpisodesView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='password')
        self.client.force_authenticate(user=self.user)

        self.podcast = Podcast.objects.create(
            name='Test Podcast',
            slug='test-podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        Membership.objects.create(
            user=self.user, role='Owner', podcast=self.podcast, is_primary=True
        )
        self.episode1 = Episode.objects.create(
            channel=self.podcast,
            title='Test Episode 1',
            video_id='test1234',
            published_date='2023-09-06T12:00:00Z'
        )
        self.episode2 = Episode.objects.create(
            channel=self.podcast,
            title='Test Episode 2',
            video_id='test5678',
            published_date='2023-09-07T12:00:00Z'
        )

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_get_episodes_for_primary_org(self):
        response = self.client.get(
            f'/api/creator/{self.podcast.slug}/episodes')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], 'Test Episode 1')
        self.assertEqual(response.data[1]['title'], 'Test Episode 2')

    def test_get_episodes_no_primary_org(self):
        Membership.objects.filter(user=self.user).update(is_primary=False)
        response = self.client.get(
            f'/api/creator/{self.podcast.slug}/episodes')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_episodes_unauthenticated(self):
        self.client.logout()
        response = self.client.get(
            f'/api/creator/{self.podcast.slug}/episodes')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TestEpisodeDetailView(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='owner', password='password')
        self.admin = User.objects.create_user(
            username='admin', password='password')
        self.member = User.objects.create_user(
            username='member', password='password')
        self.other = User.objects.create_user(
            username='other', password='password')

        self.podcast = Podcast.objects.create(
            name='Test Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.episode = Episode.objects.create(
            channel=self.podcast,
            title='Test Episode',
            video_id='test1234',
            published_date='2023-09-06T12:00:00Z'
        )

        Membership.objects.create(
            user=self.owner, role='Owner', podcast=self.podcast)
        Membership.objects.create(
            user=self.admin, role='Admin', podcast=self.podcast)
        Membership.objects.create(
            user=self.member, role='Member', podcast=self.podcast)

        self.client.force_authenticate(user=self.owner)
        self.detail_url = f'/api/creator/episodes/{self.episode.pk}'

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_get_episode_detail_as_owner(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['episode']['title'], 'Test Episode')

    def test_update_episode_detail_as_owner(self):
        data = {'episode': {'title': 'Updated Title'}}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['episode']['title'], 'Updated Title')

    def test_delete_episode_detail_as_owner(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Episode.objects.filter(pk=self.episode.pk).exists())

    def test_access_episode_detail_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_episode_detail_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {'episode': {'title': 'Updated Title by Admin'}}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['episode']
                         ['title'], 'Updated Title by Admin')

    def test_delete_episode_detail_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Episode.objects.filter(pk=self.episode.pk).exists())

    def test_access_episode_detail_as_member(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_episode_detail_as_member(self):
        self.client.force_authenticate(user=self.member)
        data = {'title': 'Updated Title by Member'}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_episode_detail_as_member(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_episode_detail_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_episode_detail_unauthenticated(self):
        self.client.logout()
        data = {'title': 'Updated Title'}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_episode_detail_unauthenticated(self):
        self.client.logout()
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_episode_detail_not_found(self):
        response = self.client.get('/api/creator/episodes/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
