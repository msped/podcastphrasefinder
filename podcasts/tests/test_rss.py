import socket
import tempfile
from datetime import datetime, timezone
from io import StringIO
from pathlib import Path
from unittest.mock import MagicMock, patch

import requests
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase, override_settings

from ..rss import MAX_FEED_BYTES, FeedError, fetch_feed, parse_feed

FIXTURES = Path(__file__).resolve().parent / 'fixtures'


def load_fixture(name):
    return (FIXTURES / name).read_bytes()


def mock_response(status_code=200, content=b'', location=None):
    response = MagicMock()
    response.status_code = status_code
    response.is_redirect = location is not None
    response.headers = {'Location': location} if location else {}
    response.iter_content.return_value = [content]
    return response


def public_address(*args):
    return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('93.184.216.34', 443))]


def private_address(*args):
    return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('10.0.0.5', 443))]


class TestParseFeed(SimpleTestCase):

    def test_parse_feed_with_transcripts(self):
        feed = parse_feed(load_fixture('with_transcripts.xml'))

        self.assertEqual(feed['title'], 'Test Transcripts Podcast')
        self.assertEqual(feed['image'], 'https://example.com/artwork.jpg')
        self.assertEqual(feed['owner_email'], 'owner@example.com')
        self.assertEqual(len(feed['items']), 3)

        latest = feed['items'][0]
        self.assertEqual(latest['guid'], 'ep-3-guid')
        self.assertEqual(latest['title'], 'Episode 3')
        self.assertEqual(
            latest['pub_date'], datetime(2025, 9, 15, 6, 0, tzinfo=timezone.utc))
        self.assertEqual(latest['enclosure_url'], 'https://example.com/ep3.mp3')
        self.assertEqual(latest['transcripts'], [
            {'url': 'https://example.com/ep3.json', 'type': 'application/json'},
            {'url': 'https://example.com/ep3.vtt', 'type': 'text/vtt'},
        ])

    def test_parse_feed_reads_old_podcast_namespace(self):
        feed = parse_feed(load_fixture('with_transcripts.xml'))
        self.assertEqual(feed['items'][1]['transcripts'], [
            {'url': 'https://example.com/ep2.srt', 'type': 'application/x-subrip'},
        ])

    def test_parse_feed_guid_falls_back_to_enclosure_and_bad_date_is_none(self):
        feed = parse_feed(load_fixture('with_transcripts.xml'))
        oldest = feed['items'][2]
        self.assertEqual(oldest['guid'], 'https://example.com/ep1.mp3')
        self.assertIsNone(oldest['pub_date'])
        self.assertEqual(oldest['transcripts'], [])

    def test_parse_feed_without_transcripts_uses_fallbacks(self):
        feed = parse_feed(load_fixture('without_transcripts.xml'))
        self.assertEqual(feed['image'], 'https://example.com/channel-image.jpg')
        self.assertEqual(feed['owner_email'], 'editor@example.com')
        self.assertEqual(feed['items'][0]['transcripts'], [])

    def test_parse_feed_without_owner_email(self):
        feed = parse_feed(load_fixture('no_owner_email.xml'))
        self.assertIsNone(feed['owner_email'])
        self.assertIsNone(feed['image'])
        self.assertIsNone(feed['items'][0]['pub_date'])
        self.assertEqual(feed['items'][0]['transcripts'], [
            {'url': 'https://example.com/a.txt', 'type': None},
        ])

    def test_parse_feed_invalid_xml(self):
        with self.assertRaises(FeedError):
            parse_feed(b'<rss><channel>')

    def test_parse_feed_not_rss(self):
        with self.assertRaises(FeedError):
            parse_feed(b'<html><body>Not a feed</body></html>')

    def test_parse_feed_rejects_entity_expansion(self):
        payload = b'<?xml version="1.0"?><!DOCTYPE rss [<!ENTITY a "aaaa">]>' \
            b'<rss><channel><title>&a;</title></channel></rss>'
        with self.assertRaises(FeedError):
            parse_feed(payload)


@override_settings(RSS_ALLOW_PRIVATE_HOSTS=False)
class TestFetchFeed(SimpleTestCase):

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_success(self, mock_get, mock_getaddrinfo):
        mock_get.return_value = mock_response(content=b'<rss/>')

        content = fetch_feed('https://example.com/feed.xml')

        self.assertEqual(content, b'<rss/>')
        self.assertFalse(mock_get.call_args.kwargs['allow_redirects'])

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=private_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_blocks_private_hosts(self, mock_get, mock_getaddrinfo):
        with self.assertRaises(FeedError):
            fetch_feed('http://internal.example.com/feed.xml')
        mock_get.assert_not_called()

    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_blocks_literal_metadata_ip(self, mock_get):
        with self.assertRaises(FeedError):
            fetch_feed('http://169.254.169.254/latest/meta-data/')
        mock_get.assert_not_called()

    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_rejects_non_http_scheme(self, mock_get):
        with self.assertRaises(FeedError):
            fetch_feed('file:///etc/passwd')
        mock_get.assert_not_called()

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=socket.gaierror)
    def test_fetch_feed_unresolvable_host(self, mock_getaddrinfo):
        with self.assertRaises(FeedError):
            fetch_feed('https://does-not-exist.invalid/feed.xml')

    @patch('podcasts.rss.socket.getaddrinfo')
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_rechecks_redirect_target(self, mock_get, mock_getaddrinfo):
        mock_getaddrinfo.side_effect = [public_address(), private_address()]
        mock_get.return_value = mock_response(
            status_code=302, location='http://10.0.0.5/feed.xml')

        with self.assertRaises(FeedError):
            fetch_feed('https://example.com/feed.xml')
        self.assertEqual(mock_get.call_count, 1)

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_follows_relative_redirect(self, mock_get, mock_getaddrinfo):
        mock_get.side_effect = [
            mock_response(status_code=301, location='/new-feed.xml'),
            mock_response(content=b'<rss/>'),
        ]

        content = fetch_feed('https://example.com/feed.xml')

        self.assertEqual(content, b'<rss/>')
        self.assertEqual(
            mock_get.call_args_list[1].args[0], 'https://example.com/new-feed.xml')

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_too_many_redirects(self, mock_get, mock_getaddrinfo):
        mock_get.return_value = mock_response(
            status_code=302, location='https://example.com/loop.xml')
        with self.assertRaises(FeedError):
            fetch_feed('https://example.com/feed.xml')

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_http_error(self, mock_get, mock_getaddrinfo):
        mock_get.return_value = mock_response(status_code=404)
        with self.assertRaises(FeedError):
            fetch_feed('https://example.com/feed.xml')

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_request_exception(self, mock_get, mock_getaddrinfo):
        mock_get.side_effect = requests.exceptions.Timeout('timed out')
        with self.assertRaises(FeedError):
            fetch_feed('https://example.com/feed.xml')

    @patch('podcasts.rss.socket.getaddrinfo', side_effect=public_address)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_too_large(self, mock_get, mock_getaddrinfo):
        mock_get.return_value = mock_response(content=b'x' * (MAX_FEED_BYTES + 1))
        with self.assertRaises(FeedError):
            fetch_feed('https://example.com/feed.xml')

    @override_settings(RSS_ALLOW_PRIVATE_HOSTS=True)
    @patch('podcasts.rss.requests.get')
    def test_fetch_feed_allows_localhost_when_enabled(self, mock_get):
        mock_get.return_value = mock_response(content=b'<rss/>')
        self.assertEqual(fetch_feed('http://localhost:8800/feed.xml'), b'<rss/>')


class TestRssCoverageCommand(SimpleTestCase):

    def feeds_by_url(self, url):
        feeds = {
            'https://example.com/with.xml': load_fixture('with_transcripts.xml'),
            'https://example.com/without.xml': load_fixture('without_transcripts.xml'),
        }
        if url not in feeds:
            raise FeedError('Feed returned HTTP 404')
        return feeds[url]

    @patch('podcasts.management.commands.rss_coverage.fetch_feed')
    def test_rss_coverage_report(self, mock_fetch_feed):
        mock_fetch_feed.side_effect = self.feeds_by_url
        stdout, stderr = StringIO(), StringIO()

        call_command(
            'rss_coverage',
            'https://example.com/with.xml',
            'https://example.com/without.xml',
            'https://example.com/missing.xml',
            stdout=stdout,
            stderr=stderr,
        )

        output = stdout.getvalue()
        self.assertIn('Test Transcripts Podcast', output)
        self.assertIn('episodes: 3, with transcripts: 2 (66.7%)', output)
        self.assertIn('application/json: 1', output)
        self.assertIn('feeds checked: 2, failed: 1', output)
        self.assertIn('feeds with any transcripts: 1 (50.0%)', output)
        self.assertIn('episodes with transcripts: 2 of 4 (50.0%)', output)
        self.assertIn('feeds with owner email: 2 (100.0%)', output)
        self.assertIn('https://example.com/missing.xml', stderr.getvalue())

    @patch('podcasts.management.commands.rss_coverage.fetch_feed')
    def test_rss_coverage_reads_url_file(self, mock_fetch_feed):
        mock_fetch_feed.side_effect = self.feeds_by_url
        stdout = StringIO()

        with tempfile.NamedTemporaryFile('w', suffix='.txt') as url_file:
            url_file.write('# sample\nhttps://example.com/without.xml\n\n')
            url_file.flush()
            call_command('rss_coverage', '--file', url_file.name, stdout=stdout)

        self.assertIn('No Transcripts Podcast', stdout.getvalue())
        mock_fetch_feed.assert_called_once_with('https://example.com/without.xml')

    def test_rss_coverage_requires_urls(self):
        with self.assertRaises(CommandError):
            call_command('rss_coverage', stdout=StringIO())
