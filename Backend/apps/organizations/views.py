import uuid
from django.core.mail import send_mail
from django.conf import settings
from drf_yasg import openapi
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, permissions, viewsets, serializers
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Organization, OrganizationMembership, OrganizationInvite
from apps.projects.models import ProjectMembership
from apps.tasks.models import Task
from .permissions import IsOrganizationAdmin , IsOrganizationAdminOrManager
from .serializers import OrganizationSerializer , OrganizationInviteSerializer,OrganizationMembershipSerializer
from django.db import transaction


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

            invite_url = f"/accept-invite?token={invite.token}"
            print(invite_url)  # For debugging purposes

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
        


