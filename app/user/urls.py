from django.urls import path
from .views import CreateUserView, CreateTokenView, ManageUserView

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('token/', CreateTokenView.as_view(), name='create_token'),
    path('manage/', ManageUserView.as_view(), name='manage_user'),
]
