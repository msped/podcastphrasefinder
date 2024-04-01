from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Transcript


@registry.register_document
class TranscriptDocument(Document):

    episode = fields.ObjectField(
        properties={
            "id": fields.IntegerField(),
            "channel": fields.ObjectField(
                properties={
                    "name": fields.TextField(),
                    "slug": fields.TextField(),
                    "channel_id": fields.TextField(),
                    "avatar": fields.TextField()
                }
            ),
            "title": fields.TextField(),
            "published_date": fields.TextField(),
            "private_video": fields.BooleanField(),
            "exclusive": fields.BooleanField(),
        }
    )

    class Index:
        name = "transcripts"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Transcript
        fields = [
            'id',
            'error_occurred',
            'transcript'
        ]
