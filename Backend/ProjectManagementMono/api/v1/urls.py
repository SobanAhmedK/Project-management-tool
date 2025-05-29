# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from ProjectManagementMono import views

# router = DefaultRouter()
# # User endpoints
# router.register(r'user', views.UserProfileViewSet, basename='user-profile')
# router.register(r'admin/users', views.UserAdminViewSet, basename='admin-users')

# # Organization endpoints
# router.register(r'organizations', views.OrganizationViewSet, basename='organization')
# router.register(r'organization-members', views.OrganizationMemberViewSet, basename='organization-member')  # Flat route

# # Project endpoints
# router.register(r'projects', views.ProjectViewSet, basename='project')
# router.register(r'project-memberships', views.ProjectMembershipViewSet, basename='project-membership')
# router.register(r'tasks', views.TaskViewSet, basename='task')
# router.register(r'comments', views.CommentViewSet, basename='comment')

# urlpatterns = [
#     path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
#     path('auth/login/', views.UserLoginView.as_view(), name='login'),
#     path('organizations/invite/', views.InviteUserView.as_view(), name='invite-user'),
#     path('organizations/invite/accept/', views.AcceptInviteView.as_view(), name='accept-invite'),
# ] + router.urls