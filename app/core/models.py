"""
Database models .

"""

from django.utils import timezone
from datetime import datetime
import os
import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    "Manager for Users ."

    def create_user(self, email, password= None, **extra_fields):
        """create , save and return new user ."""
        if not email : 
            raise ValueError("User must have an email address.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')  # Default role for superuser

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('student', 'Student'),
    ]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    anonymous = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']

    def __str__(self):
        return f"{self.email} ({self.role})"
    
class Question(models.Model):
    """Question model."""
    STATE_CHOICES = {
        ('pas encore répondu', 'Pas encore répondu'),
        ('répondu', 'Répondu'),
    } 
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['patient', 'student']}  # Limit users to patient or student roles
    )
    question = models.CharField(max_length=255, blank=False)
    state = models.CharField(max_length=255,choices=STATE_CHOICES, default='pas encore répondu')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.question}"
    

class Answer(models.Model):
    """Answer model."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['doctor', 'admin']}  # Limit users to doctor or admin roles
    )

    question = models.OneToOneField(
        Question,
        on_delete=models.CASCADE,
        related_name="answer",
        blank=False
    )
    response = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.response}"




