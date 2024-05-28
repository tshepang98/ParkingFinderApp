from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),  # URL pattern for rendering the HTML page with the map
    path('api/parking_spaces/', views.parking_spaces_api, name='parking_spaces_api')
]
