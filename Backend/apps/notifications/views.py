# views.py - Add these views to your existing views

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Notification
from .serializers import NotificationSerializer
from .utils import NotificationManager

class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationPagination
    
    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('sender').order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(
            id=notification_id, 
            recipient=request.user
        )
        notification.mark_as_read()
        
        return Response({
            'success': True,
            'message': 'Notification marked as read',
            'unread_count': NotificationManager.get_unread_count(request.user)
        })
    except Notification.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Notification not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request):
    """Mark all notifications as read"""
    NotificationManager.mark_all_as_read(request.user)
    
    return Response({
        'success': True,
        'message': 'All notifications marked as read',
        'unread_count': 0
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_count(request):
    """Get unread notification count"""
    unread_count = NotificationManager.get_unread_count(request.user)
    
    return Response({
        'unread_count': unread_count
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    """Delete a specific notification"""
    try:
        notification = Notification.objects.get(
            id=notification_id, 
            recipient=request.user
        )
        notification.delete()
        
        return Response({
            'success': True,
            'message': 'Notification deleted',
            'unread_count': NotificationManager.get_unread_count(request.user)
        })
    except Notification.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Notification not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_all_notifications(request):
    """Delete all notifications for user"""
    Notification.objects.filter(recipient=request.user).delete()
    
    return Response({
        'success': True,
        'message': 'All notifications cleared'
    })