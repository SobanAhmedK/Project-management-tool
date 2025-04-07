from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema

from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .serializers import UserRegistrationSerializer, UserLoginSerializer

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
