from datetime import datetime
import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from unittest import mock
from zoneinfo import ZoneInfo
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from ..models import Podcast, Episode, Transcript, EpisodeReleaseDay, PodcastRSSFeed
from ..serializers import PodcastSerializer, EpisodeSerializer, TranscriptSerializer, EpisodeReleaseDaySerializer, PodcastRSSFeedSerializer
from creatoradmin.utils import convert_date_from_picker

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class EpisodeSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]
        self.user = User.objects.create_user(
            username='admin', password='admin')
        Podcast.objects.create(
            name='Have a Word Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.podcast = Podcast.objects.get(name='Have a Word Podcast')
        self.episode = Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=self.podcast.id,
            published_date='2023-08-25T20:55:33Z'
        )
        self.serializer = EpisodeSerializer(instance=self.episode)

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def test_title_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['title'], self.episode.title)

    def test_published_date(self):
        data = self.serializer.data
        self.assertEqual('2023-08-25T20:55:33Z', data['published_date'])

    def test_is_draft(self):
        data = self.serializer.data
        self.assertFalse(data['is_draft'])

    def test_serialized_channel_data_no_request(self):
        data = self.serializer.data
        channel_data = data['channel']
        self.assertEqual(channel_data['id'], self.episode.channel.id)
        self.assertEqual(channel_data['name'], self.episode.channel.name)
        self.assertEqual(channel_data['slug'], self.episode.channel.slug)
        self.assertEqual(channel_data['avatar'],
                         self.episode.channel.avatar.url)

    def test_create_episode_serializer(self):
        data = {
            'channel_id': Podcast.objects.values_list('id', flat=True).first(),
            'title': 'Test Title',
            'exclusive': True,
            'video_id': 'test1234',
            'published_date': convert_date_from_picker('02/25/2024'),
            'is_draft': False
        }

        serializer = EpisodeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        episode = serializer.save()

        self.assertEqual(episode.title, 'Test Title')
        self.assertTrue(episode.exclusive)
        self.assertEqual(episode.video_id, 'test1234')
        self.assertEqual(episode.published_date, datetime(
            2024, 2, 25, 0, 0, 1, tzinfo=ZoneInfo(key='UTC'))),
        self.assertFalse(episode.is_draft)

    @mock.patch('creatoradmin.utils.get_video_id')
    def test_update_episode_serializer(self, mock_get_video_id):
        episode = Episode.objects.create(
            channel=self.podcast,
            title='Test Title 2',
            video_id='test12345',
            published_date=datetime(
                2024, 2, 24, 0, 0, 1, tzinfo=ZoneInfo(key='UTC'))
        )
        data = {
            'title': 'Test Title Change',
            'video_id': 'https://www.youtube.com/watch?v=test12346'
        }
        serializer = EpisodeSerializer(episode, data=data, partial=True)

        self.assertTrue(serializer.is_valid())
        updated_episode = serializer.save()
        mock_get_video_id.return_value = 'test12346'

        self.assertEqual(updated_episode.title, 'Test Title Change')
        self.assertEqual(updated_episode.video_id, 'test12346')


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class PodcastSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]
        self.user = User.objects.create_user(
            username='admin', password='admin')
        self.podcast = Podcast.objects.create(
            name='Have a Word Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.serializer = PodcastSerializer(instance=self.podcast)

    def tearDown(self):
        self.mocked_get_transcript.stop()
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['id'], self.podcast.id)

    def test_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['name'], self.podcast.name)

    def test_slug_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['slug'], self.podcast.slug)

    def test_avatar_url(self):
        data = self.serializer.data
        self.assertEqual(data['avatar'], self.podcast.avatar.url)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TranscriptSerializerTestCase(APITestCase):
    def setUp(self):
        mocked_transcript = 'mockedtranscriptlengthnew' * 121
        self.user = User.objects.create_user(
            username='admin', password='admin')
        Podcast.objects.create(
            name='Have a Word Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.podcast = Podcast.objects.get(name='Have a Word Podcast')
        Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=self.podcast.id,
            published_date='2023-08-25T20:55:33Z',
        )
        self.episode = Episode.objects.get(video_id='of-Oa7Ps8Rs')
        self.transcript = Transcript.objects.create(
            episode=self.episode,
            transcript=mocked_transcript,
            error_occurred=False
        )
        self.serializer = TranscriptSerializer(instance=self.transcript)

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_transcript(self):
        data = self.serializer.data
        self.assertEqual(data['transcript'], self.transcript.transcript)

    def test_episode(self):
        data = self.serializer.data
        self.assertEqual(data['episode']['id'], self.episode.id)

    def test_error_occurred(self):
        data = self.serializer.data
        self.assertEqual(data['error_occurred'],
                         self.transcript.error_occurred)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class EpisodeReleaseDaySerializerTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin', password='admin')
        Podcast.objects.create(
            name='Have a Word Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.podcast = Podcast.objects.get(name='Have a Word Podcast')
        self.episode_release_day = EpisodeReleaseDay.objects.create(
            podcast=self.podcast,
            day=2
        )

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_episode_release_day_serializer(self):
        serializer = EpisodeReleaseDaySerializer(
            instance=self.episode_release_day)
        data = serializer.data
        self.assertEqual(data['id'], self.episode_release_day.id)
        self.assertEqual(data['podcast']['id'],
                         self.episode_release_day.podcast.id)
        self.assertEqual(data['day'], self.episode_release_day.day)

    def test_episode_release_day_serializer_create(self):
        data = {
            'podcast_id': self.podcast.id,
            'day': 3
        }
        serializer = EpisodeReleaseDaySerializer(data=data)
        self.assertTrue(serializer.is_valid())
        episode_release_day = serializer.save()
        self.assertEqual(episode_release_day.day, 3)
        self.assertEqual(episode_release_day.podcast, self.podcast)

        # Clean up the created instance
        EpisodeReleaseDay.objects.filter(
            id=episode_release_day.id).delete()

    def test_episode_release_day_serializer_update(self):
        data = {
            'day': 4
        }
        serializer = EpisodeReleaseDaySerializer(
            instance=self.episode_release_day, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_episode_release_day = serializer.save()
        self.assertEqual(updated_episode_release_day.day, 4)
        self.assertEqual(updated_episode_release_day.podcast, self.podcast)

    def test_episode_release_day_serializer_delete(self):
        self.episode_release_day.delete()
        with self.assertRaises(EpisodeReleaseDay.DoesNotExist):
            EpisodeReleaseDay.objects.get(id=self.episode_release_day.id)


class PodcastRSSFeedSerializerTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin', password='admin')
        Podcast.objects.create(
            name='Have a Word Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        self.podcast = Podcast.objects.get(name='Have a Word Podcast')
        self.rss_feed_url = 'https://example.com/rss'
        self.podcast_rss_feed = PodcastRSSFeed.objects.create(
            podcast=self.podcast,
            rss_feed_url=self.rss_feed_url
        )
        self.serializer = PodcastRSSFeedSerializer(
            instance=self.podcast_rss_feed)

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_podcast_rss_feed_serializer(self):
        data = self.serializer.data
        self.assertEqual(data['id'], self.podcast_rss_feed.id)
        self.assertEqual(data['podcast']['id'], self.podcast.id)
        self.assertEqual(data['rss_feed_url'], self.rss_feed_url)
        self.assertIn('last_updated', data)
        self.assertIsNotNone(data['last_updated'])

    def test_podcast_rss_feed_serializer_create(self):
        data = {
            'podcast_id': self.podcast.id,
            'rss_feed_url': 'https://newexample.com/rss'
        }
        serializer = PodcastRSSFeedSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        podcast_rss_feed = serializer.save()
        self.assertEqual(podcast_rss_feed.rss_feed_url,
                         'https://newexample.com/rss')
        self.assertEqual(podcast_rss_feed.podcast, self.podcast)

        # Clean up the created instance
        PodcastRSSFeed.objects.filter(id=podcast_rss_feed.id).delete()

    def test_podcast_rss_feed_serializer_update(self):
        data = {
            'rss_feed_url': 'https://updatedexample.com/rss'
        }
        serializer = PodcastRSSFeedSerializer(
            instance=self.podcast_rss_feed, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_podcast_rss_feed = serializer.save()
        self.assertEqual(updated_podcast_rss_feed.rss_feed_url,
                         'https://updatedexample.com/rss')
        self.assertEqual(updated_podcast_rss_feed.podcast, self.podcast)

    def test_podcast_rss_feed_serializer_delete(self):
        self.podcast_rss_feed.delete()
        with self.assertRaises(PodcastRSSFeed.DoesNotExist):
            PodcastRSSFeed.objects.get(id=self.podcast_rss_feed.id)
