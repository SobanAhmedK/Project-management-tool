from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.projects import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'project-memberships', views.ProjectMembershipViewSet, basename='project-membership')

urlpatterns = [
] + router.urls