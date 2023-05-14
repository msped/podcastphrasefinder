from rest_framework import serializers

from .models import Podcast, Episode

class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = [
            'id',
            'name',
            'channel_link',
        ]

class EpisodeSerializer(serializers.ModelSerializer):
    channel = serializers.SerializerMethodField()
    class Meta:
        model = Episode
        fields = [
            'id',
            'video_id',
            'channel',
            'title',
            'transcript',
            'times_clicked',
        ]

    def get_channel(self, obj):
        channel = Podcast.objects.get(id=obj.channel.id)
        serializer = PodcastSerializer(channel, many=False)
        return serializer.data
