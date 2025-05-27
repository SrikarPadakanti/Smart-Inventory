from django.db import models

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)  # Stock Keeping Unit
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"
