# inventory/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Add your app URL patterns here, example:
    path('', views.home, name='home'),
]
