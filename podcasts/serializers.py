from rest_framework import serializers

from .models import Podcast, Episode

class PodcastSerializer(serializers.ModelSerializer):
    no_of_episodes = serializers.SerializerMethodField()
    class Meta:
        model = Podcast
        fields = [
            'id',
            'name',
            'channel_id',
            'no_of_episodes',
            'avatar',
        ]

    def get_no_of_episodes(self, obj):
        return Episode.objects.filter(
            channel_id=obj.id, error_occurred=False, private_video=False
        ).count()

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
            'thumbnail',
            'times_clicked',
            'published_date',
        ]

    def get_channel(self, obj):
        channel = Podcast.objects.get(id=obj.channel.id)
        serializer = PodcastSerializer(channel, many=False)
        return serializer.data
