from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from ..models import Membership, Podcast, ROLE_CHOICES
from ..serializers import MembershipSerializer


class MembershipSerializerTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create(
            username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')
        self.podcast = Podcast.objects.create(
            owner=self.user,
            name='Test Podcast',
            channel_id='UChl6sFeO_O0drTc1CG1ymFw',
            avatar='https://www.exmaple.com/'
        )

        # Create some memberships.
        self.member_role = ROLE_CHOICES[0][0]
        self.admin_role = ROLE_CHOICES[1][0]

        self.membership = Membership.objects.create(
            user=self.user,
            podcast=self.podcast,
            role=self.member_role
        )

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
