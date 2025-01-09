"""
View for question and answer API.

"""

# views.py

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.models import Question, Answer, User
from questionAnswer.serializers import QuestionSerializer, AnswerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

class QuestionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing, creating, and updating questions.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can create questions

    def get_queryset(self):
        """
        Override the default queryset to filter by the current user's role when creating or updating questions.
        """
        if self.request.user.is_authenticated:
            # Only show questions created by the authenticated user
            return Question.objects.filter(user=self.request.user)
        return Question.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Create a new question. The user must be authenticated.
        """
        # Verify the user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Automatically assign the authenticated user to the question
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)  # Set the authenticated user here
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing question. Only the question creator can update it.
        """
        question = self.get_object()
        if question.user != request.user:
            return Response(
                {"detail": "You can only update your own questions."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def list_answers(self, request, pk=None):
        """
        Public endpoint to view answers to a specific question.
        """
        question = self.get_object()
        answer = question.answer  # Each question has only one answer
        answer_serializer = AnswerSerializer(answer)
        return Response(answer_serializer.data)

# Custom Permission to allow only doctors or admins to create/update answers
class IsDoctorOrAdmin(BasePermission):
    """
    Custom permission to grant access only to doctors and admins for creating or updating answers.
    """
    def has_permission(self, request, view):
        return request.user.role in ['doctor', 'admin']

class AnswerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating, updating, and listing answers to questions.
    """
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def get_permissions(self):
        """
        Override get_permissions to apply custom permission to create/update actions.
        """
        if self.action in ['create', 'update']:
            self.permission_classes = [IsDoctorOrAdmin]  # Allow only doctors or admins
        else:
            self.permission_classes = []  # No restrictions for other actions (e.g., listing answers)
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Override the create method to ensure the question is not already answered and the user is authorized.
        """
        question_id = self.request.data.get('question')
        question = Question.objects.get(id=question_id)
        
        if question.state == 'répondu':
            raise PermissionDenied("This question has already been answered.")

        # Ensure that only doctors or admins can answer
        if self.request.user.role not in ['doctor', 'admin']:
            raise PermissionDenied("Only doctors or admins can answer questions.")

        # Save the answer with the authenticated user
        serializer.save(user=self.request.user, question=question)
        # Update the question state to 'répondu' after answering
        question.state = 'répondu'
        question.save()

    def perform_update(self, serializer):
        """
        Override the update method to ensure that only the creator of the answer (doctor/admin) can update it.
        """
        answer = self.get_object()
        if answer.user != self.request.user:
            raise PermissionDenied("You can only update your own answers.")

        # Save the updated answer
        serializer.save()