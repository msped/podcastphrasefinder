from datetime import datetime
from unittest import mock
from zoneinfo import ZoneInfo
from rest_framework.test import APITestCase
from ..models import Podcast, Episode, EpisodeReleaseDay
from ..serializers import PodcastSerializer, EpisodeSerializer

from creatoradmin.utils import convert_date_from_picker


class TestModels(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def podcast_str(self):
        Podcast.objects.create(
            name='Tom Scott',
            channel_id='UCBa659QWEk1AI4Tg--mrJ2A',
            avatar='https//www.example.com'
        ).save()
        podcast = Podcast.objects.get(name='Tom Scott')
        self.assertEqual(str(podcast), 'Tom Scott')

    def episode_str(self):
        channel = Podcast.objects.get(name='Tom Scott')
        Episode.objects.create(
            video_id='ce-QHeZnVu4',
            channel=channel,
            title='The giant archive hidden under the British countryside',
            published_date='2023-08-25T20:55:33Z'
        ).save()
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        self.assertEqual(
            str(episode),
            'Tom Scott - The giant archive hidden under the British countryside'
        )

    def episode_str_with_error(self):
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        episode.error_occurred = True
        episode.transcript = 'An error message'
        episode.save()
        self.assertEqual(
            str(episode),
            'ERROR Tom Scott - The giant archive hidden under the British countryside'
        )

    def episode_str_exclusive(self):
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        episode.error_occurred = False
        episode.exclusive = True
        episode.save()
        self.assertEqual(
            str(episode),
            'Exclusive: Tom Scott - The giant archive hidden under the British countryside'
        )

    def episode_release_day(self):
        podcast = Podcast.objects.get(name="Tom Scott")
        EpisodeReleaseDay.objects.create(
            podcast=podcast,
            day=2
        )
        edr_obj = EpisodeReleaseDay.objects.get(
            podcast__name="Tom Scott", day=2)
        self.assertEqual(
            str(edr_obj),
            'An Episode of Tom Scott is released on a Monday'
        )

    def test_in_order(self):
        self.podcast_str()
        self.episode_str()
        self.episode_str_with_error()
        self.episode_str_exclusive()
        self.episode_release_day()


class EpisodeSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]
        Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
            avatar='https//www.example.com'
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

    def test_transcript_field_content(self):
        self.assertIsNotNone(self.episode.transcript)

    def test_published_date(self):
        data = self.serializer.data
        self.assertEqual('2023-08-25T20:55:33Z', data['published_date'])

    def test_is_draft(self):
        data = self.serializer.data
        self.assertFalse(data['is_draft'])

    def test_serialized_channel_data(self):
        data = self.serializer.data
        channel_data = data['channel']
        self.assertEqual(channel_data['id'], self.episode.channel.id)
        self.assertEqual(channel_data['name'], self.episode.channel.name)
        self.assertEqual(channel_data['avatar'], self.episode.channel.avatar)
        self.assertEqual(channel_data['channel_id'],
                         self.episode.channel.channel_id)

    def test_create_episode_serializer(self):
        data = {
            'channel_id': Podcast.objects.values_list('id', flat=True).first(),
            'title': 'Test Title',
            'transcript': 'test transcript',
            'exclusive': True,
            'video_id': 'test1234',
            'error_occurred': False,
            'published_date': convert_date_from_picker('02/25/2024'),
            'is_draft': False
        }

        serializer = EpisodeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        episode = serializer.save()

        self.assertEqual(episode.title, 'Test Title')
        self.assertEqual(episode.transcript, 'test transcript')
        self.assertTrue(episode.exclusive)
        self.assertEqual(episode.video_id, 'test1234')
        self.assertFalse(episode.error_occurred)
        self.assertEqual(episode.published_date, datetime(
            2024, 2, 25, 0, 0, 1, tzinfo=ZoneInfo(key='UTC'))),
        self.assertFalse(episode.is_draft)

    @mock.patch('creatoradmin.utils.get_video_id')
    def test_update_episode_serializer(self, mock_get_video_id):
        episode = Episode.objects.create(
            channel=self.podcast,
            title='Test Title 2',
            video_id='test12345',
            transcript='test transcript 2',
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


class PodcastSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]
        self.podcast = Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
            avatar='https://www.exmaple.com/'
        )
        self.serializer = PodcastSerializer(instance=self.podcast)

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def test_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['id'], self.podcast.id)

    def test_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['name'], self.podcast.name)

    def test_channel_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['channel_id'], self.podcast.channel_id)
