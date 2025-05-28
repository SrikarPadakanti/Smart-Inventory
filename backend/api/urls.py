from django.urls import path
from . import views
from .views import ProductListAPIView

urlpatterns = [
    #path('', views.api_root, name='api-root'),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
]
