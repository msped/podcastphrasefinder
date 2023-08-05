from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Podcast
from .tasks import add_back_catalogue_task

@receiver(post_save, sender=Podcast)
def add_back_catalogue_of_channel(sender, instance, **kwargs):
    add_back_catalogue_task.delay(instance.id, instance.channel_id)
