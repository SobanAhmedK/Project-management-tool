from rest_framework import permissions
from .models import OrganizationMembership, ProjectMembership
from django.core.exceptions import PermissionDenied
from .models import Project, Task,Organization
from .serializers import TaskSerializer
from django.shortcuts import get_object_or_404


class IsSuperUser(permissions.BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class IsOrganizationAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            membership = OrganizationMembership.objects.get(
                user=request.user,
                organization=obj
            )
            return membership.role == 'admin'
        except OrganizationMembership.DoesNotExist:
            return False



class IsOrgAdminOrManagerForProject(permissions.BasePermission):
    """
    Permission to allow only admin/manager of the organization to remove project members.
    """

    def has_object_permission(self, request, view, obj):
        # Object here is a ProjectMembership
        project = obj.project
        try:
            membership = OrganizationMembership.objects.get(user=request.user, organization=project.organization)
            return membership.role in ['admin', 'manager']
        except OrganizationMembership.DoesNotExist:
            return False

class IsProjectMemberOrOrgAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin or manager access to the organization
        try:
            membership = OrganizationMembership.objects.get(user=request.user, organization=obj.organization)
            if membership.role in ['admin', 'manager']:
                return True
        except OrganizationMembership.DoesNotExist:
            return False

        # Employees must be members of the specific project
        return ProjectMembership.objects.filter(user=request.user, project=obj).exists()

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
    
    

class IsOrganizationAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # For list actions, expect organization info via kwargs or query parameters
        if view.action == 'list':
            org_pk = view.kwargs.get('organization_pk') or request.query_params.get('organization')
            if not org_pk:
                return False  # Deny if organization identifier is missing
            org = get_object_or_404(Organization, pk=org_pk)
            membership = org.memberships.filter(user=request.user).first()
            return bool(membership and membership.role in ['admin', 'manager'])
        
        # For create, update or delete, we allow the request to proceed and
        # rely on object-level permissions for finer control.
        return True

    def has_object_permission(self, request, view, obj):
        # Here, obj is an OrganizationMembership instance.
        # Check the requester’s membership in the organization associated with the object.
        membership = obj.organization.memberships.filter(user=request.user).first()
        if not membership:
            return False

        # For retrieve action, both admin and manager can view the details.
        if view.action == 'retrieve':
            return membership.role in ['admin', 'manager']
        
        # For update and delete actions, only the admin is allowed.
        if view.action in ['update', 'partial_update', 'destroy']:
            return membership.role == 'admin'
        
        # Deny for any other case.
        return False
