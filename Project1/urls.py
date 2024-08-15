from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('ParkingFinderApp.urls')),  # Include ParkingFinderApp URLs
    path('admin/', admin.site.urls),
]
