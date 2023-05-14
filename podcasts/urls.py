from django.urls import path

from .views import SearchEpisodeView, IncrementEpisodeCiick

urlpatterns = [
    path('podcasts/search', SearchEpisodeView.as_view(), name='search'),
    path(
        'podcasts/increment/<int:episode_id>',
        IncrementEpisodeCiick.as_view(),
        name='increment_episode_clicked'
    )
]
