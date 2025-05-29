# from django.contrib.auth.models import AbstractUser
# from django.db import models
# from django.contrib.auth.models import BaseUserManager
# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, full_name=None, **extra_fields):
#         if z email:
#             raise ValueError('The Email field must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, full_name=full_name, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user 
    
#     def create_superuser(self, email, password=None, full_name=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, password, full_name, **extra_fields)

# class User(AbstractUser):
#     username = None  # Remove username
#     email = models.EmailField(unique=True)
#     full_name = models.CharField(max_length=255)
#     is_verified = models.BooleanField(default=False)
    
#     # Profile fields
#     profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
#     bio = models.TextField(blank=True)
#     job_title = models.CharField(max_length=255, blank=True)
#     phone_number = models.CharField(max_length=20, blank=True)
    
#     # Preferences
#     time_zone = models.CharField(max_length=50, default='UTC')
#     date_format = models.CharField(max_length=20, default='YYYY-MM-DD')
    
#     # Notification settings
#     email_notifications = models.BooleanField(default=True)
#     task_assignments_notifications = models.BooleanField(default=True)
#     status_change_notifications = models.BooleanField(default=True)
    
#     # Last activity tracking
#     last_active = models.DateTimeField(null=True, blank=True)
    
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['full_name']  
    
#     objects = CustomUserManager()

#     def __str__(self):
#         return self.email
    
#     class Meta:
#         ordering = ['full_name']
        
        
        
        
        
# class Organization(models.Model):
#     name = models.CharField(max_length=255)
#     created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_organizations')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name


# class OrganizationMembership(models.Model):
#     ROLE_CHOICES = (
#         ('admin', 'Admin'),
#         ('manager', 'Manager'),
#         ('employee', 'Employee'),
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='memberships')
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES)
#     joined_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'organization')
        
        
# class Project(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
#     created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

# class ProjectMembership(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='members')

#     class Meta:
#         unique_together = ('user', 'project')
        
# class OrganizationInvite(models.Model):
#     email = models.EmailField()
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='invites')
#     invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     role = models.CharField(max_length=20, choices=OrganizationMembership.ROLE_CHOICES)
#     token = models.CharField(max_length=100, unique=True)
#     is_accepted = models.BooleanField(default=False)
#     invited_at = models.DateTimeField(auto_now_add=True)

        
# class Task(models.Model):
#     STATUS_CHOICES = (
#         ('pending', 'Pending'),
#         ('in_progress', 'In Progress'),
#         ('completed', 'Completed'),
#     )

#     PRIORITY_CHOICES = (
#         ('low', 'Low'),
#         ('medium', 'Medium'),
#         ('high', 'High'),
#     )

#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
#     title = models.CharField(max_length=255)
#     description = models.TextField(blank=True)
#     assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     due_date = models.DateField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     created_by = models.ForeignKey(
#         User, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True, 
#         related_name='created_tasks'
#     )
#     priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
#     order = models.PositiveIntegerField(default=0)




# class Comment(models.Model):
#     task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
#     commented_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
#     comment_text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

# class VideoCall(models.Model):
#     room_id = models.CharField(max_length=100, unique=True)
#     created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#     participants = models.ManyToManyField(User, related_name='video_calls')
#     started_at = models.DateTimeField(auto_now_add=True)
#     ended_at = models.DateTimeField(null=True, blank=True)


# class ChatRoom(models.Model):
#     organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='chat_rooms')
#     name = models.CharField(max_length=255)
#     participants = models.ManyToManyField(User, related_name='chat_rooms')
#     created_at = models.DateTimeField(auto_now_add=True)


# class ChatMessage(models.Model):
#     room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
#     sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)
