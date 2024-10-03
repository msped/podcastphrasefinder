import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from ..models import Membership, Podcast, ROLE_CHOICES
from ..serializers import MembershipSerializer

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class MembershipSerializerTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create(
            username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')
        self.podcast = Podcast.objects.create(
            name='Test Podcast',
            avatar=SimpleUploadedFile('test.png', content=b'4321')
        )

        # Create some memberships.
        self.member_role = ROLE_CHOICES[0][0]
        self.admin_role = ROLE_CHOICES[1][0]

        self.membership = Membership.objects.create(
            user=self.user,
            podcast=self.podcast,
            role=self.member_role
        )

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_contains_expected_fields(self):
        serializer = MembershipSerializer(instance=self.membership)

        request = self.factory.get('/')
        serializer_context = {'request': Request(request)}
        serializer = MembershipSerializer(
            instance=self.membership, context=serializer_context)

        data = serializer.data
        self.assertEqual(data['user']['id'], self.user.id)
        self.assertEqual(data['podcast']['id'], self.podcast.id)
        self.assertEqual(data['role'], self.member_role)
        self.assertFalse(data['is_primary'])

    def test_field_content(self):
        serializer = MembershipSerializer(instance=self.membership)

        self.assertEqual(serializer.data['user']['id'], self.user.id)
        self.assertEqual(serializer.data['podcast']['id'], self.podcast.id)
        self.assertEqual(serializer.data['role'], self.member_role)
        self.assertFalse(serializer.data['is_primary'])
