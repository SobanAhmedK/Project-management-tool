from rest_framework import serializers
from .models import Task, Comment


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # List all fields you want to expose via the API.
        fields = [
            'id',
            'project',
            'title',
            'description',
            'assigned_to',
            'status',
            'due_date',
            'created_at',
            'updated_at',
            'created_by',
            'priority',
            'order'
        ]
        # These fields will be read-only (set automatically)
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    

class CommentSerializer(serializers.ModelSerializer):
   
    commented_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'task',
            'commented_by',
            'comment_text',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'commented_by']