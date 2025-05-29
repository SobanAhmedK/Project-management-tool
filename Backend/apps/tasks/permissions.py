from rest_framework import permissions
from apps.organizations.models import OrganizationMembership
from apps.projects.models import ProjectMembership
from django.core.exceptions import PermissionDenied
from .models import Project
from apps.tasks.models import Task

# Updated Permission Class
class CanCommentOnTask(permissions.BasePermission):
    """
    Custom permission for comments:
    - Org admin/manager: Full permissions (CRUD on any comment in their org)
    - Project member (who is org employee): Can create comments on any task in their projects,
      but only edit/delete their own comments
    - Others: No permissions
    """

    def has_permission(self, request, view):
        user = request.user
        
        if not user.is_authenticated:
            return False

        # For safe methods (GET, HEAD, OPTIONS) - allow access, object-level permission will handle filtering
        if request.method in permissions.SAFE_METHODS:
            return True

        # For POST (comment creation)
        if request.method == 'POST':
            task_id = request.data.get('task')
            if not task_id:
                return False

            try:
                task = Task.objects.select_related('project__organization').get(id=task_id)
            except Task.DoesNotExist:
                return False

            organization = task.project.organization

            # Check if user is org admin/manager - can comment on any task in their org
            is_org_admin_manager = OrganizationMembership.objects.filter(
                organization=organization,
                user=user,
                role__in=['admin', 'manager']
            ).exists()
            
            if is_org_admin_manager:
                return True

            # Check if user is org employee AND project member
            try:
                org_membership = OrganizationMembership.objects.get(
                    organization=organization,
                    user=user
                )
                
                # Must be an employee (not admin/manager for this path)
                if org_membership.role == 'employee':
                    # Check if user is a member of this specific project
                    is_project_member = ProjectMembership.objects.filter(
                        project=task.project,
                        user=user
                    ).exists()
                    
                    return is_project_member
                    
            except OrganizationMembership.DoesNotExist:
                return False

        # For PUT, PATCH, DELETE - will be handled by has_object_permission
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        
        if not user.is_authenticated:
            return False

        organization = obj.task.project.organization

        # Check if user is org admin/manager - full permissions
        is_org_admin_manager = OrganizationMembership.objects.filter(
            organization=organization,
            user=user,
            role__in=['admin', 'manager']
        ).exists()
        
        if is_org_admin_manager:
            return True

        # For safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            # Check if user is org member AND project member
            try:
                org_membership = OrganizationMembership.objects.get(
                    organization=organization,
                    user=user
                )
                
                is_project_member = ProjectMembership.objects.filter(
                    project=obj.task.project,
                    user=user
                ).exists()
                
                return is_project_member
                
            except OrganizationMembership.DoesNotExist:
                return False

        # For modification methods (PUT, PATCH, DELETE)
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            # Only org employees can modify comments, and only their own
            try:
                org_membership = OrganizationMembership.objects.get(
                    organization=organization,
                    user=user
                )
                
                # Must be project member
                is_project_member = ProjectMembership.objects.filter(
                    project=obj.task.project,
                    user=user
                ).exists()
                
                # Must be the comment owner (for employees)
                if org_membership.role == 'employee':
                    is_comment_owner = obj.commented_by == user
                    return is_project_member and is_comment_owner
                
                # This shouldn't happen as admins/managers are handled above
                return False
                
            except OrganizationMembership.DoesNotExist:
                return False

        return False


class IsTaskEditable(permissions.BasePermission):
    """
    Custom permission for task management:
    - Only admins/managers can create, edit, or delete tasks
    - Anyone in the organization can view tasks
    """

    def has_permission(self, request, view):
        # Special case for the custom status update endpoint
        if view.action == 'update_status':
            return True
            
        if request.method in permissions.SAFE_METHODS:
            return True

        if view.action == 'create':
            project_id = request.data.get('project')
            if not project_id:
                return False
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return False
            try:
                membership = OrganizationMembership.objects.get(
                    user=request.user,
                    organization=project.organization
                )
            except OrganizationMembership.DoesNotExist:
                return False
            return membership.role in ['admin', 'manager']

        return True

    def has_object_permission(self, request, view, obj):
        # Special case for the custom status update endpoint
        if view.action == 'update_status':
            return True
            
        if request.method in permissions.SAFE_METHODS:
            return True

        # For regular updates and deletes, only admins/managers can do it
        try:
            membership = OrganizationMembership.objects.get(
                user=request.user,
                organization=obj.project.organization
            )
            is_admin_or_manager = membership.role in ['admin', 'manager']
        except OrganizationMembership.DoesNotExist:
            is_admin_or_manager = False

        # If updating, check the assigned_to validation for admins/managers
        if request.method in ['PUT', 'PATCH'] and is_admin_or_manager:
            new_assigned = request.data.get('assigned_to')
            if new_assigned:
                # Convert the incoming value to an integer; it might be a string.
                try:
                    new_assigned_id = int(new_assigned)
                except (ValueError, TypeError):
                    raise PermissionDenied("Invalid assigned user id.")
                # Check that the new assigned user is a member of this project.
                if not ProjectMembership.objects.filter(user_id=new_assigned_id, project=obj.project).exists():
                    raise PermissionDenied("The assigned user is not a member of the project.")

        return is_admin_or_manager
    
    
