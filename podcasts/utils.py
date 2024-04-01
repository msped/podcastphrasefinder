import os
from time import sleep
from urllib.parse import urlencode
import requests

from youtube_transcript_api import YouTubeTranscriptApi

from .models import Episode, Transcript
from .serializers import EpisodeSerializer

api_key = os.environ.get('YOUTUBE_V3_API_KEY')


def call_api(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print(f"An error occurred: {err}")
        return None


def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([transcript['text']
                              for transcript in transcript_list])
        return transcript, False
    except Exception as e:
        return str(e), True


def check_for_private_video(video_id):
    sleep(5)
    response = requests.get(
        f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        timeout=10
    )
    return response.status_code == 404


def get_avatar(channel_id):
    url_params = {
        'key': api_key,
        'id': channel_id,
        'part': 'snippet',
    }
    api_url = (
        'https://www.googleapis.com/youtube/v3/channels?'
        + urlencode(url_params)
    )
    response = call_api(api_url)
    channel = response.get('items', [])
    return channel[0]['snippet']['thumbnails']['high']['url']


def create_transcript_models(video_data):
    if len(video_data) > 0:
        episodes = Episode.objects.bulk_create(
            [Episode(**data) for data in video_data])
        serializer = EpisodeSerializer(episodes, many=True, context={
                                       'obtain_video_id': True})
        for episode in serializer.data:
            transcript, error = get_transcript(video_id=episode.video_id)
            if len(transcript) > 3000:
                Transcript.objects.create(
                    episode_id=episode.id,
                    transcript=transcript,
                    error_occurred=error
                )
            else:
                episode.private_video = True
                episode.save(update_fields=['private_video'])
        return serializer.data
    return 'No episodes found.'
