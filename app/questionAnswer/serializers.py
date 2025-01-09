"""
Serializers for Q/A APIs.

"""

from rest_framework import serializers
from core.models import Question, Answer, User
from rest_framework.exceptions import PermissionDenied

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id','question'] 

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'response']

    def validate(self, data):
        """
        Custom validation to ensure that only doctors or admins can create or update an answer.
        """
        user = self.context['request'].user  # Get the current authenticated user

        # Check if the user is a doctor or admin
        if user.role not in ['doctor', 'admin']:
            raise PermissionDenied("Only doctors or admins can create or update answers.")
        
        return data

