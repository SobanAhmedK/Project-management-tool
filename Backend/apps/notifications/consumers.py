
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications
    Now relies on JWT middleware for authentication
    """
    
    async def connect(self):
        # User is now set by JWT middleware
        self.user = self.scope.get("user")
        
        if self.user and not isinstance(self.user, AnonymousUser):
            # Join user-specific group
            self.group_name = f"user_{self.user.id}"
            
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            
            await self.accept()
            
            # Send initial data
            await self.send_initial_data()
        else:
            # Reject connection for unauthenticated users
            await self.close(code=4001)
    
    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_as_read':
                notification_id = data.get('notification_id')
                if notification_id:
                    result = await self.mark_notification_as_read(notification_id)
                    if result:
                        await self.send_unread_count_update()
            
            elif action == 'mark_all_as_read':
                await self.mark_all_notifications_as_read()
                await self.send_unread_count_update()
            
            elif action == 'get_notifications':
                page = data.get('page', 1)
                await self.send_notifications(page)
            
            elif action == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Internal error occurred'
            }))
    
    # Message handlers for group sends
    async def notification_message(self, event):
        """Handle new notification message"""
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['notification']
        }))
    
    async def notifications_read(self, event):
        """Handle all notifications marked as read"""
        await self.send(text_data=json.dumps({
            'type': 'notifications_read',
            'unread_count': event['unread_count']
        }))
    
    async def notification_read(self, event):
        """Handle single notification marked as read"""
        await self.send(text_data=json.dumps({
            'type': 'notification_read',
            'notification_id': event['notification_id'],
            'unread_count': event['unread_count']
        }))
    
    # Database operations
    @database_sync_to_async
    def get_initial_data(self):
        """Get initial notification data for user"""
        from .models import Notification
        from .utils import NotificationManager
        
        unread_count = NotificationManager.get_unread_count(self.user)
        
        # Get recent notifications (last 20)
        notifications = Notification.objects.filter(
            recipient=self.user
        ).select_related('sender').order_by('-created_at')[:20]
        
        notifications_data = []
        for notification in notifications:
            notifications_data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'sender': {
                    'id': notification.sender.id if notification.sender else None,
                    'name': getattr(notification.sender, 'full_name', 'System') if notification.sender else 'System',
                    'email': notification.sender.email if notification.sender else None
                },
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
                'time_since': getattr(notification, 'time_since', ''),
                'extra_data': notification.extra_data
            })
        
        return {
            'unread_count': unread_count,
            'notifications': notifications_data
        }
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """Mark a specific notification as read"""
        from .utils import NotificationManager
        return NotificationManager.mark_notification_as_read(notification_id, self.user)
    
    @database_sync_to_async
    def mark_all_notifications_as_read(self):
        """Mark all notifications as read"""
        from .utils import NotificationManager
        NotificationManager.mark_all_as_read(self.user)
    
    @database_sync_to_async
    def get_notifications_page(self, page=1, per_page=20):
        """Get paginated notifications"""
        from .models import Notification
        
        offset = (page - 1) * per_page
        notifications = Notification.objects.filter(
            recipient=self.user
        ).select_related('sender').order_by('-created_at')[offset:offset + per_page]
        
        notifications_data = []
        for notification in notifications:
            notifications_data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'sender': {
                    'id': notification.sender.id if notification.sender else None,
                    'name': getattr(notification.sender, 'full_name', 'System') if notification.sender else 'System',
                    'email': notification.sender.email if notification.sender else None
                },
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
                'time_since': getattr(notification, 'time_since', ''),
                'extra_data': notification.extra_data
            })
        
        return notifications_data
    
    @database_sync_to_async
    def get_unread_count(self):
        """Get current unread count"""
        from .utils import NotificationManager
        return NotificationManager.get_unread_count(self.user)
    
    async def send_initial_data(self):
        """Send initial notification data to client"""
        data = await self.get_initial_data()
        await self.send(text_data=json.dumps({
            'type': 'initial_data',
            'unread_count': data['unread_count'],
            'notifications': data['notifications']
        }))
    
    async def send_notifications(self, page=1):
        """Send paginated notifications"""
        notifications = await self.get_notifications_page(page)
        await self.send(text_data=json.dumps({
            'type': 'notifications_page',
            'page': page,
            'notifications': notifications
        }))
    
    async def send_unread_count_update(self):
        """Send updated unread count"""
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count_update',
            'unread_count': unread_count
        }))

