# inventory/views.py

from django.http import HttpResponse

def home(request):
    return HttpResponse("SmartInventory is up and running!")