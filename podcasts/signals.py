from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Episode, Transcript

from .utils import get_transcript


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
