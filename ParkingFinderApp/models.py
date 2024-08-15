from django.db import models

class ParkingSpace(models.Model):
    id = models.BigIntegerField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"ParkingSpace {self.id}"
