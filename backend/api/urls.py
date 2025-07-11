from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='product-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),  # For DELETE
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
]
