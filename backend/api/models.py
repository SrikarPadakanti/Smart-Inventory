# models.py
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    category = models.CharField(max_length=100, blank=True, null=True)  # New field

    def __str__(self):
        return self.name
