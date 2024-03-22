from datetime import datetime
from urllib.parse import urlparse, parse_qs


def get_video_id(youtube_url):
    if not youtube_url.startswith(('http://', 'https://')):
        youtube_url = f'https://{youtube_url}'
    parsed_url = urlparse(youtube_url)
    video_id = parse_qs(parsed_url.query).get('v')
    return video_id[0] if video_id else None


def convert_date_from_picker(unformatted_date):
    new_date = datetime.strptime(
        unformatted_date, '%m/%d/%Y').strftime('%Y-%m-%d')
    return f'{str(new_date)}T00:00:01Z'
