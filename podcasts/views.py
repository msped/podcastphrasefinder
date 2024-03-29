from django.contrib.postgres.search import SearchVector, SearchRank
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import status
from elasticsearch_dsl import Q

from .documents import EpisodeDocument
from .models import Podcast
from .serializers import EpisodeSerializer, PodcastSerializer


class SearchEpisodeView(APIView):
    serializer_class = EpisodeSerializer
    search_document = EpisodeDocument

    def get(self, request):
        user_query = self.request.query_params.get('q', None)
        slug = self.request.query_params.get('s', None)
        if user_query:
            try:
                es_query = Q(
                    "multi_match",
                    query=user_query,
                    fields=[
                        "title", "transcript"
                    ],
                    fuzziness="auto"
                ) & Q(
                    "bool",
                    should=[
                        Q("match", private_video=False),
                        Q("match", error_occurred=False)
                    ],
                    minimum_should_match=2
                )

                if slug:
                    es_query &= Q(
                        "match", channel__slug=slug
                    )

                search = EpisodeDocument.search().query(
                    es_query).highlight('transcript', fragment_size=150).highlight_options(
                        order='score',
                        pre_tags='<b>',
                        post_tags='</b>'
                )
                response = search.execute()
                serializer = self.serializer_class(response, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as err:
                return Response(str(err), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_200_OK)


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
        return Podcast.objects.all()[:5]


class GetPodcastInformation(APIView):
    def get(self, request, slug):
        channel = get_object_or_404(Podcast, slug=slug)
        serializer = PodcastSerializer(channel, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
