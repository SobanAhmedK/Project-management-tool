# utils.py - Create this new file in your app

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
import json

class NotificationManager:
    """Utility class to handle notification creation and WebSocket broadcasting"""
    
    @staticmethod
    def create_notification(recipient, notification_type, title, message, 
                          sender=None, content_object=None, extra_data=None):
        """
        Create a notification and broadcast it via WebSocket
        """
        from .models import Notification
        
        notification_data = {
            'recipient': recipient,
            'sender': sender,
            'notification_type': notification_type,
            'title': title,
            'message': message,
            'extra_data': extra_data or {}
        }
        
        # Add content object if provided
        if content_object:
            notification_data['content_type'] = ContentType.objects.get_for_model(content_object)
            notification_data['object_id'] = content_object.pk
        
        # Create notification in database
        notification = Notification.objects.create(**notification_data)
        
        # Broadcast via WebSocket
        NotificationManager.broadcast_notification(notification)
        
        return notification
    
    @staticmethod
    def broadcast_notification(notification):
        """
        Broadcast notification to user via WebSocket
        """
        channel_layer = get_channel_layer()
        
        # Prepare notification data for WebSocket
        notification_data = {
            'type': 'notification_message',
            'notification': {
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'sender': {
                    'id': notification.sender.id if notification.sender else None,
                    'name': notification.sender.full_name if notification.sender else 'System',
                    'email': notification.sender.email if notification.sender else None
                },
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
                'time_since': notification.time_since,
                'extra_data': notification.extra_data
            }
        }
        
        # Send to user's personal channel
        group_name = f"user_{notification.recipient.id}"
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            notification_data
        )
    
    @staticmethod
    def get_unread_count(user):
        """Get unread notification count for a user"""
        from .models import Notification
        return Notification.objects.filter(recipient=user, is_read=False).count()
    
    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications as read for a user"""
        from .models import Notification
        from django.utils import timezone
        
        notifications = Notification.objects.filter(recipient=user, is_read=False)
        notifications.update(is_read=True, read_at=timezone.now())
        
        # Broadcast update to user
        channel_layer = get_channel_layer()
        group_name = f"user_{user.id}"
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'notifications_read',
                'unread_count': 0
            }
        )
    
    @staticmethod
    def mark_notification_as_read(notification_id, user):
        """Mark a specific notification as read"""
        from .models import Notification
        from django.utils import timezone
        
        try:
            notification = Notification.objects.get(id=notification_id, recipient=user)
            notification.mark_as_read()
            
            # Broadcast update to user
            channel_layer = get_channel_layer()
            group_name = f"user_{user.id}"
            
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'notification_read',
                    'notification_id': notification_id,
                    'unread_count': NotificationManager.get_unread_count(user)
                }
            )
            
            return True
        except Notification.DoesNotExist:
            return False