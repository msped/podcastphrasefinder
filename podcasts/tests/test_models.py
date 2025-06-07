from datetime import datetime
import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from unittest import mock
from zoneinfo import ZoneInfo
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from ..models import Podcast, Episode, EpisodeReleaseDay, Transcript, PodcastRSSFeed

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TestModels(APITestCase):
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
            name='Tom Scott',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )
        Episode.objects.create(
            id=1,
            video_id='ce-QHeZnVu4',
            channel_id=self.podcast.id,
            title='The giant archive hidden under the British countryside',
            published_date='2023-08-25T20:55:33Z'
        )
        Episode.objects.create(
            id=2,
            video_id='testesttest',
            channel_id=self.podcast.id,
            title='A random podcast',
            published_date='2022-12-03T20:55:33Z'
        )
        Transcript.objects.get(episode_id=2).delete()
        Episode.objects.create(
            id=3,
            video_id='testest1234',
            channel_id=self.podcast.id,
            title='Another random podcast',
            published_date='2022-12-03T20:55:33Z'
        )
        transcript = Transcript.objects.get(episode_id=3)
        transcript.error_occurred = True
        transcript.save()
        EpisodeReleaseDay.objects.create(
            podcast=self.podcast,
            day=2
        )
        PodcastRSSFeed.objects.create(
            podcast=self.podcast,
            rss_feed_url='https://example.com/rss',
            last_updated=datetime.now(tz=ZoneInfo(key='UTC'))
        )

    def tearDown(self):
        self.mocked_get_transcript.stop()
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def podcast_str(self):
        podcast = Podcast.objects.get(name='Tom Scott')
        self.assertEqual(str(podcast), 'Tom Scott')

    def podcast_slug(self):
        podcast = Podcast.objects.get(name='Tom Scott')
        self.assertEqual(podcast.slug, 'tom-scott')

    def episode_str(self):
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        self.assertEqual(
            str(episode),
            'Tom Scott - The giant archive hidden under the British countryside'
        )

    def transcript_str(self):
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        transcript = Transcript.objects.get(episode=episode)
        self.assertEqual(
            str(transcript),
            'The giant archive hidden under the British countryside - Transcript'
        )

    def episode_str_exclusive(self):
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        episode.exclusive = True
        episode.save()
        self.assertEqual(
            str(episode),
            'Exclusive: Tom Scott - The giant archive hidden under the British countryside'
        )

    def episode_release_day(self):
        edr_obj = EpisodeReleaseDay.objects.get(
            podcast__name="Tom Scott", day=2)
        self.assertEqual(
            str(edr_obj),
            'An Episode of Tom Scott is released on a Monday'
        )

    def return_transcripts(self):
        episode = Episode.objects.get(id=1)
        self.assertIsNotNone(
            episode.transcripts()
        )

    def return_transcripts_false(self):
        episode = Episode.objects.get(id=2)
        self.assertIsNone(episode.transcripts())

    def transcript_has_error_occurred_true(self):
        episode = Episode.objects.get(id=3)
        self.assertTrue(episode.has_error_occurred())

    def transcript_has_error_occurred_false(self):
        episode = Episode.objects.get(id=1)
        self.assertFalse(episode.has_error_occurred())

    def podcast_rss_feed_str(self):
        feed_obj = PodcastRSSFeed.objects.get(podcast__name='Tom Scott')
        self.assertEqual(
            str(feed_obj),
            'RSS Feed for Tom Scott'
        )

    def test_in_order(self):
        self.podcast_str()
        self.podcast_slug()
        self.episode_str()
        self.transcript_str()
        self.episode_str_exclusive()
        self.episode_release_day()
        self.return_transcripts()
        self.return_transcripts_false()
        self.transcript_has_error_occurred_false()
        self.transcript_has_error_occurred_false()
        self.podcast_rss_feed_str()
