from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Podcast

@receiver(post_save, sender=Podcast)
def add_back_catalogue_of_channel(sender, instance, **kwargs):
    # channel_id = instance.channel_id
    # api_key = os.environ.get('YOUTUBE_V3_API_KEY')
    # api_url = (
    #     'https://www.googleapis.com/youtube/v3/search?'
    #     f'key={api_key}&channelId={channel_id}&part=snippet,'
    #     'id&order=date&maxResults=3'
    # )
    # response = call_api(api_url)

    # for video in response['items']:
    #     print("video ID: ", video.id.videoID)
    #     print("video Title: ", video.snippet.title)
    pass
