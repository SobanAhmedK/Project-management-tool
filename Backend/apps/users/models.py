from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user 
    
    def create_superuser(self, email, password=None, full_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, full_name, **extra_fields)

class User(AbstractUser):
    username = None  # Remove username
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    
    # Profile fields
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Preferences
    time_zone = models.CharField(max_length=50, default='UTC')
    date_format = models.CharField(max_length=20, default='YYYY-MM-DD')
    
    # Notification settings
    email_notifications = models.BooleanField(default=True)
    task_assignments_notifications = models.BooleanField(default=True)
    status_change_notifications = models.BooleanField(default=True)
    
    # Last activity tracking
    last_active = models.DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']  
    
    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    class Meta:
        ordering = ['full_name']
        
        
        