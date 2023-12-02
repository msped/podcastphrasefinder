from django.contrib import admin

from .models import Episode, Podcast, EpisodeReleaseDay

admin.site.register(EpisodeReleaseDay)


class EpisodeReleaseDayInlineAdmin(admin.TabularInline):
    model = EpisodeReleaseDay
    extra = 1


@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    inlines = [EpisodeReleaseDayInlineAdmin]

    class Meta:
        model = Podcast


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    search_fields = ['id', 'video_id', 'title', 'channel__name']

    class Meta:
        model = Episode
