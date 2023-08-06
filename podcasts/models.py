from django.db import models

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
    error_occurred = models.BooleanField(default=False)

    def __str__(self):
        if self.error_occurred:
            return f'ERROR {self.channel.name} - {self.title}'
        return f'{self.channel.name} - {self.title}'
