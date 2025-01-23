import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from io import BytesIO
from PIL import Image
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from podcasts.models import Podcast
import itsdangerous
from ..models import Membership
from ..utils import generate_time_based_token


MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class PodcastListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser', password='12345')
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_create_podcast(self):
        f = BytesIO()
        image = Image.new("RGB", (100, 100))
        image.save(f, 'png')
        f.seek(0)
        test_image = SimpleUploadedFile(
            "test_image.png",
            content=f.read(),
        )
        data = {
            'name': 'New Podcast',
            'avatar': test_image
        }
        response = self.client.post(
            '/api/orgs/podcasts', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Podcast.objects.count(), 1)

    def test_list_podcast(self):
        podcast = Podcast.objects.create(
            name='Test Podcast',
            slug='test-podcast',
        )
        Membership.objects.create(
            user=self.user, podcast_id=podcast.id, role='Owner', is_primary=True)
        response = self.client.get('/api/orgs/podcasts', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class PodcastDetailViewTestCase(APITestCase):
    def setUp(self):
        self.user_owner = User.objects.create(
            username='testuser1', password='password')
        self.user_admin = User.objects.create(
            username='testuser2', password='password')
        self.user_member = User.objects.create(
            username='testuser3', password='password')
        self.podcast = Podcast.objects.create(
            name='Another Podcast',
            slug='another-podcast',
        )
        self.membership_owner = Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner')
        self.membership_admin = Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin')
        self.membership_member = Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member')

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_retrieve_podcast_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.get(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_podcast_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.get(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_podcast_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.get(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_podcast_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        updated_data = {'name': 'Updated Podcast Name'}
        response = self.client.patch(
            f'/api/orgs/podcasts/{self.podcast.slug}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.podcast.refresh_from_db()
        self.assertEqual(self.podcast.name, 'Updated Podcast Name')

    def test_update_podcast_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        updated_data = {'name': 'Updated Podcast Name'}
        response = self.client.patch(
            f'/api/orgs/podcasts/{self.podcast.slug}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.podcast.refresh_from_db()
        self.assertEqual(self.podcast.name, 'Updated Podcast Name')

    def test_update_podcast_member(self):
        self.client.force_authenticate(user=self.user_member)
        updated_data = {'name': 'Updated Podcast Name'}
        response = self.client.patch(
            f'/api/orgs/podcasts/{self.podcast.slug}', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.podcast.refresh_from_db()
        self.assertNotEqual(self.podcast.name, 'Updated Podcast Name')

    def test_delete_podcast_owner_404(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.delete(
            '/api/orgs/podcasts/a-podcast-that-doesnt-exist')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_podcast_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.delete(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_podcast_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.delete(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_podcast_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.delete(
            f'/api/orgs/podcasts/{self.podcast.slug}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UserOrgSelectionViewTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1', password='password')
        self.user2 = User.objects.create_user(
            username='user2', password='password')
        self.user3 = User.objects.create_user(
            username='user3', password='password')
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
        self.assertEqual(response.data[0]['podcast']['slug'], 'podcast1')

    def test_get_no_selected_org(self):
        self.client.force_authenticate(user=self.user3)
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
        )
        Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner', is_primary=True)
        self.test_user = User.objects.create(
            email='testuser1@test.com', username='testuser1', password='pass')
        self.test_user2 = User.objects.create(
            email='testuser2@test.com', username='testuser2', password='pass')
        self.test_user3 = User.objects.create(
            email='testuser3@test.com', username='testuser3', password='pass')
        self.user_admin = User.objects.create(
            email='testuseradmin@test.com', username='testuser4', password='pass')
        Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin', is_primary=True)
        self.user_member = User.objects.create(
            username='testuser5', password='pass')
        Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member', is_primary=True)

    def list_memberships(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.get('/api/orgs/memberships')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def create_membership_is_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.post(
            '/api/orgs/memberships', {
                'user': {
                    'email': self.test_user2.email
                },
                'podcast_id': self.podcast.id,
                'role': 'Member'
            }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def create_membership_is_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.post(
            '/api/orgs/memberships', {
                'user': {
                    'email': self.test_user3.email
                },
                'podcast_id': self.podcast.id,
                'role': 'Member'
            }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_in_order(self):
        self.create_membership_is_admin()
        self.create_membership_is_member()
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


class TransferOwnershipViewTestCase(APITestCase):

    def setUp(self):
        self.user_owner = User.objects.create(
            username='testuser1', email='testuser1@test.com', password='password')
        self.user_member = User.objects.create(
            username='testuser2', email='testuser2@test.com', password='password')
        self.user_admin = User.objects.create(
            username='testuser3', email='testuser3@test.com', password='password')
        self.non_member = User.objects.create(
            username='testuser4', email='testuser4@test.com', password='password')
        self.podcast = Podcast.objects.create(
            name='Another Podcast',
            slug='another-podcast',
        )
        Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner', is_primary=True)
        Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member', is_primary=True)
        Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin', is_primary=True)

    def test_transfer_ownership_as_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {
                'requested_owner': self.user_member.email
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['new_owner']
                         ['user']['email'], self.user_member.email)
        self.assertEqual(response.data['new_owner']['role'], 'Owner')

        self.assertEqual(response.data['old_owner']
                         ['user']['email'], self.user_owner.email)
        self.assertEqual(response.data['old_owner']['role'], 'Member')

    def test_transfer_ownership_as_member(self):
        self.client.force_authenticate(user=self.user_member)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {
                'requested_owner': self.user_admin.email
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_transfer_ownership_as_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {
                'requested_owner': self.user_member.email
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_transfer_ownership_to_non_member(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {
                'requested_owner': self.non_member.email
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['error'], 'Requested user is not a member of this podcast.')

    def test_transfer_ownership_no_requested_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'A member must be selected.')

    def test_transfer_ownership_user_doesnt_exist(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            f'/api/orgs/podcasts/{self.podcast.slug}/transfer',
            {
                'requested_owner': 'test@test.com'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'],
                         'Requested user does not exist.')

    def test_transfer_ownership_no_podcast_slug(self):
        self.client.force_authenticate(user=self.user_owner)
        response = self.client.post(
            f'/api/orgs/podcasts/ddddfv/transfer',
            {
                'requested_owner': 'test@test.com'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Podcast does not exist.')


class ConfirmPodcastDeletionViewTestCase(APITestCase):
    def setUp(self):
        self.user_owner = User.objects.create(
            username='testuser1', email='testuser1@test.com', password='password')
        self.user_member = User.objects.create(
            username='testuser2', email='testuser2@test.com', password='password')
        self.user_admin = User.objects.create(
            username='testuser3', email='testuser3@test.com', password='password')
        self.non_member = User.objects.create(
            username='testuser4', email='testuser4@test.com', password='password')
        self.podcast = Podcast.objects.create(
            name='Another Podcast',
            slug='another-podcast',
        )
        Membership.objects.create(
            user=self.user_owner, podcast=self.podcast, role='Owner', is_primary=True)
        Membership.objects.create(
            user=self.user_member, podcast=self.podcast, role='Member', is_primary=True)
        Membership.objects.create(
            user=self.user_admin, podcast=self.podcast, role='Admin', is_primary=True)

    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def build_confirmation_url(self, slug, token):
        confirmation_url = f'/api/orgs/podcasts/{slug}/confirm/delete/{token}'
        return confirmation_url

    def test_get_confirmation_link_as_not_authenticated(self):
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_confirmation_link_as_owner_404(self):
        self.client.force_authenticate(user=self.user_owner)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            '404-error-podcast', token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_confirmation_link_as_owner(self):
        self.client.force_authenticate(user=self.user_owner)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Podcast.objects.filter(
            slug=self.podcast.slug).exists())

    def test_get_confirmation_link_as_admin(self):
        self.client.force_authenticate(user=self.user_admin)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_confirmation_link_as_member(self):
        self.client.force_authenticate(user=self.user_member)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_confirmation_link_as_non_member(self):
        self.client.force_authenticate(user=self.non_member)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_tampered_token(self):
        self.client.force_authenticate(user=self.user_owner)
        token = generate_time_based_token({
            'podcast_id': self.podcast.id,
        })
        tampered_token = token + 'a'
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, tampered_token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_wrong_podcast_id(self):
        self.client.force_authenticate(user=self.user_owner)
        token = generate_time_based_token({
            'podcast_id': 999,
        })
        confirmation_url = self.build_confirmation_url(
            self.podcast.slug, token)
        response = self.client.get(confirmation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
