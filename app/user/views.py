from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.models import User
from .serializers import UserSerializer

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_users(request):
    if request.user.role != 'admin':
        return Response({"error": "You do not have permission to manage users."}, status=403)

    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    # Handle POST, PUT, DELETE for user management (not implemented in this example)
