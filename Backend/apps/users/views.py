

from django.contrib.auth import authenticate
from .models import User
from rest_framework import viewsets, generics, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg.utils import swagger_auto_schema

# Custom permissions (make sure this module exists)
from .permissions import IsSuperUser

# Import serializers from the user app
from .serializers import (
    UserAdminSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    ProfilePictureSerializer,
    UserPreferencesSerializer,
    NotificationSettingsSerializer,
    UserProfileSerializer
)

class UserAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only interface for full user management
    Permissions:
    - List/retrieve: Available to admin staff
    - Create/update/delete: Only for superusers
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, IsSuperUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Toggle user active status"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'status': 'active' if user.is_active else 'inactive'})

    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        """Admin password reset endpoint"""
        user = self.get_object()
        password = request.data.get('password')
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(password)
        user.save()
        return Response({'status': 'password set'})

    def perform_destroy(self, instance):
        """Prevent self-deletion"""
        if instance == self.request.user:
            raise serializers.ValidationError("You cannot delete your own account")
        instance.delete()
        
        
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

class UserProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all() 
    pagination_class = None 
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the current action
        """
        if self.action == 'picture':
            return ProfilePictureSerializer
        elif self.action == 'preferences':
            return UserPreferencesSerializer
        elif self.action == 'notifications':
            return NotificationSettingsSerializer
        return UserProfileSerializer  
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        """Get or update basic profile information"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'post', 'put', 'delete'], url_path='profile-picture', parser_classes=[MultiPartParser, FormParser])
    def picture(self, request):
        """Handle profile picture operations"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
            
        if request.method == 'DELETE':
            if user.profile_picture:
                user.profile_picture.delete()
                user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
    
        if 'profile_picture' not in request.data or not request.data['profile_picture']:
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=False 
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) 
            if user.profile_picture else None
    })    
    @action(detail=False, methods=['get', 'patch'], url_path='notification-settings')
    def notifications(self, request):
        """Get or update notification preferences"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'patch'], url_path='user-preferences')
    def preferences(self, request):
        """Get or update user preferences"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)