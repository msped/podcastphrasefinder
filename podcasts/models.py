from django.db import models

from youtube_transcript_api import YouTubeTranscriptApi

class Podcast(models.Model):
    name = models.CharField(max_length=50)
    channel_id = models.CharField(max_length=24)
    video_filter = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f'{self.name}'

class Episode(models.Model):
    video_id = models.CharField(max_length=11, unique=True)
    channel = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=125)
    transcript = models.TextField(blank=True, null=True)
    times_clicked = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.channel.name} - {self.title}'

    def save(self, *args, **kwargs):
        transcript_list = YouTubeTranscriptApi.get_transcript(self.video_id)
        self.transcript = " ".join([transcript['text'] for transcript in transcript_list])
        super().save(*args, **kwargs)
