from django.test import TestCase
from ParkingFinderApp.models import ParkingSpace

class ParkingSpaceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        ParkingSpace.objects.create(id=1, latitude=40.7128, longitude=-74.0060)

    def test_latitude_label(self):
        parking_space = ParkingSpace.objects.get(id=1)
        field_label = parking_space._meta.get_field('latitude').verbose_name
        self.assertEquals(field_label, 'latitude')

    def test_longitude_label(self):
        parking_space = ParkingSpace.objects.get(id=1)
        field_label = parking_space._meta.get_field('longitude').verbose_name
        self.assertEquals(field_label, 'longitude')

    def test_object_name_is_id(self):
        parking_space = ParkingSpace.objects.get(id=1)
        expected_object_name = f'ParkingSpace {parking_space.id}'
        self.assertEquals(expected_object_name, str(parking_space))
