from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),  # Root URL
    path('api/keys/', views.apiKeys, name='apiKeys'),  # API keys endpoint
    path('map/', views.MapView.as_view(), name='map'),  # Map view
]
