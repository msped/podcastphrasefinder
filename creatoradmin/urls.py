from django.urls import path

from .views import YouTubeVideoIdCheck, AddYouTubeEpisode

urlpatterns = [
    path('youtube/add', AddYouTubeEpisode.as_view()),
    path('youtube/add/check', YouTubeVideoIdCheck.as_view(),
         name='youtube_add_check'),
]
