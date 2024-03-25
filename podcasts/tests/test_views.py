import json
from unittest import mock
from rest_framework.test import APITestCase

from ..models import Podcast, Episode


class TestPodcastViews(APITestCase):

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
        Podcast.objects.create(
            name='The Mild High Club',
            channel_id='UCIpglRjjRPp2_qfsak-jSSw',
            avatar='https//www.example.com'
        )
        have_a_word_podcast = Podcast.objects.get(name='Have a Word Podcast')
        mild_high_club = Podcast.objects.get(name='The Mild High Club')
        video_data = [
            {
                'video_id': 'of-Oa7Ps8Rs',
                'title': 'Michelle de Swarte | Have A Word Podcast #223',
                'channel_id': have_a_word_podcast.id,
                'transcript': 'This isnt it mate',
                'published_date': '2023-08-25T20:55:33Z'
            },
            {
                'video_id': 'gD1mHPbaE_E',
                'title': 'Mike Rice | Have A Word Podcast #224',
                'channel_id': have_a_word_podcast.id,
                'transcript': 'is here!',
                'published_date': '2023-08-25T20:55:33Z'
            },
            {
                'video_id': '0OQKI5r6K2Q',
                'title': 'Elliot Steel | Have A Word Podcast #222',
                'channel_id': have_a_word_podcast.id,
                'transcript': 'Here we go, part 4 of 4',
                'published_date': '2023-08-25T20:55:33Z'
            },
            {
                'video_id': 'OAQNj1jkmt4',
                'title': 'The Mild High Club x Seann Walsh - 124',
                'channel_id': mild_high_club.id,
                'transcript': 'A very big welcome to Seann Walsh! How you doing mate?',
                'published_date': '2023-08-25T20:55:33Z'
            },
            {
                'video_id': 'lTXFSn5gkBA',
                'title': 'The Mild High Club x Rob Mulholland - 123',
                'channel_id': mild_high_club.id,
                'transcript': 'is there any reason for it? Freddie doesnt like music, its weird',
                'published_date': '2023-08-25T20:55:33Z'
            }
        ]
        Episode.objects.bulk_create([Episode(**data) for data in video_data])

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def test_search_episode_phrase_returns_200(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "part 4"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episodes_guests_returns_200(self):
        # I know this test is redundant, but I have yet to come up
        # with a suitable way of testing this with elasticsearch.
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "Mike Rice"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episode_returns_200_without_query(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": ""
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episode_with_slug_returns_200(self):
        # I know this test is redundant, but I have yet to come up
        # with a suitable way of testing this with elasticsearch.
        mild_high_club = Podcast.objects.get(
            channel_id='UCIpglRjjRPp2_qfsak-jSSw')
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "freddie doesnt like music",
                "s": mild_high_club.slug
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_podcast_returns_200_with_query(self):
        response = self.client.get(
            '/api/podcasts/search',
            {
                "q": "Have a Word"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_podcast_returns_200_without_query(self):
        response = self.client.get(
            '/api/podcasts/search',
            {
                "q": ""
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_get_podcast_information_200(self):
        channel = Podcast.objects.get(channel_id='UChl6sFeO_O0drTc1CG1ymFw')
        response = self.client.get(
            f'/api/podcasts/{channel.slug}'
        )
        res_data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['name'], 'Have a Word Podcast')
        self.assertEqual(res_data['slug'], 'have-a-word-podcast')

    def test_get_podcast_information_404(self):
        response = self.client.get(
            '/api/podcasts/testingthisview'
        )
        self.assertEqual(response.status_code, 404)
