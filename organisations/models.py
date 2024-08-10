from django.db import models
from django.contrib.auth.models import User
from podcasts.models import Podcast

ROLE_CHOICES = (
    ('Owner', 'Owner'),
    ('Admin', 'Admin'),
    ('Member', 'Member')
)


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_primary = models.BooleanField(default=False)
