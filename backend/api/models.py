from django.db import models
from django.utils.timezone import now

class Product(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    category = models.CharField(max_length=100, blank=True, null=True)
    
    date_added = models.DateTimeField(default=now)  # Auto-set when created

    STOCK_STATUS_CHOICES = [
        ('in_stock', 'In Stock'),
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
    ]
    stock_status = models.CharField(
        max_length=20,
        choices=STOCK_STATUS_CHOICES,
        default='in_stock',
    )

    def save(self, *args, **kwargs):
        # Automatically update stock_status based on quantity
        if self.quantity <= 0:
            self.stock_status = 'out_of_stock'
        elif self.quantity < 20:  # You can tweak this threshold
            self.stock_status = 'low_stock'
        else:
            self.stock_status = 'in_stock'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
