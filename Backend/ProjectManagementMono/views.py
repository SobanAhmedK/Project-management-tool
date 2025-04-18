from rest_framework.parsers import MultiPartParser, FormParser
import uuid
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from drf_yasg import openapi
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics, permissions, viewsets, serializers
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import Organization, OrganizationMembership, OrganizationInvite, Project, ProjectMembership,User,Task
from .permissions import IsOrganizationAdmin ,IsProjectMemberOrOrgAdmin,IsTaskEditable, IsSuperUser,    IsOrganizationAdminOrManager, IsOrgAdminOrManagerForProject, CanCommentOnTask
from .serializers import UserRegistrationSerializer, UserLoginSerializer,OrganizationSerializer , OrganizationInviteSerializer, ProjectSerializer,AddProjectMemberSerializer, OrganizationMembershipSerializer, TaskSerializer, UserProfileSerializer, ProfilePictureSerializer,NotificationSettingsSerializer, UserPreferencesSerializer, UserAdminSerializer, UserProfileSerializer, OrganizationMembershipSerializer,ProjectMembershipSerializerDisplay,CommentSerializer, Comment
from django.db.models import Q
from django.db import transaction
from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound, MethodNotAllowed




class UserAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only interface for full user management
    Permissions:
    - List/retrieve: Available to admin staff
    - Create/update/delete: Only for superusers
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, IsSuperUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Toggle user active status"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'status': 'active' if user.is_active else 'inactive'})

    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        """Admin password reset endpoint"""
        user = self.get_object()
        password = request.data.get('password')
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(password)
        user.save()
        return Response({'status': 'password set'})

    def perform_destroy(self, instance):
        """Prevent self-deletion"""
        if instance == self.request.user:
            raise serializers.ValidationError("You cannot delete your own account")
        instance.delete()
        
        
# Register View (for new users)
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny] 



# Login View (for existing users)
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny] 
    @swagger_auto_schema(
        request_body=UserLoginSerializer,  
        responses={200: 'Successful login with token', 400: 'Invalid credentials or other errors'}
    )
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate user
            user = authenticate(email=email, password=password)
            
            if user:
                if not user.is_verified:
                    user.is_verified = True
                    user.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                
                return Response({
                    'refresh': str(refresh),
                    'access': access_token
                }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()  # Fixed the .none issue
    pagination_class = None 
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the current action
        """
        if self.action == 'picture':
            return ProfilePictureSerializer
        elif self.action == 'preferences':
            return UserPreferencesSerializer
        elif self.action == 'notifications':
            return NotificationSettingsSerializer
        return UserProfileSerializer  # Default
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        """Get or update basic profile information"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'post', 'put', 'delete'], url_path='profile-picture', parser_classes=[MultiPartParser, FormParser])
    def picture(self, request):
        """Handle profile picture operations"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
            
        if request.method == 'DELETE':
            if user.profile_picture:
                user.profile_picture.delete()
                user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # POST or PUT request
        # Check if there's a file in the request
        if 'profile_picture' not in request.data or not request.data['profile_picture']:
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process the file upload
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=False  # Complete replacement of the profile picture
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Return the URL of the new profile picture
        return Response({
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) 
            if user.profile_picture else None
    })    
    @action(detail=False, methods=['get', 'patch'], url_path='notification-settings')
    def notifications(self, request):
        """Get or update notification preferences"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'patch'], url_path='user-preferences')
    def preferences(self, request):
        """Get or update user preferences"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Organization.objects.none()
        return Organization.objects.filter(memberships__user=self.request.user)

    def perform_create(self, serializer):
        org = serializer.save(created_by=self.request.user)
        # Add creator as admin
        OrganizationMembership.objects.create(
            user=self.request.user,
            organization=org,
            role='admin'
        )

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsOrganizationAdmin]
        return super().get_permissions()
    
    @swagger_auto_schema(
        operation_description="List all members of the organization. "
                              "Only organization admins or managers can access this endpoint.",
        responses={
            200: OrganizationMembershipSerializer(many=True),
            403: "Forbidden: You are not authorized to view this organization's members."
        }
    )
    @action(detail=True, methods=['get'], url_path='members')
    def members(self, request, pk=None):
        """
        List all members of the organization.
        Only organization admins or managers are allowed to list the members.
        """
        organization = get_object_or_404(Organization, pk=pk)
        # Check if the requesting user is an admin or manager in the organization.
        try:
            membership = OrganizationMembership.objects.get(
                organization=organization, user=request.user
            )
        except OrganizationMembership.DoesNotExist:
            return Response({"detail": "You are not a member of this organization."},
                            status=status.HTTP_403_FORBIDDEN)

        if membership.role not in ['admin', 'manager']:
            return Response({"detail": "Only admins or managers can list organization members."},
                            status=status.HTTP_403_FORBIDDEN)

        members = OrganizationMembership.objects.filter(organization=organization)
        serializer = OrganizationMembershipSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



# Swagger parameter for organization
organization_param = openapi.Parameter(
    name='organization',
    in_=openapi.IN_QUERY,
    description="Organization ID is required to disambiguate membership.",
    type=openapi.TYPE_INTEGER,
    required=True
)


class OrganizationMemberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing members within an organization:
    - List members filtered by `organization` query param
    - Retrieve/Update/Delete a specific membership
    - Prevents direct creation (must use invite flow)
    - Cleans up related data (project memberships, tasks) on removal
    """
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsOrganizationAdminOrManager]
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'
    http_method_names = ['get', 'put', 'patch', 'delete', 'head', 'options']  # POST is disabled

    def get_queryset(self):
        org_pk = self.request.query_params.get('organization')
        if not org_pk:
            return OrganizationMembership.objects.none()

        org = get_object_or_404(Organization, pk=org_pk)

        # Ensure the requesting user has access
        if not org.memberships.filter(user=self.request.user, role__in=['admin', 'manager']).exists():
            return OrganizationMembership.objects.none()

        return OrganizationMembership.objects.filter(organization=org).select_related('user', 'organization')

    def get_object(self):
        org_pk = self.request.query_params.get('organization')
        if not org_pk:
            raise serializers.ValidationError("Organization parameter is required to identify the membership.")

        user_id = self.kwargs.get(self.lookup_url_kwarg)
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, organization__pk=org_pk, user__id=user_id)
        self.check_object_permissions(self.request, obj)
        return obj

    @swagger_auto_schema(manual_parameters=[organization_param])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(manual_parameters=[organization_param])
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(manual_parameters=[organization_param])
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(manual_parameters=[organization_param])
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(manual_parameters=[organization_param])
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        """
        - Prevent self-removal
        - Remove project memberships in the same org
        - Nullify tasks assigned to the user within that org
        """
        if instance.user == self.request.user:
            raise serializers.ValidationError("You cannot remove yourself from the organization.")

        with transaction.atomic():
            # Remove user from project memberships
            ProjectMembership.objects.filter(
                user=instance.user,
                project__organization=instance.organization
            ).delete()

            # Clear task assignment for this user in org's projects
            Task.objects.filter(
                project__organization=instance.organization,
                assigned_to=instance.user
            ).update(assigned_to=None)

            instance.delete()

    def create(self, request, *args, **kwargs):
        raise serializers.ValidationError(
            {"detail": "New members must be added via the invitation system."},
            code=status.HTTP_405_METHOD_NOT_ALLOWED
        )





class InviteUserView(APIView):
    """
    Endpoint for an organization admin to invite a user to the organization.
    Only an admin (for that organization) can send an invite.
    """
    permission_classes = [permissions.IsAuthenticated]
    @swagger_auto_schema(request_body=OrganizationInviteSerializer)
    def post(self, request):
        serializer = OrganizationInviteSerializer(data=request.data)
        if serializer.is_valid():
            org = serializer.validated_data['organization']

            # Check that the requesting user is an admin of this organization.
            is_admin = OrganizationMembership.objects.filter(
                user=request.user,
                organization=org,
                role='admin'
            ).exists()

            if not is_admin:
                return Response({"detail": "Only organization admins can invite users."},
                                status=status.HTTP_403_FORBIDDEN)
            
            invite = serializer.save(
                invited_by=request.user,
                token=str(uuid.uuid4())
            )

            # Adjust FRONTEND_URL or INVITE_ACCEPT_URL according to your system.
            invite_url = f"/accept-invite?token={invite.token}"

            # Send email. (For testing, you might use the console email backend.)
            send_mail(
                subject="You've been invited to join an organization",
                message=(
                    f"Hello,\n\nYou have been invited to join the organization '{org.name}' "
                    f"as a {invite.role}. Please click the following link to accept the invite:\n\n"
                    f"{invite_url}\n\nThank you!"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[invite.email],
                fail_silently=False,
            )

            return Response({"detail": "Invitation sent successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AcceptInviteView(APIView):
    """
    Endpoint for an invited user to accept the organization invite.
    This endpoint expects a token via query parameters.
    The user must be authenticated.
    """
    permission_classes = [permissions.IsAuthenticated]
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('token', openapi.IN_QUERY, description="Invite token", type=openapi.TYPE_STRING)
    ])
    def get(self, request):
        token = request.query_params.get('token', None)
        if not token:
            return Response({"detail": "Invite token is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Retrieve the invitation that is not yet accepted.
            invite = OrganizationInvite.objects.get(token=token, is_accepted=False)
        except OrganizationInvite.DoesNotExist:
            return Response({"detail": "Invalid or expired invite token."}, status=status.HTTP_400_BAD_REQUEST)
        
        OrganizationMembership.objects.create(
            user=request.user,
            organization=invite.organization,
            role=invite.role
        )

        # Mark invite as accepted.
        invite.is_accepted = True
        invite.save()

        return Response({"detail": f"You have successfully joined {invite.organization.name} as {invite.role}."},
                        status=status.HTTP_200_OK)
        



class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberOrOrgAdmin]
    @swagger_auto_schema(auto_schema=None)
    def list(self, request, *args, **kwargs):
        raise MethodNotAllowed("GET", detail="Use /projects/filter_by_Organization/?organization_id=... instead.")
    
    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Organization.objects.none()
        return Project.objects.filter(
            organization__memberships__user=user
        ).distinct()

    @action(detail=False, methods=['get'], url_path='filter_by_Organization')
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('organization_id', openapi.IN_QUERY, description="ID of the organization", type=openapi.TYPE_INTEGER)
        ]
    )
    def filter_by_Organization(self, request): 
        user = request.user
        org_id = request.query_params.get('organization_id')
        if not org_id:
            return Response([], status=200)

        try:
            membership = OrganizationMembership.objects.get(user=user, organization_id=org_id)
        except OrganizationMembership.DoesNotExist:
            return Response([], status=200)
        if membership.role in ['admin', 'manager']:
            projects = Project.objects.filter(organization_id=org_id)
        else:
            projects = Project.objects.filter(organization_id=org_id, members__user=user).distinct()

        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data, status=200)

    def perform_create(self, serializer):
        org = serializer.validated_data['organization']
        membership = OrganizationMembership.objects.filter(user=self.request.user, organization=org, role__in=['admin', 'manager'])
        if not membership.exists():
            raise permissions.PermissionDenied("Only admins/managers can create projects.")
        serializer.save(created_by=self.request.user)

   
    @swagger_auto_schema(
        method='post',
        request_body=AddProjectMemberSerializer,
        responses={201: "User assigned successfully.", 400: "Bad Request"}
    )
    @action(detail=False, methods=['post'], url_path='assign-member')
    def assign_member(self, request):
        """
        Assign an organization user to a project.
        Only admins or managers can assign users.
        """
        serializer = AddProjectMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user_id']
        project_id = serializer.validated_data['project_id']


        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_400_BAD_REQUEST)

        if ProjectMembership.objects.filter(user=target_user, project=project).exists():
            return Response({"detail": "User is already assigned to this project."}, status=status.HTTP_400_BAD_REQUEST)

        if not project.organization.memberships.filter(user=target_user).exists():
            return Response({"detail": "The user is not a member of the project's organization."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            requester_membership = OrganizationMembership.objects.get(user=request.user, organization=project.organization)
        except OrganizationMembership.DoesNotExist:
            return Response({"detail": "You are not a member of this organization."}, status=status.HTTP_403_FORBIDDEN)

        if requester_membership.role not in ['admin', 'manager']:
            return Response({"detail": "Only admins or managers can assign users to projects."}, status=status.HTTP_403_FORBIDDEN)

        # 6. Assign user
        ProjectMembership.objects.create(user=target_user, project=project)
        return Response({"detail": "User assigned to project successfully."}, status=status.HTTP_201_CREATED)
    
    

# Define the Swagger query parameter globally
project_param = openapi.Parameter(
    'project_id',
    openapi.IN_QUERY,
    description="ID of the project",
    type=openapi.TYPE_INTEGER,
    required=True
)

class ProjectMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMembershipSerializerDisplay
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'delete', 'head', 'options']
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')
        if not project_id:
            return ProjectMembership.objects.none()

        project = get_object_or_404(Project, pk=project_id)

        try:
            org_membership = OrganizationMembership.objects.get(
                user=self.request.user,
                organization=project.organization
            )
        except OrganizationMembership.DoesNotExist:
            return ProjectMembership.objects.none()

        if org_membership.role in ['admin', 'manager']:
            return ProjectMembership.objects.filter(project=project).select_related('user', 'project')

        if ProjectMembership.objects.filter(user=self.request.user, project=project).exists():
            return ProjectMembership.objects.filter(project=project).select_related('user', 'project')

        return ProjectMembership.objects.none()

    @swagger_auto_schema(manual_parameters=[project_param])
    def list(self, request, *args, **kwargs):
        """
        List members of a project. Only project members can see this.
        Admins/Managers can see any project's members.
        """
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(manual_parameters=[project_param])
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific project membership by user ID and project ID.
        `project_id` must be passed as a query parameter.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    def get_object(self):
        user_id = self.kwargs['user_id']
        project_id = self.request.query_params.get('project_id')

        if not project_id:
            raise ValidationError("Project ID is required.")

        try:
            return ProjectMembership.objects.select_related('project', 'user').get(
                user__id=user_id,
                project__id=project_id
            )
        except ProjectMembership.DoesNotExist:
            raise NotFound("Membership not found.")
    
    @swagger_auto_schema(manual_parameters=[project_param])
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not IsOrgAdminOrManagerForProject().has_object_permission(request, self, instance):
            return Response(
                {"detail": "Only admins or managers can remove users from a project."},
                status=status.HTTP_403_FORBIDDEN
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        with transaction.atomic():
            Task.objects.filter(
                project=instance.project,
                assigned_to=instance.user
            ).update(assigned_to=None)
            instance.delete()

    def create(self, request, *args, **kwargs):
        raise serializers.ValidationError(
            {"detail": "Project memberships must be assigned through the assign-member endpoint."},
            code=status.HTTP_405_METHOD_NOT_ALLOWED
        )
        
        
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskEditable]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'project', 
                openapi.IN_QUERY,
                description="Filter tasks by project ID",
                type=openapi.TYPE_INTEGER
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Task.objects.none()

        user = self.request.user
        queryset = Task.objects.none() 
        
        project_id = self.request.query_params.get('project', None)
        
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                
                is_org_admin = OrganizationMembership.objects.filter(
                    user=user,
                    organization=project.organization,
                    role__in=['admin', 'manager']
                ).exists()
                
                is_project_member = ProjectMembership.objects.filter(
                    user=user,
                    project=project
                ).exists()
                
                if is_org_admin or is_project_member:
                    queryset = Task.objects.filter(project=project)
                else:
                    queryset = Task.objects.none()
                    
            except Project.DoesNotExist:
                queryset = Task.objects.none()
        else:
     
            admin_orgs = Organization.objects.filter(
                memberships__user=user,
                memberships__role__in=['admin', 'manager']
            )
            
            # Get all projects where the user is a member
            member_projects = Project.objects.filter(
                members__user=user
            )
            
            queryset = Task.objects.filter(
                Q(project__organization__in=admin_orgs) | 
                Q(project__in=member_projects)
            ).distinct()
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['status'],
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New status value for the task"
                )
            }
        ),
        responses={
            200: TaskSerializer,
            400: "Bad Request - Missing or invalid status",
            403: "Forbidden - User not assigned to task"
        }
    )
    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        """
        Custom endpoint for assigned employees to update task status.
        """
        task = self.get_object()
        
        is_admin_or_manager = OrganizationMembership.objects.filter(
        user=request.user,
        organization=task.project.organization,
        role__in=['admin', 'manager']
         ).exists()
        # Check if user is assigned to this task
        if task.assigned_to != request.user and not is_admin_or_manager:
            return Response(
                {"detail": "Only the assigned employee can update the task status."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Validate the status
        new_status = request.data.get('status')
        if not new_status:
            return Response(
                {"detail": "Status field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if new_status not in dict(Task.STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status value."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Update the status
        task.status = new_status
        task.save(update_fields=['status'])
        
        # Return the updated task
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    
# Define the query parameter for Swagger documentation.
task_param = openapi.Parameter(
    'task', openapi.IN_QUERY, 
    description="Filter comments by task id", 
    type=openapi.TYPE_INTEGER
)    
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, CanCommentOnTask]
    queryset = Comment.objects.all()
    def get_queryset(self):
        user = self.request.user

        # Get tasks where user is a project member or org admin/manager
        project_ids = user.projectmembership_set.values_list('project_id', flat=True)
        org_ids = OrganizationMembership.objects.filter(
            user=user,
            role__in=['admin', 'manager']
        ).values_list('organization_id', flat=True)

        queryset = Comment.objects.filter(
            Q(task__project__id__in=project_ids) |
            Q(task__project__organization_id__in=org_ids)
        )

        # If ?task= is passed, filter further
        task_id = self.request.query_params.get('task')
        if task_id:
            queryset = queryset.filter(task__id=task_id)

        return queryset

    def perform_create(self, serializer):
        # Automatically set the authenticated user as the commenter.
        serializer.save(commented_by=self.request.user)
        
    
    # Use swagger_auto_schema to document the GET endpoint
    @swagger_auto_schema(manual_parameters=[task_param])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)