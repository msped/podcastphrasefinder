from django.urls import path

from .views import (
    SearchEpisodeView,
    IncrementEpisodeCiick,
    SearchPodcastsView,
    GetMostClickedPodcast,
    GetPodcastInformation
)

urlpatterns = [
    path('podcasts/episode/search', SearchEpisodeView.as_view(), name='search_episodes'),
    path('podcasts/search', SearchPodcastsView.as_view(), name="search_podcasts"),
    path(
        'podcasts/<str:channel_id>',
        GetPodcastInformation.as_view(),
        name='get_podcast_information'
    ),
    path(
        'podcasts/episode/increment/<int:episode_id>',
        IncrementEpisodeCiick.as_view(),
        name='increment_episode_clicked'
    ),
    path('podcasts/episode/popular', GetMostClickedPodcast.as_view(), name='get_most_popular'),
]
