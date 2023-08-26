import requests

from youtube_transcript_api import YouTubeTranscriptApi

def call_api(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print(f"An error occurred: {err}")
        return None

def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([transcript['text'] for transcript in transcript_list])
        return transcript, False
    except Exception as e:
        return str(e), True
