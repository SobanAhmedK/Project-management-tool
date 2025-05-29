# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from .swagger_urls import urlpatterns as swagger_urls
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/v1/', include([
        path('', include('apps.users.api.v1.urls')),
        path('', include('apps.organizations.api.v1.urls')),
        path('', include('apps.projects.api.v1.urls')),
        path('', include('apps.tasks.api.v1.urls')),
        # path('', include('apps.communications.api.v1.urls')), 
        path('', include('apps.notifications.api.v1.urls')), 
    ])),
]
urlpatterns += swagger_urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)