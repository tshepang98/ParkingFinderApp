from django.test import TestCase
from django.urls import reverse
from ParkingFinderApp.models import ParkingSpace

class TestViews(TestCase):
    def setUp(self):
        self.parking_space1 = ParkingSpace.objects.create(id=1, latitude=1.0, longitude=2.0)
        self.parking_space2 = ParkingSpace.objects.create(id=2, latitude=3.0, longitude=4.0)

    def test_index_view(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'ParkingFinderApp/Map.html')

    def test_parking_spaces_api(self):
        response = self.client.get(reverse('parking_spaces_api'))
        self.assertEqual(response.status_code, 200)
        
        actual_data = response.json()
        for item in actual_data:
            self.assertIn('id', item)  # Check if 'id' key exists
        
        actual_data.sort(key=lambda x: x.get('id', 0))  # Sort based on 'id' key
        
        expected_data = [
            {'id': 1, 'latitude': 1.0, 'longitude': 2.0},
            {'id': 2, 'latitude': 3.0, 'longitude': 4.0}
        ]
        self.assertListEqual(actual_data, expected_data)
