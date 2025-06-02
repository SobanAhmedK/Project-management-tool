
from drf_yasg import openapi
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, permissions, viewsets
from rest_framework.response import Response
from .models import Task , Comment
from apps.organizations.models import Organization, OrganizationMembership
from apps.projects.models import Project, ProjectMembership
from .permissions import  IsTaskEditable,CanCommentOnTask
from .serializers import TaskSerializer,CommentSerializer
from django.db.models import Q


     
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




# Updated ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, CanCommentOnTask]
    queryset = Comment.objects.all()

    def get_queryset(self):
        # Short-circuit for schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Comment.objects.none()

        user = self.request.user

        # Short-circuit if user is not authenticated
        if not user.is_authenticated:
            return Comment.objects.none()

        # Get all organizations where user is admin/manager
        admin_org_ids = OrganizationMembership.objects.filter(
            user=user,
            role__in=['admin', 'manager']
        ).values_list('organization_id', flat=True)

        # Get all projects where user is a member AND is also an org member
        user_project_memberships = ProjectMembership.objects.filter(user=user)
        project_ids = []
        
        for membership in user_project_memberships:
            # Check if user is also an org member for this project
            if OrganizationMembership.objects.filter(
                user=user,
                organization=membership.project.organization
            ).exists():
                project_ids.append(membership.project.id)

        # Build queryset: comments from tasks in projects where user is admin/manager of org
        # OR comments from tasks in projects where user is a member
        queryset = Comment.objects.select_related(
            'task__project__organization',
            'commented_by'
        ).filter(
            Q(task__project__organization_id__in=admin_org_ids) |
            Q(task__project__id__in=project_ids)
        ).distinct()

        # Filter by task if specified
        task_id = self.request.query_params.get('task')
        if task_id:
            queryset = queryset.filter(task__id=task_id)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(commented_by=self.request.user)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'task',
                openapi.IN_QUERY,
                description="Filter comments by task ID",
                type=openapi.TYPE_INTEGER
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Override destroy to add additional logging if needed"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)

    def update(self, request, *args, **kwargs):
        """Override update to ensure task field cannot be changed"""
        instance = self.get_object()
        
        # Make a mutable copy of request.data if it's not already
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
        
        # Ensure task field matches the existing instance (prevent changing task)
        request.data['task'] = instance.task.id
        
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Override partial_update to ensure task field cannot be changed"""
        instance = self.get_object()
        
        # Make a mutable copy of request.data if it's not already
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
        
        # If task is provided, ensure it matches the existing instance
        if 'task' in request.data:
            request.data['task'] = instance.task.id
        
        return super().partial_update(request, *args, **kwargs)