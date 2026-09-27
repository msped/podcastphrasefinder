from collections import Counter

from django.core.management.base import BaseCommand, CommandError

from podcasts.rss import FeedError, fetch_feed, parse_feed


def _percent(part, whole):
    return round(part / whole * 100, 1) if whole else 0.0


class Command(BaseCommand):
    help = 'Report how many episodes in the given RSS feeds publish <podcast:transcript> tags.'

    def add_arguments(self, parser):
        parser.add_argument('urls', nargs='*', help='RSS feed URLs.')
        parser.add_argument(
            '--file', help='Path to a file with one feed URL per line (# for comments).')

    def handle(self, *args, **options):
        urls = list(options['urls'])
        if options['file']:
            with open(options['file'], encoding='utf-8') as url_file:
                urls += [
                    line.strip() for line in url_file
                    if line.strip() and not line.strip().startswith('#')
                ]
        if not urls:
            raise CommandError('Provide feed URLs or --file.')

        feeds_checked = 0
        feeds_with_transcripts = 0
        feeds_with_owner_email = 0
        total_items = 0
        total_items_with_transcripts = 0
        failed = 0

        for url in urls:
            try:
                feed = parse_feed(fetch_feed(url))
            except FeedError as err:
                failed += 1
                self.stderr.write(f'{url}\n  error: {err}\n')
                continue

            items = feed['items']
            items_with_transcripts = [item for item in items if item['transcripts']]
            formats = Counter(
                transcript['type'] or 'unknown'
                for item in items_with_transcripts
                for transcript in item['transcripts']
            )

            feeds_checked += 1
            total_items += len(items)
            total_items_with_transcripts += len(items_with_transcripts)
            if items_with_transcripts:
                feeds_with_transcripts += 1
            if feed['owner_email']:
                feeds_with_owner_email += 1

            format_summary = ', '.join(
                f'{name}: {count}' for name, count in formats.most_common()) or 'none'
            self.stdout.write(
                f"{feed['title'] or url}\n"
                f'  url: {url}\n'
                f'  episodes: {len(items)}, with transcripts: {len(items_with_transcripts)} '
                f'({_percent(len(items_with_transcripts), len(items))}%)\n'
                f'  formats: {format_summary}\n'
                f"  owner email: {'yes' if feed['owner_email'] else 'no'}\n"
            )

        self.stdout.write(
            'Summary\n'
            f'  feeds checked: {feeds_checked}, failed: {failed}\n'
            f'  feeds with any transcripts: {feeds_with_transcripts} '
            f'({_percent(feeds_with_transcripts, feeds_checked)}%)\n'
            f'  episodes with transcripts: {total_items_with_transcripts} of {total_items} '
            f'({_percent(total_items_with_transcripts, total_items)}%)\n'
            f'  feeds with owner email: {feeds_with_owner_email} '
            f'({_percent(feeds_with_owner_email, feeds_checked)}%)'
        )
