from rest_framework import permissions
from .models import  ProjectMembership
from apps.organizations.models import OrganizationMembership


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
