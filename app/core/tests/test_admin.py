"""
Tests for Django admin modifications.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import Client


class AdminSiteTests(TestCase):
    """Tests for Django admin."""

    def setUp(self):
        """Create user and client."""
        self.client = Client()
        self.admin_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            password="test123",
            role="admin",
        )
        self.client.force_login(self.admin_user)

        self.user = get_user_model().objects.create_user(
            email="user@example.com",
            password="user123",
            first_name="New",
            last_name="User",
            role="student",
        )

    def test_user_list(self):
        """Test that users are listed on the page."""
        url = reverse("admin:core_user_changelist")
        res = self.client.get(url)

        self.assertContains(res, self.user.first_name)
        self.assertContains(res, self.user.last_name)
        self.assertContains(res, self.user.email)

    def test_edit_user_page(self):
        """Test that the edit user page works."""
        url = reverse("admin:core_user_change", args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_create_user_page(self):
        """Test that the create user page works."""
        url = reverse("admin:core_user_add")
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_admin_user_creation_with_roles(self):
        """Test creating a user with a specific role in admin."""
        url = reverse("admin:core_user_add")
        user_data = {
            "email": "newuser@example.com",
            "password1": "newpass123",
            "password2": "newpass123",
            "role": "doctor",
            "first_name": "New",
            "last_name": "Doctor",
        }
        res = self.client.post(url, user_data)

        self.assertEqual(res.status_code, 302)  # Redirect after creation
        user = get_user_model().objects.get(email="newuser@example.com")
        self.assertEqual(user.role, "doctor")

    def test_admin_search_functionality(self):
        """Test that admin search works for users."""
        url = reverse("admin:core_user_changelist")
        res = self.client.get(url, {"q": "user@example.com"})  # Search for user's email

        self.assertContains(res, self.user.email)

    def test_admin_filters(self):
        """Test that admin filters work as expected."""
        url = reverse("admin:core_user_changelist")
        res = self.client.get(url, {"role": "student"})  # Filter by role

        self.assertContains(res, self.user.email)
        self.assertNotContains(res, self.admin_user.email)

    def test_user_detail_page_displays_correct_info(self):
        """Test that the user detail page displays the correct information."""
        url = reverse("admin:core_user_change", args=[self.user.id])
        res = self.client.get(url)

        self.assertContains(res, self.user.email)
        self.assertContains(res, self.user.first_name)
        self.assertContains(res, self.user.last_name)

    def test_admin_can_edit_roles(self):
        """Test that admin can edit user roles."""
        url = reverse("admin:core_user_change", args=[self.user.id])
        res = self.client.post(url, {
            "email": self.user.email,
            "role": "doctor",
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        })

        self.assertEqual(res.status_code, 302)  # Redirect after saving
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, "doctor")
    
    def test_admin_filters(self):
        """Test that admin filters work as expected."""
        url = reverse("admin:core_user_changelist")
        # Apply filter for "student" role
        res = self.client.get(url, {"role": "student"})
        # Ensure that the student user is included
        self.assertContains(res, self.user.email)

