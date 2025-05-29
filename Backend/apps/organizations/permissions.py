from rest_framework import permissions
from .models import OrganizationMembership, Organization
from django.shortcuts import get_object_or_404


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


