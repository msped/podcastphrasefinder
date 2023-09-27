from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Episode

@registry.register_document
class EpisodeDocument(Document):

    channel = fields.ObjectField(
        properties = {
            "name": fields.TextField(),
            "channel_id": fields.TextField(),
            "avatar": fields.TextField()
        }
    )

    class Index:
        name = "episodes"

    class Django:
        model = Episode
        fields = [
            'id',
            'video_id',
            'title',
            'transcript',
            'thumbnail',
            'published_date',
            'private_video',
            'error_occurred'
        ]
