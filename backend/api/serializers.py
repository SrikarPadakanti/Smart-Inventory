# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'quantity', 'category', 'date_added', 'stock_status']
        read_only_fields = ['date_added', 'stock_status']  # These are auto-managed
