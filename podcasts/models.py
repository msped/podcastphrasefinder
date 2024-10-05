from django.db import models
from django.template.defaultfilters import slugify


def upload_to(instance, filename):
    return '/'.join(['avatars', str(instance.name), filename])


class Podcast(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True, null=True)
    avatar = models.ImageField(upload_to=upload_to, blank=True, null=True)

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
        transcripts = Transcript.objects.filter(
            episode__id=self.id, error_occurred=False)
        if transcripts.exists():
            return transcripts
        return None

    def has_error_occurred(self):
        return Transcript.objects.filter(
            episode__id=self.id,
            error_occurred=True
        ).exists()


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
