# Generated by Django 4.2.1 on 2023-12-23 21:40

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("podcasts", "0006_merge_20230924_1645"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="episode",
            name="thumbnail",
        ),
    ]
