from django.contrib import admin

from .models import Episode, Podcast, EpisodeReleaseDay

admin.site.register(Episode)
admin.site.register(EpisodeReleaseDay)

class EpisodeReleaseDayInlineAdmin(admin.TabularInline):
    model = EpisodeReleaseDay
    extra = 1

@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    inlines = [EpisodeReleaseDayInlineAdmin]

    class Meta:
        model = Podcast
