# Generated by Django 4.2.1 on 2023-12-28 19:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("podcasts", "0008_episode_exclusive"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="episode",
            name="times_clicked",
        ),
    ]