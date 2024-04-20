from django.db import connection
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Podcast, Episode, Transcript
from .tasks import add_back_catalogue_task
from .utils import get_avatar, get_transcript


@receiver(post_save, sender=Podcast)
def add_back_catalogue_of_channel(sender, instance, update_fields=None, **kwargs):
    if connection.settings_dict['NAME'] != 'testdatabase':
        if not instance.avatar:
            instance.avatar = get_avatar(instance.channel_id)
            instance.save(update_fields=['avatar'])
        if instance.run_auto_add_back_catalogue and not instance.has_add_back_catalogue_ran:
            add_back_catalogue_task.delay(
                instance.id, instance.channel_id, instance.video_filter)
            instance.has_add_back_catalogue_ran = True
            instance.save(update_fields=['has_add_back_catalogue_ran'])


@receiver(post_save, sender=Episode)
def add_transcript_from_episode_save(sender, instance, **kwargs):
    if not Transcript.objects.filter(episode_id=instance.id).exists():
        transcript, error = get_transcript(instance.video_id)
        new_transcript = Transcript.objects.create(
            episode_id=instance.id,
            transcript=transcript,
            error_occurred=error
        )
        return new_transcript
