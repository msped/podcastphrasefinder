from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from organisations.models import Membership
from organisations.permissions import IsOrgAdmin, IsOrgMember, IsOrgOwner
from podcasts.models import Episode, Podcast, Transcript
from podcasts.serializers import EpisodeSerializer, TranscriptSerializer
from podcasts.utils import get_transcript

from .utils import get_video_id, convert_date_from_picker

# Create your views here.


class YouTubeVideoIdCheck(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        youtube_url = request.data.get('url')
        video_id = get_video_id(youtube_url)

        if video_id and Episode.objects.filter(video_id=video_id).exists():
            return Response(status=status.HTTP_226_IM_USED)

        transcript, error = get_transcript(video_id)

        return Response({'text': transcript, 'error': error}, status=status.HTTP_200_OK)


class AddYouTubeEpisode(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EpisodeSerializer

    def post(self, request):
        # This needs to be changed. Will open an issue so I can remember!
        podcast_id = Podcast.objects.values_list('id', flat=True).first()

        data = {
            'channel_id': podcast_id,
            'title': request.data.get('title'),
            'transcript': request.data.get('transcript'),
            'exclusive': bool(request.data.get('exclusive')),
            'video_id': get_video_id(request.data.get('url')),
            'error_occurred': bool(request.data.get('error_occurred')),
            'published_date': convert_date_from_picker(request.data.get('published_date')),
            'is_draft': bool(request.data.get('is_draft'))
        }

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreatorEpisodes(ListAPIView):
    permission_classes = [
        IsOrgAdmin | IsOrgMember | IsOrgOwner,
        IsAuthenticated
    ]
    serializer_class = EpisodeSerializer

    def get_queryset(self):
        selected_org = Membership.objects.filter(
            user=self.request.user, is_primary=True).first()
        if selected_org:
            return Episode.objects.filter(channel__slug=selected_org.podcast.slug)
        return None


class EpisodeDetailView(RetrieveUpdateDestroyAPIView):
    # Why Transcript? Its the episode with the transcript
    # instead of just the episode.
    permission_classes = [
        IsOrgAdmin | IsOrgMember | IsOrgOwner,
        IsAuthenticated
    ]
    queryset = Transcript.objects.all()
    serializer_class = TranscriptSerializer
    lookup_field = 'episode__id'
    lookup_url_kwarg = 'pk'

    def destroy(self, request, *args, **kwargs):
        # Delete the episode, will delete the transcipt
        episode = get_object_or_404(Episode, pk=kwargs['pk'])
        episode.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
