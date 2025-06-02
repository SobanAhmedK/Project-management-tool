from drf_yasg import openapi
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, permissions, viewsets, serializers
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import  Project, ProjectMembership,User
from apps.tasks.models import Task

from apps.organizations.models import Organization, OrganizationMembership
from .permissions import  IsProjectMemberOrOrgAdmin, IsOrgAdminOrManagerForProject
from .serializers import ProjectSerializer,AddProjectMemberSerializer,ProjectMembershipSerializerDisplay
from django.db import transaction
from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound, MethodNotAllowed

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
        membership = OrganizationMembership.objects.filter(
            user=self.request.user, 
            organization=org, 
            role__in=['admin', 'manager']
        )
        
        if not membership.exists():
            raise PermissionDenied("Only admins/managers can create projects.")
            
        # Save the project first
        project = serializer.save(created_by=self.request.user)
        
        # Get all admin/manager members of the organization
        admin_managers = OrganizationMembership.objects.filter(
            organization=org,
            role__in=['admin', 'manager']
        ).select_related('user')
        
        # Create project memberships for all admins/managers
        project_memberships = [
            ProjectMembership(
                user=member.user,
                project=project
            )
            for member in admin_managers
        ]
        
        # Bulk create the memberships
        ProjectMembership.objects.bulk_create(project_memberships)
        
        # Also ensure the creator is added if they weren't already an admin/manager
        if not ProjectMembership.objects.filter(user=self.request.user, project=project).exists():
            ProjectMembership.objects.create(user=self.request.user, project=project)
   
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
        