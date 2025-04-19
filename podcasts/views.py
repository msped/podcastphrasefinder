from django.contrib.postgres.search import SearchVector, SearchRank
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework import status
from elasticsearch_dsl import Q
from random import choice

from .documents import TranscriptDocument
from .models import Podcast, Episode
from .serializers import PodcastSerializer, TranscriptSerializer, EpisodeSerializer


class SearchEpisodeView(APIView):
    serializer_class = TranscriptSerializer
    search_document = TranscriptDocument

    def get(self, request):
        user_query = self.request.query_params.get('q', None)
        slug = self.request.query_params.get('s', None)
        if user_query:
            try:
                es_query = Q(
                    "multi_match",
                    query=user_query,
                    fields=[
                        "episode__title", "transcript"
                    ],
                    fuzziness="auto"
                ) & Q(
                    "bool",
                    should=[
                        Q("match", episode__private_video=False),
                        Q("match", error_occurred=False),
                        Q("match", episode__is_draft=False)
                    ],
                    minimum_should_match=2
                )

                if slug:
                    es_query &= Q(
                        "match", episode__channel__slug=slug
                    )

                search = TranscriptDocument.search().query(
                    es_query).highlight('transcript', fragment_size=150).highlight_options(
                        order='score',
                        pre_tags='<em><b>',
                        post_tags='</b></em>'
                )
                response = search.execute()
                serializer = self.serializer_class(
                    response, many=True, context={'request': request})
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


class GetPodcastInformation(RetrieveAPIView):
    serializer_class = PodcastSerializer
    queryset = Podcast.objects.all()
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

    def get_serializer_context(self):
        return {'request': self.request}


class RandomEpisodeView(APIView):
    serializer_class = EpisodeSerializer

    def get(self, request, slug):
        pks = Episode.objects.filter(
            channel__slug=slug).values_list('pk', flat=True)
        if not pks:
            return Response(status=status.HTTP_404_NOT_FOUND)
        random_pk = choice(pks)
        response = get_object_or_404(Episode, pk=random_pk)
        serializer = self.serializer_class(response, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
