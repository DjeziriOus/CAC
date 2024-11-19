"""
Test for models .

"""
from unittest.mock import patch

from decimal import Decimal
from core import models
from django.test import TestCase
from django.contrib.auth import get_user_model


def create_user(email='test@example.com', password="test123"):
    "create and return a new user."
    return get_user_model().objects.create_user(email, password)

class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """ test creating user with an email successfully."""
        email = 'test@example.com'
        password ='testpass1234'
        user = get_user_model().objects.create_user(
            email = email,
            password = password
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
    
    def test_new_user_email_normalized(self):
        """ Test email is normalized for new users ."""

        sample_email = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.COM', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com']
        ]

        for email, expected in sample_email:
            user = get_user_model().objects.create_user(email, 'sample123')
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_errors(self):
        """Test creating new user without an email raises a ValueError. """
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'test123')

    def test_create_superuser(self):
        """Test creating superuser."""
        User = get_user_model().objects.create_superuser(
            'test@example.com',
            'test123'
        )

        self.assertTrue(User.is_superuser)
        self.assertTrue(User.is_staff)
    
    def test_create_question(self):
        """test creating question"""

        user = get_user_model().objects.create_user(
            'test@example.com',
            'test123'
        )
        question = models.Question.objects.create(
            user = user,
            description = 'description',
        )
        self.assertEqual(str(question),question.description)