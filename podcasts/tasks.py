from __future__ import absolute_import, unicode_literals
import os
from html import unescape
from urllib.parse import urlencode
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import transaction

from .models import Episode, Podcast
from .utils import call_api, get_transcript, check_for_private_video

api_key = os.environ.get('YOUTUBE_V3_API_KEY')

logger = get_task_logger(__name__)

@shared_task
def add_back_catalogue_task(channel_id, yt_channel_id, video_filter):
    video_data = []

    url_params = {
        'key': api_key,
        'channelId': yt_channel_id,
        'part': 'snippet,id',
        'order': 'date',
        'maxResults': 50,
    }

    while True:
        next_page_token = ""
        api_url = (
            'https://www.googleapis.com/youtube/v3/search?'
            + urlencode(url_params)
        )
        response = call_api(api_url)

        next_page_token = response.get("nextPageToken", "")

        if next_page_token != "":
            url_params['pageToken'] = next_page_token

        videos = response.get('items', [])

        for video in videos:
            if video['id']['kind'] == 'youtube#video':
                video_title = unescape(video['snippet']['title'])
                if not video_filter or video_filter in video_title:
                    video_id = video['id']['videoId']
                    transcript, error = get_transcript(video_id)
                    video_data.append({
                        'video_id': video_id,
                        'channel_id': channel_id,
                        'title': video_title,
                        'transcript': transcript,
                        'error_occurred': error,
                        'thumbnail': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
                        'published_date': video['snippet']['publishedAt']
                    })
                    logger.info(f"{video_title} - Error: {error}")

        if next_page_token == "":
            break

    Episode.objects.bulk_create([Episode(**data) for data in video_data])

@shared_task
def check_for_private_videos():
    episodes = Episode.objects.filter(error_occurred=False)

    video_ids = {}

    for episode in episodes:
        video_visibility = check_for_private_video(episode.video_id)
        if episode.private_video != video_visibility:
            video_ids[episode.video_id] = video_visibility

    with transaction.atomic():
        for key, value in video_ids.items():
            Episode.objects.filter(video_id=key).update(private_video=value)

@shared_task
def check_avatar():
    podcasts = Podcast.objects.all()

    for podcast in podcasts:
        url_params = {
                'key': api_key,
                'id': podcast.channel_id,
                'part': 'snippet',
            }
        api_url = (
            'https://www.googleapis.com/youtube/v3/channels?'
            + urlencode(url_params)
        )
        response = call_api(api_url)
        channel = response.get('items', [])
        response_avatar = channel[0]['snippet']['thumbnails']['high']['url']
        if response_avatar != podcast.avatar:
            podcast.avatar = response_avatar
            podcast.save()
    