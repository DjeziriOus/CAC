"""
Views for user APIs.
"""
from rest_framework import generics, authentication, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from core.models import User
from user.serializers import UserSerializer
from rest_framework import generics, authentication, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.exceptions import PermissionDenied

from .serializers import UserSerializer, AuthTokenSerializer


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system."""
    serializer_class = UserSerializer
    authentication_classes = []  # Allow unauthenticated users to create accounts
    permission_classes = [permissions.AllowAny]  # Publicly accessible

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for user."""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES



class ManageUserView(generics.GenericAPIView):
    """Manage the authenticated user and allow admins to list all users."""
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return all users if the authenticated user is an admin."""
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    def get(self, request, *args, **kwargs):
        """Retrieve the authenticated user or list all users if admin."""
        if self.request.user.role == 'admin':
            queryset = User.objects.all()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # For non-admin users
        serializer = self.get_serializer(self.request.user)
        return Response(serializer.data)


    def patch(self, request, *args, **kwargs):
        """Allow users to update their details except for email."""
        if 'email' in request.data:
            raise PermissionDenied("You cannot update the email address.")

        serializer = self.get_serializer(self.request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Ensure the save method is called
        return Response(serializer.data)


