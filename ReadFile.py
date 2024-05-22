import osmium

class ParkingHandler(osmium.SimpleHandler):
    def __init__(self):
        super(ParkingHandler, self).__init__()
        self.parking_spaces = []

    def node(self, n):
        if 'amenity' in n.tags and n.tags['amenity'] == 'parking':
            self.parking_spaces.append({
                'id': n.id,
                'lat': n.location.lat,
                'lon': n.location.lon
            })

    def way(self, w):
        if 'amenity' in w.tags and w.tags['amenity'] == 'parking':
            self.parking_spaces.append({
                'id': w.id,
                'lat': w.center().lat,
                'lon': w.center().lon
            })

    def relation(self, r):
        # Handle relations if parking areas are represented as relations
        pass

# Instantiate the ParkingHandler
parking_handler = ParkingHandler()

# Apply the handler to the OSM file
osm_file = "latest-africa.osm.pbf"
parking_handler.apply_file(osm_file)

# Access the extracted parking spaces
parking_spaces = parking_handler.parking_spaces

# Now you can use the parking_spaces list in your ParkingFinder application
print("Found", len(parking_spaces), "parking spaces.")
