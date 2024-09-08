from django.urls import path

from .views import (
    SearchEpisodeView,
    SearchPodcastsView,
    GetPodcastInformation,
    RandomEpisodeView,
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
    path('podcasts/<slug:slug>/episode/random',
         RandomEpisodeView.as_view(), name="get_random_episode"),
]
