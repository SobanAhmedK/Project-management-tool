from django.urls import path
from rest_framework.routers import DefaultRouter
from ProjectManagementMono import views

router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')
router.register(r'projects', views.ProjectViewSet, basename='project')

urlpatterns = [
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('organizations/invite/', views.InviteUserView.as_view(), name='invite-user'),
    path('organizations/invite/accept/', views.AcceptInviteView.as_view(), name='accept-invite'),
]

urlpatterns += router.urls

