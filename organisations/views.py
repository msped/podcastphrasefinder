from rest_framework import generics, permissions
from .models import Membership
from .serializers import MembershipSerializer
from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer


class PodcastListCreateView(generics.ListCreateAPIView):
    queryset = Podcast.objects.filter()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MembershipListCreateView(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MembershipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
