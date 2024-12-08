from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Membership
from .serializers import MembershipSerializer
from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer
from .permissions import IsOrgOwner, IsOrgAdmin, IsOrgMember


# List all Podcasts where the user is the owner or create a podcast
class PodcastListCreateView(generics.ListCreateAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        podcast = serializer.save()
        Membership.objects.filter(
            user=self.request.user).update(is_primary=False)
        Membership.objects.create(
            user=self.request.user,
            podcast_id=podcast.id,
            role='Owner',
            is_primary=True
        )

    def get_queryset(self):

        ownership_list = Membership.objects.filter(
            user__id=self.request.user.id, is_primary=True
        ).values_list('podcast__id', flat=True)
        return Podcast.objects.filter(id__in=ownership_list)


class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

    def get_permissions(self):
        if self.request.method == 'PATCH':
            permission_classes = [
                IsOrgAdmin | IsOrgOwner,
                permissions.IsAuthenticated
            ]
        elif self.request.method == 'DELETE':
            permission_classes = [
                IsOrgOwner,
                permissions.IsAuthenticated
            ]
        else:
            permission_classes = [
                IsOrgAdmin | IsOrgOwner | IsOrgMember,
                permissions.IsAuthenticated
            ]
        return [permission() for permission in permission_classes]


# Handles the changing of the selected membership (podcast)
class UserOrgSelectionView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrgOwner | IsOrgAdmin | IsOrgMember
    ]

    def get(self, request):
        orgs = Membership.objects.filter(user=self.request.user)
        if orgs:
            serializer = MembershipSerializer(
                orgs, context={"request": request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        qs = Membership.objects.filter(user=request.user, is_primary=True)
        if qs.exists():
            qs.update(is_primary=False)

        podcast_slug = request.data.get("slug")
        if not podcast_slug:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            org = Membership.objects.get(
                user=request.user, podcast__slug=podcast_slug)
            org.is_primary = True
            org.save()
            serializer = MembershipSerializer(org, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Membership.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

# List users memberships and allow creation of memberships


class MembershipListCreateView(generics.ListCreateAPIView):
    serializer_class = MembershipSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [
                IsOrgAdmin | IsOrgOwner,
                permissions.IsAuthenticated
            ]
        else:
            permission_classes = [
                IsOrgAdmin | IsOrgOwner | IsOrgMember,
                permissions.IsAuthenticated
            ]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        user = User.objects.get(id=self.request.data.get('user_id'))
        membership = Membership.objects.get(
            user=self.request.user, is_primary=True)

        if not user or not membership:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        for permission in self.get_permissions():
            if not permission.has_object_permission(request, self, membership.podcast):
                return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data=self.request.data, context={
            'user': user.id,
            'podcast': membership.podcast.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        podcast = Membership.objects.get(
            user=self.request.user, is_primary=True).podcast
        if self.request.method == 'GET':
            return Membership.objects.filter(podcast=podcast)
        return Membership.objects.filter(user=self.request.user, is_primary=True)


# Allow the update and delete of a membership
class MembershipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [
                IsOrgAdmin | IsOrgOwner | IsOrgMember,
                permissions.IsAuthenticated
            ]
        elif self.request.method == 'PATCH':
            self.permission_classes = [
                IsOrgAdmin | IsOrgOwner,
                permissions.IsAuthenticated
            ]
        elif self.request.method == 'DELETE':
            self.permission_classes = [
                IsOrgOwner | IsOrgAdmin, permissions.IsAuthenticated
            ]
        else:
            self.permission_classes

        return super(MembershipDetailView, self).get_permissions()
