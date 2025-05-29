from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.tasks import views

router = DefaultRouter()
# User endpoints

router.register(r'tasks', views.TaskViewSet, basename='task')
router.register(r'comments', views.CommentViewSet, basename='comment')

urlpatterns = [
   
] + router.urls