from rest_framework import permissions
from .models import OrganizationMembership

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
