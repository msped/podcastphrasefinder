from rest_framework import serializers

from .models import Podcast, Episode


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
            'video_id',
            'channel',
            'title',
            'transcript',
            'published_date',
            'error_occurred',
            'private_video',
            'exclusive',
            'highlight',
        ]
