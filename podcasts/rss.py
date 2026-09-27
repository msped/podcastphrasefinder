import ipaddress
import socket
from email.utils import parsedate_to_datetime
from urllib.parse import urljoin, urlparse

import requests
from defusedxml import DefusedXmlException
from defusedxml import ElementTree
from django.conf import settings

ITUNES_NAMESPACE = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
# Older feeds still declare the namespace by its GitHub docs URL.
PODCAST_NAMESPACES = (
    'https://podcastindex.org/namespace/1.0',
    'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md',
)

FEED_TIMEOUT = 10
MAX_FEED_BYTES = 30 * 1024 * 1024
MAX_REDIRECTS = 5
USER_AGENT = 'PodcastPhraseFinder/1.0 (+https://podcastphrasefinder.com)'


class FeedError(Exception):
    pass


def _check_host_allowed(url):
    """
    Reject URLs that resolve to private, loopback or link-local addresses so
    user-supplied feed URLs can't be used to reach internal services.
    Allowed in development via RSS_ALLOW_PRIVATE_HOSTS for local fixture feeds.
    """
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname:
        raise FeedError(f'Unsupported feed URL: {url}')
    if getattr(settings, 'RSS_ALLOW_PRIVATE_HOSTS', False):
        return
    port = parsed.port or (443 if parsed.scheme == 'https' else 80)
    try:
        addresses = socket.getaddrinfo(parsed.hostname, port)
    except socket.gaierror as err:
        raise FeedError(f'Could not resolve {parsed.hostname}') from err
    for *_, sockaddr in addresses:
        if not ipaddress.ip_address(sockaddr[0]).is_global:
            raise FeedError(f'Feed host is not publicly routable: {url}')


def fetch_feed(url):
    for _ in range(MAX_REDIRECTS + 1):
        _check_host_allowed(url)
        try:
            response = requests.get(
                url,
                timeout=FEED_TIMEOUT,
                stream=True,
                allow_redirects=False,
                headers={'User-Agent': USER_AGENT},
            )
        except requests.exceptions.RequestException as err:
            raise FeedError(str(err)) from err

        if response.is_redirect:
            # Follow redirects manually so each hop is checked by _check_host_allowed.
            url = urljoin(url, response.headers['Location'])
            response.close()
            continue

        if response.status_code != 200:
            response.close()
            raise FeedError(f'Feed returned HTTP {response.status_code}')

        content = bytearray()
        for chunk in response.iter_content(chunk_size=65536):
            content.extend(chunk)
            if len(content) > MAX_FEED_BYTES:
                response.close()
                raise FeedError('Feed is too large')
        return bytes(content)

    raise FeedError('Too many redirects')


def _text(element, path):
    node = element.find(path)
    if node is not None and node.text:
        return node.text.strip()
    return None


def _parse_date(value):
    if not value:
        return None
    try:
        return parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None


def _owner_email(channel):
    email = _text(channel, f'{{{ITUNES_NAMESPACE}}}owner/{{{ITUNES_NAMESPACE}}}email')
    if email:
        return email
    # managingEditor is usually "email@example.com (Name)"
    editor = _text(channel, 'managingEditor')
    if editor:
        for part in editor.split():
            if '@' in part:
                return part.strip('()<>')
    return None


def _image(channel):
    itunes_image = channel.find(f'{{{ITUNES_NAMESPACE}}}image')
    if itunes_image is not None and itunes_image.get('href'):
        return itunes_image.get('href')
    return _text(channel, 'image/url')


def _transcripts(item):
    return [
        {'url': tag.get('url'), 'type': tag.get('type')}
        for namespace in PODCAST_NAMESPACES
        for tag in item.findall(f'{{{namespace}}}transcript')
        if tag.get('url')
    ]


def _parse_item(item):
    enclosure = item.find('enclosure')
    enclosure_url = enclosure.get('url') if enclosure is not None else None
    return {
        'guid': _text(item, 'guid') or enclosure_url,
        'title': _text(item, 'title'),
        'pub_date': _parse_date(_text(item, 'pubDate')),
        'enclosure_url': enclosure_url,
        'transcripts': _transcripts(item),
    }


def parse_feed(content):
    try:
        root = ElementTree.fromstring(content)
    except (ElementTree.ParseError, DefusedXmlException) as err:
        raise FeedError(f'Could not parse feed: {err}') from err

    channel = root.find('channel')
    if channel is None:
        raise FeedError('Not an RSS feed')

    return {
        'title': _text(channel, 'title'),
        'image': _image(channel),
        'owner_email': _owner_email(channel),
        'items': [_parse_item(item) for item in channel.findall('item')],
    }
