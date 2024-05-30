#views.py

from django.http import JsonResponse
from django.shortcuts import render

def index(request):
 
    return render(request, "ParkingFinderApp/Map.html")

def apiKeys(request):
    data = {
        'hereKey': 'jSdL5KqY7mp6AHbJa0B-AkkfYDjcVIF-PhywwW2YdNs',
        'awsKey': 'v1.public.eyJqdGkiOiJlMTkyMzVkNC01NzIwLTRkNmYtYTI3ZC00OTI2MTVhYjc0ODAifbEbykI4qZvrZz_Xc2Br10tfZzBYwpKWcA4eEyFXNO5fxQ-zRL8E4yq12h0dEqieagY73Ktj6pBZYc07Hiu_ndStV4zHhAFAa8EiDKv4Asfz255TDG8duZ2Utt3855sS2Vq5AVmjDI7F2AWN0gr0n-69DeL4MTeMrWfA4dSDH35gu0GSzl2pxbAqIR0rn2NAJ94J4QzqTycpR54aEhHXxUL5j9nGtwwQ4pyiA0_9jlsSk6KQ4QxSggxYwZDzmbXRxkDCA2y2yJKLVTWtGinB8dB1kSVfrAT80oHKxQh2V8U_o-55oJeoviBzgJbtkf6Xi2w50ndWOMWonMPSO2X8-rk.N2IyNTQ2ODQtOWE1YS00MmI2LTkyOTItMGJlNGMxODU1Mzc2',
    }
    
    return JsonResponse(data)