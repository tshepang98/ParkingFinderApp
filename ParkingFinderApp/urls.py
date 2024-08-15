from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),  # URL pattern for rendering the HTML page with the map
    path('api/apiKeys/', views.apiKeys, name='apiKeys'),  # Endpoint for fetching API keys
]
