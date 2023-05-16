from django.contrib.postgres.search import SearchVector, SearchRank
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import status

from .models import Episode, Podcast
from .serializers import EpisodeSerializer, PodcastSerializer

class SearchEpisodeView(ListAPIView):
    search_fields = ['transcript']
    filter_backends= (SearchFilter,)
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer

class SearchPodcastsView(ListAPIView):
    filter_backends = [SearchFilter]
    serializer_class = PodcastSerializer
    search_fields = ['name']

    def get_queryset(self):
        user_query = self.request.query_params.get('q')
        if user_query:
            vector = SearchVector('name')
            return Podcast.objects.annotate(
                search=vector,
            ).filter(name__icontains=user_query).annotate(
                rank=SearchRank(vector, user_query)
            ).order_by('-rank')
        return Podcast.objects.all()

class IncrementEpisodeCiick(APIView):
    @csrf_exempt
    def post(self, request, episode_id):
        episode = get_object_or_404(Episode, id=episode_id)
        episode.times_clicked += 1
        episode.save()
        return Response(status=status.HTTP_200_OK)
