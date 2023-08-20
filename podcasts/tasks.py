from __future__ import absolute_import, unicode_literals
import os
from html import unescape
from urllib.parse import urlencode
from datetime import datetime
from celery import shared_task
from celery.utils.log import get_task_logger

from .models import Episode
from .utils import call_api, get_transcript

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
                        'published_date': video['snippet']['publishedAt'][:-10]
                    })
                    logger.info(f"{video_title} - Error: {error}")

        if next_page_token == "":
            break

    Episode.objects.bulk_create([Episode(**data) for data in video_data])
