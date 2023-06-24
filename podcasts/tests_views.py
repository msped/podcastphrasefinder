import json
from rest_framework.test import APITestCase

from .models import Podcast, Episode

class TestodcastViews(APITestCase):

    def setUp(self):
        Podcast.objects.create(
            name='Have a Word Podcast',
            channel_link='https://www.youtube.com/@HaveAWordPod',
        )
        Podcast.objects.create(
            name='The Mild High Club',
            channel_link='https://www.youtube.com/@TheMildHighClub'
        )
        podcast = Podcast.objects.get(name='Have a Word Podcast')
        Episode.objects.create(
            video_id='of-Oa7Ps8Rs',
            title='Michelle de Swarte | Have A Word Podcast #223',
            channel_id=podcast.id,
            times_clicked=100,
        )
        Episode.objects.create(
            video_id='gD1mHPbaE_E',
            title='Mike Rice | Have A Word Podcast #224',
            channel_id=podcast.id,
            times_clicked=0,
        )
        Episode.objects.create(
            video_id='0OQKI5r6K2Q',
            title='Elliot Steel | Have A Word Podcast #222',
            channel_id=podcast.id,
            times_clicked=23,
        )

    def test_increment_podcast_click_by_one(self):
        episode = Episode.objects.get(video_id='of-Oa7Ps8Rs')
        response = self.client.post(
            f'/api/podcasts/episode/increment/{episode.id}',
        )
        self.assertEqual(response.status_code, 200)

    def test_search_episode_returns_200(self):
        response = self.client.get(
            '/api/podcasts/episode/search',
            {
                "q": "what's the difference between Neil Armstrong and Michael Jackson"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_search_podcast_returns_200(self):
        response = self.client.get(
            '/api/podcasts/search',
            {
                "q": "Have a Word"
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
