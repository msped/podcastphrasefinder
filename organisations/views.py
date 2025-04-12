from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
import itsdangerous
from .models import Membership
from .serializers import MembershipSerializer
from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer
from .permissions import IsOrgOwner, IsOrgAdmin, IsOrgMember
from .utils import generate_time_based_token


# List all Podcasts where the user is the owner or create a podcast
class PodcastListCreateView(generics.ListCreateAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

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

    def get_serializer_context(self):
        return {'request': self.request}

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

    def destroy(self, request, slug):
        podcast = self.get_object()

        podcast_owner = podcast.membership_set.get(role='Owner').user

        token = generate_time_based_token({
            'podcast_id': podcast.id,
        })

        confirmation_link = f"{request.scheme}://{request.get_host()}/creator/podcast/{podcast.slug}/confirm/delete/{token}"

        subject = f'Action Required: {podcast.name} - Confirm Podcast Deletion'
        message = f'Are you sure you want to delete the podcast "{podcast.name}"? This action cannot be undone.\n\nTo confirm, please click on the following link, it will expire in 10 minutes:\n: {confirmation_link}\n\nIf you didnt request this, please ignore this email.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [podcast_owner.email]

        send_mail(subject, message, from_email,
                  recipient_list, fail_silently=False)

        return Response(status=status.HTTP_200_OK)


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
            serializer = MembershipSerializer(
                org, many=False, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Membership.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

# List users memberships and allow creation of memberships


class MembershipListCreateView(generics.ListCreateAPIView):
    serializer_class = MembershipSerializer

    def get_serializer_context(self):
        return {'request': self.request}

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
        user_request_obj = self.request.data.get('user')
        if not user_request_obj:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(email=user_request_obj['email'])
        membership = Membership.objects.get(
            user=self.request.user, is_primary=True)

        if not membership:
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

    def get_serializer_context(self):
        return {'request': self.request}

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

# Transfer the ownership of podcast to a member


class TransferOwnershipView(APIView):
    permission_classes = [IsOrgOwner, permissions.IsAuthenticated]

    def post(self, request, slug):
        if not slug or not Podcast.objects.filter(slug=slug).exists():
            return Response({'error': 'Podcast does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            current_owner_membership = Membership.objects.get(
                user=request.user, podcast__slug=slug, role='Owner')
        except Membership.DoesNotExist:
            return Response({'error': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        requested_owner_email = request.data.get('requested_owner')
        if not requested_owner_email:
            return Response({'error': 'A member must be selected.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            requested_owner = User.objects.get(email=requested_owner_email)
        except User.DoesNotExist:
            return Response({'error': 'Requested user does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            requested_owner_membership = Membership.objects.get(
                user=requested_owner, podcast=current_owner_membership.podcast
            )
        except Membership.DoesNotExist:
            return Response({'error': 'Requested user is not a member of this podcast.'}, status=status.HTTP_400_BAD_REQUEST)

        if current_owner_membership and requested_owner_membership:
            token = generate_time_based_token({
                'podcast_id': current_owner_membership.podcast.id,
                'requested_owner_id': requested_owner.id,
                'current_owner_id': current_owner_membership.user.id
            })

            podcast = current_owner_membership.podcast

            confirmation_link = f"{request.scheme}://{request.get_host()}/creator/podcast/{podcast.slug}/confirm/transfer/{token}"

            subject = f'Transfer Request: {podcast.name}'
            message = f'Are you sure you want to transfer ownership of the podcast \
            "{podcast.name}" to {requested_owner_membership.user.first_name} {requested_owner_membership.user.last_name} \
            ({requested_owner.email})? This action cannot be undone.\n\nTo confirm, please click on the following \
            link, it will expire in 10 minutes: \n: {confirmation_link}\n\nIf you didnt request this, please ignore this email.'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [current_owner_membership.user.email]

            send_mail(subject, message, from_email,
                      recipient_list, fail_silently=False)

            return Response(status=status.HTTP_200_OK)


class ConfirmDeletePodcastView(generics.RetrieveAPIView):
    permission_classes = [IsOrgOwner, permissions.IsAuthenticated]
    serializer_class = PodcastSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    queryset = Podcast.objects.all()

    def get(self, request, slug, token):
        podcast = self.get_object()

        serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)

        try:
            # Has the token expired?
            data = serializer.loads(token, max_age=600)
        except itsdangerous.SignatureExpired:
            return Response({'error': 'Confirmation link has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except itsdangerous.BadSignature:  # Tampered token
            return Response({'error': 'Invalid confirmation link.'}, status=status.HTTP_403_FORBIDDEN)

        if data['podcast_id'] != podcast.id:
            return Response({'error': 'Invalid confirmation link.'}, status=status.HTTP_403_FORBIDDEN)

        podcast.delete()
        return Response(status=status.HTTP_200_OK)


class ConfirmTransferPodcastView(generics.RetrieveAPIView):
    permission_classes = [IsOrgOwner, permissions.IsAuthenticated]
    serializer_class = PodcastSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    queryset = Podcast.objects.all()

    def get(self, request, slug, token):
        podcast = self.get_object()

        serializer = itsdangerous.URLSafeTimedSerializer(settings.SECRET_KEY)

        try:
            # Has the token expired?
            data = serializer.loads(token, max_age=600)
        except itsdangerous.SignatureExpired:
            return Response({'error': 'Confirmation link has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except itsdangerous.BadSignature:  # Tampered token
            return Response({'error': 'Invalid confirmation link.'}, status=status.HTTP_403_FORBIDDEN)

        if data['podcast_id'] != podcast.id or 'requested_owner_id' not in data or 'current_owner_id' not in data:
            return Response({'error': 'Invalid confirmation link.'}, status=status.HTTP_403_FORBIDDEN)

        current_owner_membership = Membership.objects.get(
            user__id=data['current_owner_id'], podcast=podcast)
        requested_owner_membership = Membership.objects.get(
            user__id=data['requested_owner_id'], podcast=podcast)

        current_owner_serializer = MembershipSerializer(
            instance=current_owner_membership, data={"role": "Member"}, partial=True, context={"request": request}
        )
        requested_owner_serializer = MembershipSerializer(
            instance=requested_owner_membership, data={"role": "Owner"}, partial=True, context={"request": request}
        )
        if current_owner_serializer.is_valid() and requested_owner_serializer.is_valid():
            current_owner_serializer.save()
            requested_owner_serializer.save()

            return Response(status=status.HTTP_200_OK)
        else:
            errors = current_owner_serializer.errors
            errors.update(requested_owner_serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
