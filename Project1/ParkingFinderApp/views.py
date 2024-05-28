#views.py

from django.http import JsonResponse
from django.shortcuts import render
from .models import ParkingSpace

def index(request):
    """
    Renders the HTML page with the map.
    """
    return render(request, "ParkingFinderApp/Map.html")

def parking_spaces_api(request):
    """
    Returns JSON data for all parking spaces.
    """
    # Retrieve all parking spaces from the database
    parking_spaces = ParkingSpace.objects.all()
    
    # Serialize the parking spaces data
    data = [
        {   
            'id': parking_space.id, 
            'latitude': parking_space.latitude,
            'longitude': parking_space.longitude,
        }
        for parking_space in parking_spaces
    ]
    
    # Return the serialized data as JSON response
    return JsonResponse(data, safe=False)
