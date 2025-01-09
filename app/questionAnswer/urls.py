from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from questionAnswer import views

router = DefaultRouter()
router.register('question',views.QuestionViewSet)
router.register('answer',views.AnswerViewSet)

app_name = 'questionAnswer'

urlpatterns = [
    path('', include(router.urls)),
]