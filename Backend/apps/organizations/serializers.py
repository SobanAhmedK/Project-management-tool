from rest_framework import serializers
from .models import Organization, OrganizationMembership,OrganizationInvite

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']

class OrganizationInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationInvite
        fields = ['email', 'role', 'organization']



class OrganizationMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = OrganizationMembership
        fields = ['id', 'user', 'user_email', 'user_full_name', 'role', 'joined_at']

