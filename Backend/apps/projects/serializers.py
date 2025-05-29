from rest_framework import serializers
from .models import   Project, ProjectMembership
from apps.organizations.models import OrganizationMembership



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'organization', 'created_by']

class ProjectMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembership
        fields = ['id', 'user', 'project']
        
    
class AddProjectMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    project_id = serializers.IntegerField()
    


class ProjectMembershipSerializerDisplay(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.SerializerMethodField()

    class Meta:
        model = ProjectMembership
        fields = ['id', 'user', 'project', 'full_name', 'email', 'role']
        read_only_fields = ['id', 'user', 'project', 'full_name', 'email', 'role']

    def get_role(self, obj):
        try:
            org_membership = OrganizationMembership.objects.get(
                user=obj.user,
                organization=obj.project.organization
            )
            return org_membership.role
        except OrganizationMembership.DoesNotExist:
            return None