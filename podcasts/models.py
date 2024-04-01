from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify


class Podcast(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)  # Blank is admin ownership
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True, null=True)
    channel_id = models.CharField(max_length=24)
    video_filter = models.CharField(max_length=10, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    run_auto_add_back_catalogue = models.BooleanField(default=True)
    has_add_back_catalogue_ran = models.BooleanField(default=False)
    run_get_new_episodes = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.name}'

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.name)
        return super(Podcast, self).save(*args, **kwargs)


class Episode(models.Model):
    video_id = models.CharField(max_length=11, unique=True)
    channel = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=125)
    published_date = models.DateTimeField()
    private_video = models.BooleanField(default=False)
    exclusive = models.BooleanField(default=False)
    is_draft = models.BooleanField(default=False)

    def __str__(self):
        if self.exclusive:
            return f'Exclusive: {self.channel.name} - {self.title}'
        return f'{self.channel.name} - {self.title}'

    def transcripts(self):
        transcripts = Transcript.objects.filter(episode__id=self.id)
        if transcripts.exists():
            return transcripts
        return False


class Transcript(models.Model):
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE)
    transcript = models.TextField(blank=True, null=True)
    error_occurred = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.episode.title} - Transcript'


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
