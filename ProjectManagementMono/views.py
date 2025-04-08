from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics, permissions, viewsets
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import Organization, OrganizationMembership
from .permissions import IsOrganizationAdmin
from .serializers import UserRegistrationSerializer, UserLoginSerializer,OrganizationSerializer

# Register View (for new users)
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # 👈 This is important!



# Login View (for existing users)
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny] 
    @swagger_auto_schema(
        request_body=UserLoginSerializer,  # Use the serializer for input validation
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
        # Only show organizations user belongs to
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