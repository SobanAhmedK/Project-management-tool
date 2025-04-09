from rest_framework import permissions
from .models import OrganizationMembership, ProjectMembership

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
