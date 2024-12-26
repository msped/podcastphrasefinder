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

    def create(self, validated_data):
        user_id = self.context.get('user', None)
        podcast_id = self.context.get('podcast', None)
        if user_id is None or podcast_id is None:
            raise serializers.ValidationError(
                "Both 'user' and 'podcast' fields are required for creation.")

        return Membership.objects.create(user_id=user_id, podcast_id=podcast_id, **validated_data)
