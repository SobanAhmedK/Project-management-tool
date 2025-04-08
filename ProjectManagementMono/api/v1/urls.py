from django.urls import path
from rest_framework.routers import DefaultRouter
from ProjectManagementMono import views

# Create a router and register the organizations endpoint
router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')

# Define auth URLs for registration and login
urlpatterns = [
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
]

# Append the router URLs to urlpatterns
urlpatterns += router.urls

