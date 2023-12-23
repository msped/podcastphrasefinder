from __future__ import absolute_import, unicode_literals
import os
from datetime import datetime as date
from html import unescape
from urllib.parse import urlencode
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import transaction

from .models import Episode, Podcast, EpisodeReleaseDay
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
        'type': 'video',
    }

    while True:
        response = call_api(
            'https://www.googleapis.com/youtube/v3/search?'
            + urlencode(url_params)
        )

        next_page_token = response.get("nextPageToken", "")

        videos = response.get('items', [])

        for video in videos:
            video_title = unescape(video['snippet']['title'])
            if not video_filter or video_filter in video_title:
                video_id = video['id']['videoId']
                transcript, error = get_transcript(video_id)
                if len(transcript) > 3000 and not error or error:
                    video_data.append({
                        'video_id': video_id,
                        'channel_id': channel_id,
                        'title': video_title,
                        'transcript': transcript,
                        'error_occurred': error,
                        'published_date': video['snippet']['publishedAt']
                    })
                    logger.info(f"{video_title} - Error: {error}")

        if next_page_token == "":
            break
        url_params['pageToken'] = next_page_token

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
        response = call_api(
            'https://www.googleapis.com/youtube/v3/channels?'
            + urlencode(url_params)
        )
        channel = response.get('items', [])
        response_avatar = channel[0]['snippet']['thumbnails']['high']['url']
        if response_avatar != podcast.avatar:
            podcast.avatar = response_avatar
            podcast.save()


@shared_task
def get_new_episodes():
    # Gets day of the week sunday 1, monday 2 etc
    video_data = []

    for item in EpisodeReleaseDay.objects.filter(
        day=(date.today().isoweekday() % 7) + 1,
        podcast__run_get_new_episodes=True
    ):
        podcast = item.podcast
        podcast_episode_qs = Episode.objects.filter(
            channel__id=podcast.id
        )

        url_params = {
            'key': api_key,
            'channelId': podcast.channel_id,
            'part': 'snippet,id',
            'order': 'date',
            'maxResults': 50,
            'type': 'video',
        }

        while True:
            video_break = False
            response = call_api(
                'https://www.googleapis.com/youtube/v3/search?'
                + urlencode(url_params)
            )

            next_page_token = response.get("nextPageToken", "")

            videos = response.get('items', [])

            for video in videos:
                video_id = video['id']['videoId']
                if not podcast_episode_qs.filter(video_id=video_id).exists():
                    video_title = unescape(video['snippet']['title'])
                    if not podcast.video_filter or \
                            podcast.video_filter in video_title:
                        transcript, error = get_transcript(video_id)
                        if len(transcript) > 3000 and not error or error:
                            video_data.append({
                                'video_id': video_id,
                                'channel_id': podcast.id,
                                'title': video_title,
                                'transcript': transcript,
                                'error_occurred': error,
                                'published_date': video['snippet']['publishedAt']
                            })
                            logger.info(f"{video_title} - Error: {error}")
                else:
                    video_break = True

            if next_page_token == "" or video_break:
                break
            url_params['pageToken'] = next_page_token

    if len(video_data) > 0:
        Episode.objects.bulk_create([Episode(**data) for data in video_data])
