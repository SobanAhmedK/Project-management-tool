# signals.py - Create this new file in your app

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from apps.tasks.models import Task, Comment
from apps.organizations.models import OrganizationInvite
from apps.users.models import User
from .models import Notification
from .utils import NotificationManager

@receiver(post_save, sender=Task)
def task_notification_handler(sender, instance, created, **kwargs):
    """Handle task-related notifications"""
    
    if created:
        # Task created/assigned notification
        if instance.assigned_to and instance.assigned_to != instance.created_by:
            NotificationManager.create_notification(
                recipient=instance.assigned_to,
                sender=instance.created_by,
                notification_type='task_assigned',
                title=f'New task assigned: {instance.title}',
                message=f'You have been assigned a new task "{instance.title}" in project {instance.project.name}',
                content_object=instance,
                extra_data={
                    'project_id': instance.project.id,
                    'project_name': instance.project.name,
                    'task_id': instance.id,
                    'priority': instance.priority,
                    'due_date': instance.due_date.isoformat() if instance.due_date else None
                }
            )
    else:
        # Check if status changed
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            if hasattr(instance, '_old_status') and instance._old_status != instance.status:
                # Notify task creator and assigned user about status change
                recipients = []
                if instance.created_by and instance.created_by != instance.assigned_to:
                    recipients.append(instance.created_by)
                if instance.assigned_to:
                    recipients.append(instance.assigned_to)
                
                for recipient in recipients:
                    NotificationManager.create_notification(
                        recipient=recipient,
                        sender=None,  # System notification
                        notification_type='task_status_changed',
                        title=f'Task status updated: {instance.title}',
                        message=f'Task "{instance.title}" status changed to {instance.get_status_display()}',
                        content_object=instance,
                        extra_data={
                            'project_id': instance.project.id,
                            'project_name': instance.project.name,
                            'task_id': instance.id,
                            'old_status': instance._old_status,
                            'new_status': instance.status
                        }
                    )
        except Task.DoesNotExist:
            pass

@receiver(pre_save, sender=Task)
def store_old_task_status(sender, instance, **kwargs):
    """Store old status before saving to detect changes"""
    if instance.pk:
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Task.DoesNotExist:
            pass

@receiver(post_save, sender=Comment)
def comment_notification_handler(sender, instance, created, **kwargs):
    """Handle comment notifications"""
    
    if created:
        # Notify task assignee and creator about new comment
        recipients = set()
        
        if instance.task.assigned_to and instance.task.assigned_to != instance.commented_by:
            recipients.add(instance.task.assigned_to)
        
        if instance.task.created_by and instance.task.created_by != instance.commented_by:
            recipients.add(instance.task.created_by)
        
        # Also notify other commenters (excluding the current commenter)
        other_commenters = Comment.objects.filter(
            task=instance.task
        ).exclude(
            commented_by=instance.commented_by
        ).values_list('commented_by', flat=True).distinct()
        
        for commenter_id in other_commenters:
            try:
                recipients.add(User.objects.get(id=commenter_id))
            except User.DoesNotExist:
                continue
        
        for recipient in recipients:
            NotificationManager.create_notification(
                recipient=recipient,
                sender=instance.commented_by,
                notification_type='task_comment',
                title=f'New comment on: {instance.task.title}',
                message=f'{instance.commented_by.full_name} commented on task "{instance.task.title}"',
                content_object=instance.task,
                extra_data={
                    'project_id': instance.task.project.id,
                    'project_name': instance.task.project.name,
                    'task_id': instance.task.id,
                    'comment_id': instance.id,
                    'comment_preview': instance.comment_text[:100] + ('...' if len(instance.comment_text) > 100 else '')
                }
            )

@receiver(post_save, sender=OrganizationInvite)
def organization_invite_notification_handler(sender, instance, created, **kwargs):
    """Handle organization invite notifications"""
    
    if created:
        # Try to find user with this email to send notification
        try:
            recipient = User.objects.get(email=instance.email)
            
            NotificationManager.create_notification(
                recipient=recipient,
                sender=instance.invited_by,
                notification_type='organization_invite',
                title=f'Organization invitation: {instance.organization.name}',
                message=f'{instance.invited_by.full_name} invited you to join {instance.organization.name} as {instance.get_role_display()}',
                content_object=instance,
                extra_data={
                    'organization_id': instance.organization.id,
                    'organization_name': instance.organization.name,
                    'role': instance.role,
                    'invite_token': instance.token
                }
            )
        except User.DoesNotExist:
            # User doesn't exist yet, notification will be created when they register
            pass