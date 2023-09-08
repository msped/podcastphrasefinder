import json
from rest_framework.test import APITestCase

from .models import Podcast, Episode

class TestodcastViews(APITestCase):

    def setUp(self):
        Podcast.objects.create(
            name='Have a Word Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
        )
        Podcast.objects.create(
            name='The Mild High Club',
            channel_id='UCIpglRjjRPp2_qfsak-jSSw'
        )
        podcast = Podcast.objects.get(name='Have a Word Podcast')
        Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=podcast.id,
            times_clicked=100,
            published_date='2023-08-25T20:55:33Z'
        )
        Episode.objects.create(
            video_id='gD1mHPbaE_E',
            title='Mike Rice | Have A Word Podcast #224',
            channel_id=podcast.id,
            times_clicked=0,
            published_date='2023-08-25T20:55:33Z'
        )
        Episode.objects.create(
            video_id='0OQKI5r6K2Q',
            title='Elliot Steel | Have A Word Podcast #222',
            channel_id=podcast.id,
            times_clicked=23,
            published_date='2023-08-25T20:55:33Z'
        )

    def test_increment_podcast_click_by_one(self):
        episode = Episode.objects.get(video_id='of-Oa7Ps8Rs')
        response = self.client.post(
            f'/api/podcasts/episode/increment/{episode.id}',
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episode_phrase_returns_200(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "what's the difference between Neil Armstrong and Michael Jackson"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episodes_guests_returns_200(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "Mike Rice"
            }
        )
        episode = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(episode[0]['title'], 'Mike Rice | Have A Word Podcast #224')
        self.assertEqual(episode[0]['video_id'], 'gD1mHPbaE_E')

    def test_search_episode_returns_200_without_query(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": ""
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

    def test_get_most_popular(self):
        response = self.client.get(
            '/api/podcasts/episode/popular'
        )
        self.assertEqual(response.status_code, 200)
        episode = json.loads(response.content)
        self.assertEqual(episode['video_id'], 'of-Oa7Ps8Rs')
        self.assertEqual(episode['title'], 'Michelle de Swarte | Have A Word Podcast #223')
        self.assertEqual(episode['times_clicked'], 100)