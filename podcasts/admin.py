from django.contrib import admin

from .models import Episode, Podcast, EpisodeReleaseDay, Transcript
from organisations.models import Membership

admin.site.register(EpisodeReleaseDay)


class EpisodeReleaseDayInlineAdmin(admin.TabularInline):
    model = EpisodeReleaseDay
    extra = 1


class MembershipInlineAdmin(admin.TabularInline):
    model = Membership
    extra = 0


class TranscriptInlineAdmin(admin.TabularInline):
    model = Transcript
    extra = 0


@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    inlines = [EpisodeReleaseDayInlineAdmin, MembershipInlineAdmin]

    class Meta:
        model = Podcast


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    search_fields = ['id', 'video_id', 'title', 'channel__name']
    list_filter = ['title', 'channel__name',]
    inlines = [TranscriptInlineAdmin]
    list_display = [
        'id',
        'video_id',
        'title',
        'channel',
        'private_video',
        'is_draft',
        'exclusive',
    ]

    class Meta:
        model = Episode
