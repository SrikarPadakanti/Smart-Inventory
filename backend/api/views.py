from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "API Root works 💥"})
