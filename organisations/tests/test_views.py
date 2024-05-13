from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from podcasts.models import Podcast
from ..models import Membership


class PodcastListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def test_create_podcast(self):
        # Replace with your actual URL name
        url = reverse('podcast-list-create')
        data = {'name': 'New Podcast',
                'description': 'A new podcast description.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Podcast.objects.count(), 1)

    def test_list_podcast(self):
        Podcast.objects.create(name='Test Podcast',
                               description='Description Test', owner=self.user)
        # Replace with your actual URL name
        url = reverse('podcast-list-create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class MembershipListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser2', password='pass')
        self.client.login(username='testuser2', password='pass')
        self.podcast = Podcast.objects.create(
            name='Test Podcast', description='Description here.', owner=self.user)

    def test_create_membership(self):
        # Replace with your actual URL name
        url = reverse('membership-list-create')
        data = {'user': self.user.id, 'podcast': self.podcast.id,
                'role': 'member'}  # Adjust as per your model fields
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Membership.objects.count(), 1)


class MembershipDetailViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser3', password='password')
        self.client.login(username='testuser3', password='password')
        self.podcast = Podcast.objects.create(
            name='Another Podcast', description='Test description here.', owner=self.user)
        self.membership = Membership.objects.create(
            user=self.user, podcast=self.podcast, role='member')

    def test_retrieve_membership(self):
        # Replace with your actual URL name
        url = reverse('membership-detail',
                      kwargs={'username': self.user.username})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_membership(self):
        # Replace with your actual URL name
        url = reverse('membership-detail',
                      kwargs={'username': self.user.username})
        updated_data = {'role': 'admin'}  # Adjust as per your model fields
        response = self.client.patch(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.membership.refresh_from_db()
        self.assertEqual(self.membership.role, 'admin')

    def test_delete_membership(self):
        # Replace with your actual URL name
        url = reverse('membership-detail',
                      kwargs={'username': self.user.username})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Membership.objects.filter(
            id=self.membership.id).exists())
