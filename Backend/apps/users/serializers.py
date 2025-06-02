from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'full_name',
            'profile_picture',
            'is_active',
            'is_staff',
            'is_superuser',
            'is_verified',
            'last_active',
            'date_joined',
            'last_login'
        ]
        read_only_fields = [
            'id',
            'last_active',
            'date_joined',
            'last_login'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """Handle user creation with password properly"""
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'full_name', 'tokens']
        extra_kwargs = {'password': {'write_only': True}}

    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', '')
        )
        return user



class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'full_name',
            'bio',
            'job_title',
            'phone_number',
            'last_active'
        ]
        read_only_fields = ['email', 'last_active']

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_picture']
        
    def validate_profile_picture(self, value):
        # Add validation for image size/type if needed
        return value

class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email_notifications',
            'task_assignments_notifications',
            'status_change_notifications'
        ]

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'time_zone',
            'date_format'
        ]
