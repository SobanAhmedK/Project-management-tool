# urls.py - Add these URLs to your app's urls.py

from django.urls import path
from  apps.notifications import views
appname = 'notifications'
urlpatterns = [
    
    path('api/notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/count/', views.notification_count, name='notification-count'),
    path('api/notifications/<int:notification_id>/read/', views.mark_notification_as_read, name='mark-notification-read'),
    path('api/notifications/read-all/', views.mark_all_notifications_as_read, name='mark-all-notifications-read'),
    path('api/notifications/<int:notification_id>/delete/', views.delete_notification, name='delete-notification'),
    path('api/notifications/clear-all/', views.clear_all_notifications, name='clear-all-notifications'),
]