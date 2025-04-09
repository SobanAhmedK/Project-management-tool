    
import uuid
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from drf_yasg import openapi
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics, permissions, viewsets
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import Organization, OrganizationMembership, OrganizationInvite, Project, ProjectMembership
from .permissions import IsOrganizationAdmin ,IsProjectMemberOrOrgAdmin
from .serializers import UserRegistrationSerializer, UserLoginSerializer,OrganizationSerializer , OrganizationInviteSerializer, ProjectSerializer

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



class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
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
            
            # Create OrganizationInvite with a unique token.
            invite = serializer.save(
                invited_by=request.user,
                token=str(uuid.uuid4())
            )

            # Build the invite acceptance URL.
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
        
        # Create organization membership for the current user if not already present.
        # This assumes that the user who accepted is the one who was invited.
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

    def get_queryset(self):
        user = self.request.user
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
