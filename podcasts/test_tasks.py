from django.test import TestCase
from .tasks import add_back_catalogue_task
from .models import Episode, Podcast

class BackCatalogueTaskTest(TestCase):

    def test_add_back_catalogue_task(self):
        podcast = Podcast.objects.create(
            name='jawed',
            channel_id='UC4QobU6STFB0P71PMvOGN5A'
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
