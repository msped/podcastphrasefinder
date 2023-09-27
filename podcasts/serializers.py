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
    class Meta:
        model = Episode
        fields = [
            'id',
            'video_id',
            'channel',
            'title',
            'transcript',
            'thumbnail',
            'times_clicked',
            'published_date',
            'error_occurred',
            'private_video'
        ]
