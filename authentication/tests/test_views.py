import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from unittest.mock import patch
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from organisations.models import Membership
from podcasts.models import Podcast, Episode

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class UserDeleteAccountViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/user/delete'
        self.user_owner = User.objects.create_user(
            username='testuser', password='testpass')
        self.user_member = User.objects.create_user(
            username='testmember', password='testpass')
        self.podcast = Podcast.objects.create(
            name='Test Podcast',
        )
        self.membership_owner = Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner')
        self.membership_member = Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member')

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def delete_account_not_authenticated(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def delete_account_as_user_and_owner_with_podcast(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def delete_account_as_user_and_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            User.objects.filter(username='testmember').exists()
        )
        self.assertFalse(
            Membership.objects.filter(user=self.user_member).exists()
        )

    def delete_account_as_user_and_no_podcast(self):
        Podcast.objects.all().delete()
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            User.objects.filter(username='testuser').exists()
        )

    def test_in_order(self):
        self.delete_account_not_authenticated()
        self.delete_account_as_user_and_owner_with_podcast()
        self.delete_account_as_user_and_member()
        self.delete_account_as_user_and_no_podcast()
