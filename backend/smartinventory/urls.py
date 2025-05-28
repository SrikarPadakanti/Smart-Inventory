from django.contrib import admin
from django.urls import path, include
from .views import home  # import the view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', home, name='home'),  # now "/" serves your home view
]
