# Generated by Django 4.2.1 on 2023-09-14 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0003_episode_private_video'),
    ]

    operations = [
        migrations.AddField(
            model_name='podcast',
            name='avatar',
            field=models.URLField(blank=True, null=True),
        ),
    ]
