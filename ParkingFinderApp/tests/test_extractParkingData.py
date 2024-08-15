from django.test import TestCase
from unittest.mock import patch
from ParkingFinderApp.models import ParkingSpace
from ParkingFinderApp.management.commands.extractParkingData import ParkingHandler

class ExtractParkingDataTest(TestCase):
    @patch('ParkingFinderApp.management.commands.extractParkingData.ParkingHandler')
    def test_extract_parking_data(self, mock_parking_handler):
        mock_handler_instance = mock_parking_handler.return_value

        # Mock node data
        mock_node = type('MockNode', (object,), {'id': 1, 'tags': {'amenity': 'p'}, 'location': type('MockLocation', (object,), {'lat': 40.7128, 'lon': -74.0060})})()
        mock_handler_instance.node.return_value = mock_node

        # Mock way data
        mock_way = type('MockWay', (object,), {'id': 2, 'tags': {'amenity': 'p'}, 'center': lambda self: type('MockLocation', (object,), {'lat': 40.7128, 'lon': -74.0060})})()
        mock_handler_instance.way.return_value = mock_way

        # Call the command
        command = ParkingHandler()
        command.node(mock_node)
        command.way(mock_way)

        # Check if ParkingSpace objects are created
        self.assertTrue(ParkingSpace.objects.filter(id=1, latitude=40.7128, longitude=-74.0060).exists())
        self.assertTrue(ParkingSpace.objects.filter(id=2, latitude=40.7128, longitude=-74.0060).exists())
