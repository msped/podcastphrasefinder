from rest_framework import serializers
from .models import Membership

from authentication.serializers import UserSerializer
from podcasts.serializers import PodcastSerializer


class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    podcast = PodcastSerializer(many=False, read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'podcast', 'role', 'is_primary']
