from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status


User = get_user_model()


class UserTestCase(TestCase):
    def setUp(self):
        """Set up users and client."""
        self.client = APIClient()

        # Create users
        self.patient = User.objects.create_user(
            email="patient@example.com",
            password="patientpassword",
            role="patient",
        )
        self.student = User.objects.create_user(
            email="student@example.com",
            password="studentpassword",
            role="student",
        )
        self.doctor = User.objects.create_user(
            email="doctor@example.com",
            password="doctorpassword",
            role="doctor",
        )
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpassword",
            role="admin",
        )

    def test_patient_can_ask_question(self):
        """Test that patients can ask a question."""
        self.client.force_authenticate(user=self.patient)

        question_data = {
            "title": "What is diabetes?",
            "body": "I want to know more about diabetes.",
        }
        response = self.client.post("/question/ask-question/", question_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_student_can_ask_question(self):
        """Test that students can ask a question."""
        self.client.force_authenticate(user=self.student)

        question_data = {
            "title": "What is AI?",
            "body": "I want to learn about artificial intelligence.",
        }
        response = self.client.post("/question/ask-question/", question_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_doctor_can_add_article(self):
        """Test that doctors can add an article."""
        self.client.force_authenticate(user=self.doctor)

        article_data = {
            "title": "The Importance of Exercise",
            "content": "Exercise improves your health significantly.",
        }
        response = self.client.post("/article/add-article/", article_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_non_admin_cannot_manage_users(self):
        """Test that non-admin users cannot access the manage-users endpoint."""
        self.client.force_authenticate(user=self.patient)

        response = self.client.get("/user/manage-users/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
