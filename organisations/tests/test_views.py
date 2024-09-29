from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from podcasts.models import Podcast
from ..models import Membership


class PodcastListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser', password='12345')
        self.client.force_authenticate(user=self.user)

    def test_create_podcast(self):
        data = {
            'owner': self.user.id,
            'channel_id': 'UChl6sFeO_O0drTc1CG1ymFw',
            'name': 'New Podcast'
        }
        response = self.client.post(
            '/api/orgs/podcasts', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Podcast.objects.count(), 1)

    def test_list_podcast(self):
        podcast = Podcast.objects.create(
            name='Test Podcast',
            slug='test-podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw'
        )
        Membership.objects.create(
            user=self.user, podcast_id=podcast.id, role='Owner', is_primary=True)
        response = self.client.get('/api/orgs/podcasts', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class UserOrgSelectionViewTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1', password='password')
        self.user2 = User.objects.create_user(
            username='user2', password='password')
        self.podcast1 = Podcast.objects.create(
            name='podcast1', slug='podcast1')
        self.podcast2 = Podcast.objects.create(
            name='podcast2', slug='podcast2')
        self.membership1 = Membership.objects.create(
            user=self.user1, podcast=self.podcast1, role='Owner', is_primary=True)
        self.membership2 = Membership.objects.create(
            user=self.user2, podcast=self.podcast2, role='Member')
        self.membership3 = Membership.objects.create(
            user=self.user1, podcast=self.podcast2, role='Member')

    def test_get_selected_org(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/orgs/memberships/user')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['podcast']['slug'], 'podcast1')

    def test_get_no_selected_org(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get('/api/orgs/memberships/user')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_post_select_org(self):
        self.client.force_authenticate(user=self.user1)
        data = {'slug': 'podcast2'}
        response = self.client.post(
            '/api/orgs/memberships/user', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['podcast']['slug'], 'podcast2')
        self.membership1.refresh_from_db()
        self.assertFalse(self.membership3.is_primary)

    def test_post_select_org_no_slug(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/orgs/memberships/user', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_select_nonexistent_org(self):
        self.client.force_authenticate(user=self.user1)
        data = {'slug': 'nonexistent-podcast'}
        response = self.client.post(
            '/api/orgs/memberships/user', data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_user(self):
        response = self.client.get('/api/orgs/memberships/user')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post('/api/orgs/memberships/user', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MembershipListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user_owner = User.objects.create(
            username='testuser', password='pass')
        self.podcast = Podcast.objects.create(
            name='Test Podcast',
            slug='test-podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw'
        )
        Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner')
        self.test_user = User.objects.create(
            username='testuser1', password='pass')
        self.test_user2 = User.objects.create(
            username='testuser2', password='pass')
        self.test_user3 = User.objects.create(
            username='testuser3', password='pass')
        self.user_admin = User.objects.create(
            username='testuser4', password='pass')
        Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin')
        self.user_member = User.objects.create(
            username='testuser5', password='pass')
        Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member')

    def create_membership_is_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            '/api/orgs/memberships', {
                'user_id': self.test_user.id,
                'podcast_id': self.podcast.id,
                'role': 'Member'
            }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def list_memberships(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.get('/api/orgs/memberships')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def create_membership_is_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.post(
            '/api/orgs/memberships', {
                'user_id': self.test_user2.id,
                'podcast_id': self.podcast.id,
                'role': 'Member'
            }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def create_membership_is_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.post(
            '/api/orgs/memberships', {
                'user_id': self.test_user3.id,
                'podcast_id': self.podcast.id,
                'role': 'Member'
            }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_in_order(self):
        # self.create_membership_is_owner()
        # self.create_membership_is_admin()
        # self.create_membership_is_member()
        self.list_memberships()


class MembershipDetailViewTestCase(APITestCase):
    def setUp(self):
        self.user_owner = User.objects.create(
            username='testuser1', password='password')
        self.user_admin = User.objects.create(
            username='testuser2', password='password')
        self.user_member = User.objects.create(
            username='testuser3', password='password')
        test_user_data = [
            {
                "username": "testuser4",
                "password": "password"
            },
            {
                "username": "testuser5",
                "password": "password"
            },
            {
                "username": "testuser6",
                "password": "password"
            }
        ]
        User.objects.bulk_create(User(**data)
                                 for data in test_user_data)
        self.podcast = Podcast.objects.create(
            name='Another Podcast',
            slug='another-podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw'
        )
        Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner')
        Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin')
        Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member')

    def test_retrieve_membership_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        member = Membership.objects.all().first()
        response = self.client.get(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_membership_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        member = Membership.objects.all().first()
        response = self.client.get(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_membership_member(self):
        self.client.force_authenticate(user=self.user_member)
        member = Membership.objects.all().first()
        response = self.client.get(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_membership_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        updated_data = {'role': 'Admin'}
        member = Membership.objects.all().first()
        response = self.client.patch(
            f'/api/orgs/memberships/{member.id}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        member.refresh_from_db()
        self.assertEqual(member.role, 'Admin')

    def test_update_membership_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        updated_data = {'role': 'Admin'}
        member = Membership.objects.all().first()
        response = self.client.patch(
            f'/api/orgs/memberships/{member.id}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        member.refresh_from_db()
        self.assertEqual(member.role, 'Admin')

    def test_update_membership_member(self):
        self.client.force_authenticate(user=self.user_member)
        updated_data = {'role': 'Admin'}
        member = Membership.objects.all().first()
        response = self.client.patch(
            f'/api/orgs/memberships/{member.id}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        member.refresh_from_db()
        self.assertEqual(member.role, 'Owner')

    def test_delete_membership_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        member = Membership.objects.all().first()
        response = self.client.delete(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Membership.objects.filter(
            id=member.id).exists())

    def test_delete_membership_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        member = Membership.objects.all().first()
        response = self.client.delete(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Membership.objects.filter(
            id=member.id).exists())

    def test_delete_membership_member(self):
        self.client.force_authenticate(user=self.user_member)
        member = Membership.objects.all().first()
        response = self.client.delete(f'/api/orgs/memberships/{member.id}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
