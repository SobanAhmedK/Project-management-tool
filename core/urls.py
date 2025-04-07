# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from .swagger_urls import urlpatterns as swagger_urls




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('ProjectManagementMono.api.v1.urls')), 
]

# Swagger URLs
urlpatterns += swagger_urls