from django.urls import path

from .views import YouTubeVideoIdCheck

urlpatterns = [
    path('youtube/add/check', YouTubeVideoIdCheck.as_view(),
         name='youtube_add_check'),
]
