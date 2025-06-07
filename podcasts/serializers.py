from rest_framework import serializers

from .models import Podcast, Episode, Transcript, EpisodeReleaseDay, PodcastRSSFeed
from creatoradmin.utils import get_video_id


class PodcastSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        if obj.avatar:
            try:
                if hasattr(obj.avatar, 'url'):
                    avatar_url = obj.avatar.url
                else:
                    avatar_url = obj.avatar
            except ValueError:
                avatar_url = None
            if avatar_url is not None and 'request' in self.context:
                return self.context['request'].build_absolute_uri(
                    avatar_url
                )
            return avatar_url
        return None

    class Meta:
        model = Podcast
        fields = [
            'id',
            'name',
            'slug',
            'avatar',
        ]


class EpisodeReleaseDaySerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(many=False, read_only=True)
    podcast_id = serializers.PrimaryKeyRelatedField(
        queryset=Podcast.objects.all(),
        source='podcast',
        write_only=True,
        allow_null=True
    )

    class Meta:
        model = EpisodeReleaseDay
        fields = ['id', 'podcast', 'podcast_id', 'day']


class PodcastRSSFeedSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(many=False, read_only=True)
    podcast_id = serializers.PrimaryKeyRelatedField(
        queryset=Podcast.objects.all(),
        source='podcast',
        write_only=True,
        allow_null=True
    )

    class Meta:
        model = PodcastRSSFeed
        fields = ['id', 'podcast', 'podcast_id',
                  'rss_feed_url', 'last_updated']
        read_only_fields = ['last_updated']


class EpisodeSerializer(serializers.ModelSerializer):
    channel_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Podcast.objects.all(),
        source='channel'
    )
    video_id = serializers.CharField(write_only=True)
    channel = PodcastSerializer(many=False, read_only=True)

    class Meta:
        model = Episode
        fields = [
            'id',
            'channel_id',
            'channel',
            'title',
            'video_id',
            'published_date',
            'private_video',
            'is_draft',
            'exclusive',
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

    def to_representation(self, instance):
        add_video_id = self.context.get('obtain_video_id', False)
        if add_video_id:
            return instance
        return super().to_representation(instance)


class TranscriptSerializer(serializers.ModelSerializer):
    episode = EpisodeSerializer(many=False)
    highlight = serializers.SerializerMethodField()

    def get_highlight(self, obj):
        if hasattr(obj, 'meta') and \
                hasattr(obj.meta, 'highlight') and \
                hasattr(obj.meta.highlight, 'transcript'):
            return list(obj.meta.highlight.transcript)
        return None

    class Meta:
        model = Transcript
        fields = [
            'id',
            'episode',
            'error_occurred',
            'transcript',
            'highlight'
        ]

    def create(self, validated_data):
        episode_data = validated_data.pop('episode')
        channel = episode_data.pop('channel')
        episode = Episode.objects.create(channel=channel, **episode_data)
        transcript = Transcript.objects.create(
            episode=episode, **validated_data)
        return transcript

    def update(self, instance, validated_data):
        episode_data = validated_data.pop('episode', None)
        transcript_data = validated_data.pop('transcript', None)

        if episode_data is not None:
            for key, value in episode_data.items():
                if key not in ('channel_id', 'video_id'):
                    setattr(instance.episode, key, value)
            instance.episode.save()

        if transcript_data is not None:
            instance.transcript = transcript_data
            instance.save()
        instance = super().update(instance, validated_data)
        return instance
