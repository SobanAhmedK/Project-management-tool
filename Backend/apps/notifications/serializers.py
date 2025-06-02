# serializers.py - Add these to your existing serializers

from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    time_since = serializers.ReadOnlyField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'sender',
            'is_read', 'created_at', 'read_at', 'time_since', 'extra_data'
        ]
    
    def get_sender(self, obj):
        if obj.sender:
            return {
                'id': obj.sender.id,
                'name': obj.sender.full_name,
                'email': obj.sender.email
            }
        return {
            'id': None,
            'name': 'System',
            'email': None
        }