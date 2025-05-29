from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.users import views

router = DefaultRouter()
# User endpoints
router.register(r'user', views.UserProfileViewSet, basename='user-profile')
router.register(r'admin/users', views.UserAdminViewSet, basename='admin-users')


urlpatterns = [
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
   
] + router.urls