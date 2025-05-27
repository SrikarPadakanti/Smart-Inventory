from django.contrib import admin  # <- This was missing
from .models import InventoryItem

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'quantity', 'price', 'last_updated')
