from django.core.management.base import BaseCommand
from ParkingFinderApp.models import ParkingSpace
import osmium

class ParkingHandler(osmium.SimpleHandler):
    def node(self, n):
        if 'amenity' in n.tags and n.tags['amenity'] == 'p':
            print("Processing node:", n.id, "latitude:", n.location.lat, "longitude:", n.location.lon)
            id = n.id
            if not ParkingSpace.objects.filter(id=id).exists():
                print("Creating ParkingSpace object for node:", id)
                ParkingSpace.objects.create(id=id, latitude=n.location.lat, longitude=n.location.lon)

    def way(self, w):
        if 'amenity' in w.tags and w.tags['amenity'] == 'p':
            print("Processing way:", w.id, "center latitude:", w.center().lat, "center longitude:", w.center().lon)
            id = w.id
            if not ParkingSpace.objects.filter(id=id).exists():
                print("Creating ParkingSpace object for way:", id)
                ParkingSpace.objects.create(id=id, latitude=w.center().lat, longitude=w.center().lon)

        elif 'amenity' in w.tags and w.tags['amenity'] == 'p':
            for n in w.nodes:
                print("Processing way node:", n.ref, "latitude:", n.location.lat, "longitude:", n.location.lon)
                id = n.ref
                if not ParkingSpace.objects.filter(id=id).exists():
                    print("Creating ParkingSpace object for way node:", id)
                    ParkingSpace.objects.create(id=id, latitude=n.location.lat, longitude=n.location.lon)
    