from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path("Parking/", include("ParkingFinderApp.urls")),
    path('admin/', admin.site.urls),
    
]
