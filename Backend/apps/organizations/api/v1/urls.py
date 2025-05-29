from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.organizations import views

router = DefaultRouter()

# Organization endpoints
router.register(r'organizations', views.OrganizationViewSet, basename='organization')
router.register(r'organization-members', views.OrganizationMemberViewSet, basename='organization-member')  # Flat route


urlpatterns = [
    path('organizations/invite/', views.InviteUserView.as_view(), name='invite-user'),
    path('organizations/invite/accept/', views.AcceptInviteView.as_view(), name='accept-invite'),
] + router.urls