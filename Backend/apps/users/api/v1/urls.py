from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from rest_framework.routers import DefaultRouter
from apps.users import views

router = DefaultRouter()
# User endpoints
router.register(r'user', views.UserProfileViewSet, basename='user-profile')
router.register(r'admin/users', views.UserAdminViewSet, basename='admin-users')


urlpatterns = [
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   
] + router.urls