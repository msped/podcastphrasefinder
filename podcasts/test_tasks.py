from unittest import mock
from django.test import TestCase
from .tasks import add_back_catalogue_task, check_for_private_videos, check_avatar
from .models import Episode, Podcast

class BackCatalogueTaskTest(TestCase):

    def setUp(self):
        self.mocked_get_transcript = mock.patch(
            'youtube_transcript_api.YouTubeTranscriptApi.get_transcript'
        )
        self.mock_get_transcript = self.mocked_get_transcript.start()
        self.mock_get_transcript.return_value = [{'text': 'mocked transcript'}]

    def tearDown(self):
        self.mocked_get_transcript.stop()

    def test_add_back_catalogue_task(self):
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
        self.mock_get_transcript.return_value = [{'text': 'mocked transcript'}]
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

    def test_check_for_private_videos(self):
        """Should change two fields, one to true and another to false"""

        self.assertFalse(Episode.objects.get(video_id='ce-QHeZnVu4').private_video)
        self.assertTrue(Episode.objects.get(video_id='1yfX84RMQ3M').private_video)
        self.assertFalse(Episode.objects.get(video_id='Xw1EKgEl_RY').private_video)

        check_for_private_videos()

        self.assertFalse(Episode.objects.get(video_id='ce-QHeZnVu4').private_video)
        self.assertFalse(Episode.objects.get(video_id='1yfX84RMQ3M').private_video)
        self.assertTrue(Episode.objects.get(video_id='Xw1EKgEl_RY').private_video)

    def test_check_avatar_url_changed(self):
        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https//www.example.com"
        )

        check_avatar()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/AOPolaR9zi_hlH8MQ80WIyB3qcDsqGvcJY2f" +
            "-HoPcS_gtg=s800-c-k-c0x00ffffff-no-rj"
        )

    def test_check_avatar_not_changed(self):
        podcast = Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A")
        podcast.avatar = "https://yt3.ggpht.com/ytc/AOPolaR9zi_hlH8MQ80WIyB3qc" + \
        "DsqGvcJY2f-HoPcS_gtg=s800-c-k-c0x00ffffff-no-rj"
        podcast.save()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/AOPolaR9zi_hlH8MQ80WIyB3qcDsqGvcJY2f" +
            "-HoPcS_gtg=s800-c-k-c0x00ffffff-no-rj"
        )

        check_avatar()

        self.assertEqual(
            Podcast.objects.get(channel_id="UCBa659QWEk1AI4Tg--mrJ2A").avatar,
            "https://yt3.ggpht.com/ytc/AOPolaR9zi_hlH8MQ80WIyB3qcDsqGvcJY2f" +
            "-HoPcS_gtg=s800-c-k-c0x00ffffff-no-rj"
        )
