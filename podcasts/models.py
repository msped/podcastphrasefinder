from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Podcast(models.Model):
    name = models.CharField(max_length=50)
    channel_link = models.URLField()

    def __str__(self):
        return f'{self.name}'

class Episode(models.Model):
    video_id = models.CharField(max_length=11, unique=True)
    channel = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=125)
    transcript_with_time = ArrayField(models.JSONField(), null=True, blank=True)
    transcript = models.TextField()
    times_clicked = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.channel.name} - {self.title}'
