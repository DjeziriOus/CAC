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
        """Test creating a question."""
        # Create a user with role 'student'
        user = get_user_model().objects.create_user(
            email='teststudent@example.com',
            password='test123',
            role='student'
        )
        # Create a question
        question = models.Question.objects.create(
            user=user,
            question ='What is Django?',
        )
        # Verify the string representation
        self.assertEqual(str(question), question.question)
        # Verify the user and state
        self.assertEqual(question.user, user)
        self.assertEqual(question.state, 'pas encore répondu')  # Use the correct default value


    def test_create_answer(self):
        """Test creating an answer."""
        # Create a user with role 'doctor'
        doctor = get_user_model().objects.create_user(
            email='testdoctor@example.com',
            password='test123',
            role='doctor'
        )
        # Create a student user and a question
        student = get_user_model().objects.create_user(
            email='teststudent@example.com',
            password='test123',
            role='student'
        )
        question = models.Question.objects.create(
            user=student,
            question='What is Django?',
        )
        # Create an answer for the question
        answer = models.Answer.objects.create(
            question=question,
            user=doctor,
            response='Django is a high-level Python web framework.'
        )
        # Verify the string representation
        self.assertEqual(
            str(answer), 
            answer.response
        )
        # Verify the answer's attributes
        self.assertEqual(answer.question, question)
        self.assertEqual(answer.user, doctor)
        self.assertEqual(answer.response, 'Django is a high-level Python web framework.')
