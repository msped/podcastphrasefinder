from django.urls import path

from .views import SearchEpisodeView, IncrementEpisodeCiick, SearchPodcastsView

urlpatterns = [
    path('podcasts/episode/search', SearchEpisodeView.as_view(), name='search_episodes'),
    path('podcasts/search', SearchPodcastsView.as_view(), name="search_podcasts"),
    path(
        'podcasts/episode/increment/<int:episode_id>',
        IncrementEpisodeCiick.as_view(),
        name='increment_episode_clicked'
    )
]
