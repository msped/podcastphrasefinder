from rest_framework.test import APITestCase
from youtube_transcript_api import YouTubeTranscriptApi

from .models import Podcast, Episode
from .serializers import PodcastSerializer, EpisodeSerializer

class TestModels(APITestCase):

    def podcast_str(self):
        Podcast.objects.create(
            name='Tom Scott',
            channel_id='UCBa659QWEk1AI4Tg--mrJ2A'
        ).save()
        podcast = Podcast.objects.get(name='Tom Scott')
        self.assertEqual(str(podcast), 'Tom Scott')

    def episode_str(self):
        channel = Podcast.objects.get(name='Tom Scott')
        transcript_list = YouTubeTranscriptApi.get_transcript('ce-QHeZnVu4')
        Episode.objects.create(
            video_id='ce-QHeZnVu4',
            channel=channel,
            title='The giant archive hidden under the British countryside',
            transcript=" ".join(
                [transcript['text'] for transcript in transcript_list])
        ).save()
        episode = Episode.objects.get(video_id='ce-QHeZnVu4')
        self.assertEqual(
            str(episode),
            'Tom Scott - The giant archive hidden under the British countryside'
        )

    def test_in_order(self):
        self.podcast_str()
        self.episode_str()

class EpisodeSerializerTestCase(APITestCase):
    def setUp(self):
        Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
        )
        podcast = Podcast.objects.get(name='Have a Word Podcast')
        self.episode = Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=podcast.id,
            times_clicked=100,
        )
        self.serializer = EpisodeSerializer(instance=self.episode)

    def test_video_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['video_id'], self.episode.video_id)

    def test_title_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['title'], self.episode.title)

    def test_transcript_field_content(self):
        self.assertIsNotNone(self.episode.transcript)

    def test_times_clicked_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['times_clicked'], self.episode.times_clicked)

    def test_serialized_channel_data(self):
        data = self.serializer.data
        channel_data = data['channel']
        self.assertEqual(channel_data['id'], self.episode.channel.id)
        self.assertEqual(channel_data['name'], self.episode.channel.name)

class PodcastSerializerTestCase(APITestCase):
    def setUp(self):
        self.podcast = Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
        )
        self.serializer = PodcastSerializer(instance=self.podcast)

    def test_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['id'], self.podcast.id)

    def test_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['name'], self.podcast.name)

    def test_channel_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['channel_id'], self.podcast.channel_id)
