from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ParkingFinderApp.views import parking_spaces_api,index

class TestUrls(SimpleTestCase):
    def test_parking_url(self):
        url = reverse('parking_spaces_api')
        self.assertEquals(resolve(url).func, parking_spaces_api)

    def test_index_url(self):
        url = reverse('index')
        self.assertEquals(resolve(url).func,index)

