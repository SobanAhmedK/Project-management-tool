# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from .swagger_urls import urlpatterns as swagger_urls
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('ProjectManagementMono.api.v1.urls')), 
]

# Swagger URLs
urlpatterns += swagger_urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)