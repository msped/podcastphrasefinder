from django.db import models

from .utils import get_transcript


class Podcast(models.Model):
    name = models.CharField(max_length=50)
    channel_id = models.CharField(max_length=24)
    video_filter = models.CharField(max_length=10, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    run_auto_add_back_catalogue = models.BooleanField(default=True)
    has_add_back_catalogue_ran = models.BooleanField(default=False)
    run_get_new_episodes = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.name}'


class Episode(models.Model):
    video_id = models.CharField(max_length=11, unique=True)
    channel = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=125)
    transcript = models.TextField(blank=True, null=True)
    times_clicked = models.IntegerField(default=0)
    error_occurred = models.BooleanField(default=False)
    published_date = models.DateTimeField()
    private_video = models.BooleanField(default=False)
    exclusive = models.BooleanField(default=False)

    def __str__(self):
        if self.error_occurred:
            return f'ERROR {self.channel.name} - {self.title}'
        elif self.exclusive:
            return f'Exclusive: {self.channel.name} - {self.title}'
        return f'{self.channel.name} - {self.title}'

    def save(self, *args, **kwargs):
        if not self.transcript or self.error_occurred:
            transcript, error = get_transcript(self.video_id)
            self.transcript = transcript
            if error:
                self.error_occurred = True
        super().save(*args, **kwargs)


class EpisodeReleaseDay(models.Model):
    DAY_CHOICES = (
        (1, "Sunday"),
        (2, "Monday"),
        (3, "Tuesday"),
        (4, "Wednesday"),
        (5, "Thursday"),
        (6, "Friday"),
        (7, "Saturday")
    )

    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    day = models.IntegerField(choices=DAY_CHOICES, default=2)

    def __str__(self):
        return f'An Episode of {self.podcast.name} ' + \
            f'is released on a {self.get_day_display()}'
