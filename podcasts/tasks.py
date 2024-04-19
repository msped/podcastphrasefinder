from __future__ import absolute_import, unicode_literals
import os
import sys
from datetime import datetime as date
from html import unescape
from urllib.parse import urlencode
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import transaction

from .models import Episode, Podcast, EpisodeReleaseDay, Transcript
from .utils import call_api, create_transcript_models, check_for_private_video

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
                video_data.append({
                    'video_id': video_id,
                    'channel_id': channel_id,
                    'title': video_title,
                    'published_date': video['snippet']['publishedAt']
                })
                logger.info(f"{video_title}")

        if next_page_token == "":
            break
        url_params['pageToken'] = next_page_token

    return create_transcript_models(video_data)


@shared_task
def check_for_private_videos():
    episodes = Episode.objects.filter(is_draft=False)

    videos = {}

    for episode in episodes:
        if episode.transcripts():
            is_private = check_for_private_video(episode.video_id)
            if episode.private_video != is_private:
                videos[episode.id] = is_private

    with transaction.atomic():
        for key, value in videos.items():
            Episode.objects.filter(id=key).update(private_video=value)


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
                        video_data.append({
                            'video_id': video_id,
                            'channel_id': podcast.id,
                            'title': video_title,
                            'published_date': video['snippet']['publishedAt']
                        })
                        logger.info(f"{video_title}")
                else:
                    video_break = True

            if next_page_token == "" or video_break:
                break
            url_params['pageToken'] = next_page_token

    return create_transcript_models(video_data)
