from django.shortcuts import render

def home(request):
    return render(request, 'home.html')  # this looks for 'home.html' in templates
