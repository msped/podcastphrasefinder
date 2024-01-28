from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from podcasts.models import Episode
from podcasts.utils import get_transcript

from .utils import get_video_id

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
