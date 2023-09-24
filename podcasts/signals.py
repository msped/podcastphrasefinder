import os
from urllib.parse import urlencode
from django.db import connection
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Podcast
from .tasks import add_back_catalogue_task
from .utils import call_api

api_key = os.environ.get('YOUTUBE_V3_API_KEY')

@receiver(post_save, sender=Podcast)
def add_back_catalogue_of_channel(sender, instance, **kwargs):
    if connection.settings_dict['NAME'] != 'testdatabase':
        if not instance.avatar:
            url_params = {
                'key': api_key,
                'id': instance.channel_id,
                'part': 'snippet',
            }
            api_url = (
                'https://www.googleapis.com/youtube/v3/channels?'
                + urlencode(url_params)
            )
            response = call_api(api_url)
            channel = response.get('items', [])
            instance.avatar = channel[0]['snippet']['thumbnails']['high']['url']
        if instance.run_auto_add_back_catalogue and not instance.has_add_back_catalogue_ran:
            add_back_catalogue_task.delay(instance.id, instance.channel_id, instance.video_filter)
            instance.has_add_back_catalogue_ran = True
        instance.save()
