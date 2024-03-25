from django.urls import path

from .views import (
    SearchEpisodeView,
    SearchPodcastsView,
    GetPodcastInformation
)

urlpatterns = [
    path('podcasts/episode/search',
         SearchEpisodeView.as_view(), name='search_episodes'),
    path('podcasts/search', SearchPodcastsView.as_view(), name="search_podcasts"),
    path(
        'podcasts/<slug:slug>',
        GetPodcastInformation.as_view(),
        name='get_podcast_information'
    ),
]
