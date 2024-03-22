from rest_framework import serializers

from .models import Podcast, Episode
from creatoradmin.utils import get_video_id


class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = [
            'id',
            'name',
            'channel_id',
            'avatar',
        ]


class EpisodeSerializer(serializers.ModelSerializer):
    channel_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Podcast.objects.all(),
        source='channel'
    )
    video_id = serializers.CharField(write_only=True)
    channel = PodcastSerializer(many=False, read_only=True)
    highlight = serializers.SerializerMethodField()

    def get_highlight(self, obj):
        if hasattr(obj, 'meta') and \
                hasattr(obj.meta, 'highlight') and \
                hasattr(obj.meta.highlight, 'transcript'):
            return list(obj.meta.highlight.transcript)
        return None

    class Meta:
        model = Episode
        fields = [
            'id',
            'channel_id',
            'channel',
            'title',
            'video_id',
            'transcript',
            'published_date',
            'error_occurred',
            'private_video',
            'is_draft',
            'exclusive',
            'highlight',
        ]

    def create(self, validated_data):
        episode = Episode.objects.create(**validated_data)
        return episode

    def update(self, instance, validated_data):
        if 'video_id' in validated_data:
            processed_video_id = get_video_id(validated_data['video_id'])
            validated_data['video_id'] = processed_video_id

        instance = super().update(instance, validated_data)
        return instance
