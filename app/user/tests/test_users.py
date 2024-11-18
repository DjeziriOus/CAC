from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from core.models import User

CREATE_USER_URL = '/user/create/'
TOKEN_URL = '/user/token/'
MANAGE_USER_URL = '/user/manage/'

def create_user(**params):
    """Helper function to create a user."""
    return get_user_model().objects.create_user(**params)

class PublicUserApiTests(TestCase):
    """Test the publicly available user API."""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """Test creating a user with valid payload."""
        payload = {
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'student'
        }
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=payload['email'])
        self.assertTrue(user.check_password(payload['password']))
        self.assertEqual(user.role, 'student')
        self.assertNotIn('password', res.data)

    def test_user_already_exists(self):
        """Test creating a user that already exists fails."""
        payload = {
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'student'
        }
        create_user(**payload)
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        """Test that the password must be more than 5 characters."""
        payload = {'email': 'test@example.com', 'password': 'pw'}
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload['email']).exists()
        self.assertFalse(user_exists)

    def test_create_token_success(self):
        """Test creating a token for a user."""
        payload = {'email': 'test@example.com', 'password': 'testpassword'}
        create_user(**payload)
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

    def test_create_token_invalid_credentials(self):
        """Test token is not created if invalid credentials are given."""
        create_user(email='test@example.com', password='testpassword')
        payload = {'email': 'test@example.com', 'password': 'wrongpassword'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', res.data)

    def test_create_token_no_user(self):
        """Test token is not created if user does not exist."""
        payload = {'email': 'test@example.com', 'password': 'testpassword'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', res.data)


class PrivateUserApiTests(TestCase):
    """Test the private user API."""

    def setUp(self):
        self.user = create_user(
            email='user@example.com',
            password='testpassword',
            first_name='User',
            last_name='Test',
            role='student'
        )
        self.admin_user = create_user(
            email='admin@example.com',
            password='adminpassword',
            first_name='Admin',
            last_name='Test',
            role='admin'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_own_profile(self):
        """Test retrieving own profile."""
        res = self.client.get(MANAGE_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], self.user.email)
        self.assertEqual(res.data['role'], self.user.role)


    def test_update_own_profile(self):
        """Test updating own profile."""
        payload = {'first_name': 'NewName', 'last_name': 'Updated'}
        res = self.client.patch(MANAGE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, payload['first_name'])
        self.assertEqual(self.user.last_name, payload['last_name'])


    def test_email_unchangeable(self):
        """Test that the email field cannot be changed."""
        payload = {'email': 'newemail@example.com'}
        res = self.client.patch(MANAGE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'user@example.com')  # Email should remain unchanged


    def test_admin_can_list_all_users(self):
        """Test that admin can list all users."""
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get(MANAGE_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 2)

   


