from unittest import mock
from rest_framework.test import APITestCase
from .models import Podcast, Episode, EpisodeReleaseDay
from .serializers import PodcastSerializer, EpisodeSerializer

class TestModels(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        self.mock_get_transcript.return_value = [{'text': 'mocked transcript'}]

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

    def episode_release_day(self):
        podcast = Podcast.objects.get(name="Tom Scott")
        EpisodeReleaseDay.objects.create(
            podcast=podcast,
            day=2
        )
        edr_obj = EpisodeReleaseDay.objects.get(podcast__name="Tom Scott", day=2)
        self.assertEqual(
            str(edr_obj),
            'An Episode of Tom Scott is released on a Monday'
        )

    def test_in_order(self):
        self.podcast_str()
        self.episode_str()
        self.episode_str_with_error()
        self.episode_release_day()

class EpisodeSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        self.mock_get_transcript.return_value = [{'text': 'mocked transcript'}]
        Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
            avatar='https//www.example.com'
        )
        podcast = Podcast.objects.get(name='Have a Word Podcast')
        self.episode = Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=podcast.id,
            times_clicked=100,
            published_date='2023-08-25T20:55:33Z'
        )
        self.serializer = EpisodeSerializer(instance=self.episode)

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def test_video_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['video_id'], self.episode.video_id)

    def test_title_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['title'], self.episode.title)

    def test_transcript_field_content(self):
        self.assertIsNotNone(self.episode.transcript)

    def test_thumbnail_url(self):
        data = self.serializer.data
        self.assertEqual(
            data['thumbnail'],
            f'https://img.youtube.com/vi/{self.episode.video_id}/maxresdefault.jpg'
        )

    def test_published_date(self):
        data = self.serializer.data
        self.assertEqual('2023-08-25T20:55:33Z', data['published_date'])

    def test_times_clicked_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['times_clicked'], self.episode.times_clicked)

    def test_serialized_channel_data(self):
        data = self.serializer.data
        channel_data = data['channel']
        self.assertEqual(channel_data['id'], self.episode.channel.id)
        self.assertEqual(channel_data['name'], self.episode.channel.name)
        self.assertEqual(channel_data['avatar'], self.episode.channel.avatar)
        self.assertEqual(channel_data['channel_id'], self.episode.channel.channel_id)

class PodcastSerializerTestCase(APITestCase):
    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        self.mock_get_transcript.return_value = [{'text': 'mocked transcript'}]
        self.podcast = Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
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
