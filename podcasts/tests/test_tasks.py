from unittest import mock
from datetime import datetime as date
from django.test import TestCase
from ..tasks import (
    add_back_catalogue_task,
    check_for_private_videos,
    check_avatar,
    get_new_episodes
)
from ..models import Episode, Podcast, EpisodeReleaseDay


class BackCatalogueTaskTest(TestCase):

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

    def test_add_back_catalogue_task(self):
        # no need to mock avatar as runs in signal
        podcast = Podcast.objects.create(
            name='jawed',
            channel_id='UC4QobU6STFB0P71PMvOGN5A',
            avatar='https//www.example.com'
        )
        add_back_catalogue_task.apply(args=(
            podcast.id,
            podcast.channel_id,
            podcast.video_filter)
        ).get()
        self.assertEqual(
            Episode.objects.filter(channel_id=podcast.id).count(),
            1
        )


class TestCheckForPrivateVideos(TestCase):

    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        mocked_transcript_length = 'mockedtranscriptlengthnew' * 121
        self.mock_get_transcript.return_value = [
            {'text': mocked_transcript_length}]
        Podcast.objects.create(
            name='Test Podcast',
            channel_id='UCBa659QWEk1AI4Tg--mrJ2A',
            avatar='https//www.example.com'
        )
        channel = Podcast.objects.get(name='Test Podcast')

        video_data = [
            {
                'video_id': 'ce-QHeZnVu4',
                'channel_id': channel.id,
                'title': 'The giant archive hidden under the British countryside',
                'transcript': 'test transcript 1',
                'published_date': '2023-08-25T20:55:33Z',
                'thumbnail': 'https://img.youtube.com/vi/ce-QHeZnVu4/maxresdefault.jpg',
                'times_clicked': 0,
                'error_occurred': False,
                'private_video': False
            },
            {
                'video_id': '1yfX84RMQ3M',
                'channel_id': channel.id,
                'title': 'This man built his office inside an elevator',
                'transcript': 'test transcript 2',
                'published_date': '2023-12-21T13:45:33Z',
                'thumbnail': 'https://img.youtube.com/vi/1yfX84RMQ3M/maxresdefault.jpg',
                'times_clicked': 0,
                'error_occurred': False,
                'private_video': True
            },
            {
                'video_id': 'Xw1EKgEl_RY',
                'channel_id': channel.id,
                'title': 'Test Podcast Episode',
                'transcript': 'test transcript 3',
                'published_date': '2023-08-25T15:35:33Z',
                'thumbnail': 'https://img.youtube.com/vi/Xw1EKgEl_RY/maxresdefault.jpg',
                'times_clicked': 0,
                'error_occurred': False,
                'private_video': False

            }
        ]

        Episode.objects.bulk_create([Episode(**data) for data in video_data])

    def tearDown(self):
        self.mocked_get_transcript.stop()

    @mock.patch('podcasts.utils.check_for_private_video')
    def test_check_for_private_videos(self, mock_get):
        """Should change two fields, one to true and another to false"""
        mock_get.status_code.side_effect = [False, False, True]

        self.assertFalse(Episode.objects.get(
            video_id='ce-QHeZnVu4').private_video)
        self.assertTrue(Episode.objects.get(
            video_id='1yfX84RMQ3M').private_video)
        self.assertFalse(Episode.objects.get(
            video_id='Xw1EKgEl_RY').private_video)

        check_for_private_videos()

        self.assertFalse(Episode.objects.get(
            video_id='ce-QHeZnVu4').private_video)
        self.assertFalse(Episode.objects.get(
            video_id='1yfX84RMQ3M').private_video)
        self.assertTrue(Episode.objects.get(
            video_id='Xw1EKgEl_RY').private_video)


class TestCheckAvatar(TestCase):

    def setUp(self):
        Podcast.objects.create(
            name='Test Podcast',
            channel_id='UCBa659QWEk1AI4Tg--mrJ2A',
            avatar='https//www.example.com'
        )

    def test_check_avatar_url_changed(self):
        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https//www.example.com"
        )

        check_avatar()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/APkrFKbAM4yMQo1QLC5VYC1aoIf_"
            "49jnh4jEAMSXc9vM5g=s800-c-k-c0x00ffffff-no-rj"
        )

    def test_check_avatar_not_changed(self):
        podcast = Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A")
        podcast.avatar = "https://yt3.ggpht.com/ytc/APkrFKbAM4yMQo1QLC5VYC1aoIf_" \
            "49jnh4jEAMSXc9vM5g=s800-c-k-c0x00ffffff-no-rj"
        podcast.save()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/APkrFKbAM4yMQo1QLC5VYC1aoIf_"
            "49jnh4jEAMSXc9vM5g=s800-c-k-c0x00ffffff-no-rj"
        )

        check_avatar()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/APkrFKbAM4yMQo1QLC5VYC1aoIf_"
            "49jnh4jEAMSXc9vM5g=s800-c-k-c0x00ffffff-no-rj"
        )


class TestGetNewEpisodes(TestCase):

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
        channel = Podcast.objects.get(name='Have a Word Podcast')
        Episode.objects.create(
            video_id='Qiob0pDFIHo',
            channel=channel,
            title='Gabby Bryan | Have A Word Podcast #241',
            published_date='2023-09-10T23:00:20Z'
        ).save()

    def tearDown(self):
        self.mocked_get_transcript.stop()

    @mock.patch('requests.get')
    def test_get_new_episode(self, mock_get):
        podcast = Podcast.objects.get(name='Have a Word Podcast')
        EpisodeReleaseDay.objects.create(
            podcast=podcast,
            day=(date.today().isoweekday() % 7) + 1
        )
        response_content = {
            "kind": "youtube#searchListResponse",
            "etag": "2c9EzSDyoCD8wCzdFmBUN4CmqKw",
            "nextPageToken": "CAIQAA",
            "regionCode": "GB",
            "pageInfo": {
                "totalResults": 178,
                "resultsPerPage": 2
            },
            "items": [
                {
                    "kind": "youtube#searchResult",
                    "etag": "fsi6b7s77VcWq3B1OxCWZK1XRUo",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "mEstFknQR2c"
                    },
                    "snippet": {
                        "publishedAt": "2023-09-17T23:00:47Z",
                        "channelId": "UChl6sFeO_O0drTc1CG1ymFw",
                        "title": "Shuffle T | Have A Word Podcast #242",
                        "description": "Tickets for Have A Word Live shows as well as Adam and Dan's tours and previews: Have A Word Live ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/mEstFknQR2c/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/mEstFknQR2c/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/mEstFknQR2c/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "Have A Word Pod",
                        "liveBroadcastContent": "none",
                        "publishTime": "2023-09-17T23:00:47Z"
                    }
                },
                {
                    "kind": "youtube#searchResult",
                    "etag": "2czQdHKO9EXB6VUPM-nB5P8Hod0",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "Qiob0pDFIHo"
                    },
                    "snippet": {
                        "publishedAt": "2023-09-10T23:00:20Z",
                        "channelId": "UChl6sFeO_O0drTc1CG1ymFw",
                        "title": "Gabby Bryan | Have A Word Podcast #241",
                        "description": "Tickets for Have A Word Live shows as well as Adam and Dan's tours and previews: Have A Word Live ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/Qiob0pDFIHo/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/Qiob0pDFIHo/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/Qiob0pDFIHo/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "Have A Word Pod",
                        "liveBroadcastContent": "none",
                        "publishTime": "2023-09-10T23:00:20Z"
                    }
                }
            ]
        }
        response_mock = mock.Mock()
        response_mock.status_code = 200
        response_mock.json.return_value = response_content
        mock_get.return_value = response_mock
        self.assertEqual(Episode.objects.all().count(), 1)
        get_new_episodes()
        self.assertEqual(Episode.objects.all().count(), 2)
