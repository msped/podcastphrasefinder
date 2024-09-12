from django.urls import path

from .views import (
    YouTubeVideoIdCheck,
    AddYouTubeEpisode,
    CreatorEpisodes,
    EpisodeDetailView,
)

urlpatterns = [
    path('youtube/add', AddYouTubeEpisode.as_view()),
    path('youtube/add/check', YouTubeVideoIdCheck.as_view(),
         name='youtube_add_check'),
    path('<slug:slug>/episodes', CreatorEpisodes.as_view(), name='creator_episodes'),
    path('episodes/<pk>',
         EpisodeDetailView.as_view(), name='bulk_deleteepisodes'),
]
