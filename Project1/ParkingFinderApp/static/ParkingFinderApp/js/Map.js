document.addEventListener("DOMContentLoaded", async function() {
  let awsKey;
  let hereKey;
  
  alert("Only available in cape town")
  //fetch the api key from back-end for security
  try {

      const response = await fetch("api/apiKeys/");
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      awsKey = data.awsKey;
      hereKey = data.hereKey;

  } catch (error) {
      console.error('Error fetching the API keys:', error);
  }

  const region = "eu-north-1";
  let map;
  let userLocation = { latitude: 0, longitude: 0 };
  let shortestDistance = Infinity;
  let nearestParkingSpace = null;

  // Function to set up the map
  const setupMap = () => {
    const mapName = "Here-explore";
    map = new maplibregl.Map({
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${awsKey}`,
      zoom: 2,
      container: 'map'
    });

    // Add navigation controls
    const navControl = new maplibregl.NavigationControl();
    map.addControl(navControl, 'top-right');

    // Add Geolocation Control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true

    });

    // Listen for geolocate control events
    // Set the userLocation to their actual values
    geolocate.once('geolocate', (e) => {
      userLocation.latitude = e.coords.latitude;
      userLocation.longitude = e.coords.longitude;

      // Fetch parking data
      map.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 15 });
      fetchParkingSpaces();
    });
    geolocate.on('error', (error) => {
      console.error('Geolocation error:', error.message);
      // Handle errors here, such as displaying a message to the user
    });

    map.addControl(geolocate, 'top-right');
  };

  // Function to display autocomplete suggestions
  const displayAutocompleteSuggestions = (data) => {
    const autocompleteContainer = document.getElementById("autocomplete");
    autocompleteContainer.innerHTML = "";

    if (data && data.items && data.items.length > 0) {
      data.items.forEach(item => {
        const suggestion = document.createElement('div');
        suggestion.textContent = item.title;
        suggestion.className = 'autocomplete-item';
        suggestion.addEventListener('click', () => {
          document.getElementById("searchInput").value = item.title;
          autocompleteContainer.innerHTML = "";
        });
        autocompleteContainer.appendChild(suggestion);
      });
    } else {
      console.error('No autocomplete suggestions found.');
    }
  };

  // Function to fetch data based on search query
  const searchLocation = async () => {


    const searchInput = document.getElementById("searchInput").value.trim();
    if (!searchInput) {
      console.error('Search input is empty');
      return;
    }
    const urlAutosuggest = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchInput}&apiKey=${hereKey}`;

    try {
      const response = await fetch(urlAutosuggest);
      const data = await response.json();
      displayAutocompleteSuggestions(data);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);
    }
  };

  // Function to display geolocation on the map
  const displayGeoLocation = async () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (!searchInput) {
      console.error('Search input is empty');
      return;
    }

    const urlGeocode = `https://geocode.search.hereapi.com/v1/geocode?q=${searchInput}&apiKey=${hereKey}`;

    try {
      const response = await fetch(urlGeocode);
      const data = await response.json();
      const location = data.items[0];
      const coordinates = location.position;

      // Set the user location to their actual values
      userLocation = {
        longitude: location.position.lng,
        latitude: location.position.lat
      }
      // Fly to the location on the map
      map.flyTo({ center: [coordinates.lng, coordinates.lat], zoom: 18 });

      // Add user marker
      addUserMarker(coordinates);

      // Fetch parking spaces data after finding user location
      fetchParkingSpaces();
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
    }
  };

  // Function to add user marker to the map
  const addUserMarker = (coordinates) => {
    // Remove existing user marker if any
    if (map.getSource('user-marker')) {
      map.removeSource('user-marker');
      map.removeLayer('user-marker');
    }

    // Add user marker
    map.addSource('user-marker', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        }
      }
    });

    map.addLayer({
      id: 'user-marker',
      type: 'circle',
      source: 'user-marker',
      paint: {
        'circle-color': '#007cbf',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });
  };

  // Function to fetch parking spaces data from cape town website
const fetchParkingSpaces = () => {
const url = 'https://citymaps.capetown.gov.za/agsext1/rest/services/Theme_Based/Open_Data_Service/FeatureServer/147/query?where=1%3D1&outFields=*&outSR=4326&f=json';
fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const features = data.features;
        const parkingLocations = [];

        // Iterate through each parking space
        for (let i = 0; i < features.length; i++) {
            const parkingLocation = {
                latitude: features[i].geometry.y,
                longitude: features[i].geometry.x
            };

            parkingLocations.push(parkingLocation);

            // Add marker for each parking space
            // const marker = new maplibregl.Marker()
            //     .setLngLat([parkingLocation.longitude, parkingLocation.latitude])
            //     .addTo(map);
        }

        // Calculate shortest distance to parking spaces
        const { shortestDistance, nearestParkingSpace } = calculateShortestDistance(userLocation, parkingLocations);
        if (nearestParkingSpace) {
            drawPolyline(userLocation, nearestParkingSpace);
            // Add marker for the nearest parking space with a different color
            const nearestMarker = new maplibregl.Marker({ color: 'red' }) // Set the color to red
                .setLngLat([nearestParkingSpace.longitude, nearestParkingSpace.latitude])
                .addTo(map);
                
        } else {
            console.error('No nearest parking space found.');
        }
    })
    .catch(error => {
        console.error('Error fetching parking spaces data:', error);
    });
};

  // Function to calculate the distance between two points using the Haversine formula
  function calculateDistance(userLocation, parkingLocation) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = parkingLocation.latitude;
    const lon2 = parkingLocation.longitude;

    // Convert latitude and longitude from degrees to radians
    const latDiff = (lat2 - lat1) * (Math.PI / 180);
    const lonDiff = (lon2 - lon1) * (Math.PI / 180);

    // Calculate the Haversine distance
    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  // Function to calculate the shortest distance to a parking space
  // Function to calculate the shortest distance to a parking space
function calculateShortestDistance(userLocation, parkingLocations) {
// Check if userLocation is available
if (!userLocation || userLocation.latitude === 0 || userLocation.longitude === 0) {
    console.error('User location not available.');
    return { shortestDistance: 0, nearestParkingSpace: null };
}

// Check if parkingLocations array is empty
if (!parkingLocations || parkingLocations.length === 0) {
    console.error('No parking locations available.');
    return { shortestDistance: 0, nearestParkingSpace: null };
}

// Initialize variables for shortest distance and nearest parking space
let shortestDistance = Infinity;
let nearestParkingSpace = null;

// Iterate through each parking location
parkingLocations.forEach(parkingLocation => {
    const distance = calculateDistance(userLocation, parkingLocation);

    // Update shortest distance and nearest parking space if applicable
    if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestParkingSpace = parkingLocation;
    }
});

return { shortestDistance, nearestParkingSpace };
}
// Function to draw a polyline on the map
// Function to draw a polyline on the map
let polyline;
const drawPolyline = (start, end) => {
// Fetch the encoded polyline from HERE API
fetch(`https://router.hereapi.com/v8/routes?origin=${start.latitude},${start.longitude}&transportMode=car&destination=${end.latitude},${end.longitude};sideOfStreetHint=${start.latitude},${start.longitude}&return=polyline,summary&apikey=${hereKey}`)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    const route = data.routes[0];
    const encodedPolyline = route.sections[0].polyline;
    polyline =route.sections[0].polyline

    // Decode the polyline
    const decodedPolyline = decode(encodedPolyline);

    // Draw the decoded polyline on the map
    const coordinates = decodedPolyline.polyline.map(coord => [coord[1], coord[0]]);
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            }
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#ff0000',
            'line-width': 8
        }
    });
})
.catch(function(error) {
    console.error('Error fetching route:', error);
});
};
// Event listener for search input change
document.getElementById("searchInput").addEventListener("input", searchLocation);

// Event listener for search button click
document.getElementById("searchButton").addEventListener("click", displayGeoLocation);

// Event listeners to change map style
document.getElementById("here-explore").addEventListener("click", () => {
  map.setStyle(`https://maps.geo.${region}.amazonaws.com/maps/v0/maps/Here-explore/style-descriptor?key=${awsKey}`);
});

document.getElementById("here-imagery").addEventListener("click", () => {
  map.setStyle(`https://maps.geo.${region}.amazonaws.com/maps/v0/maps/HERE-imagery/style-descriptor?key=${awsKey}`);
});

document.getElementById("here-hybrid-imagery").addEventListener("click", () => {
  map.setStyle(`https://maps.geo.${region}.amazonaws.com/maps/v0/maps/HERE-hybrid-imagery/style-descriptor?key=${awsKey}`);
});
// Below is the code taken from github in decoding the polyline hence the copyright
/*
* Copyright (C) 2019 HERE Europe B.V.
* Licensed under MIT, see full license in LICENSE
* SPDX-License-Identifier: MIT
* License-Filename: LICENSE
*/
const DEFAULT_PRECISION = 5;

const ENCODING_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const DECODING_TABLE = [
62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

const FORMAT_VERSION = 1;

const ABSENT = 0;
const LEVEL = 1;
const ALTITUDE = 2;
const ELEVATION = 3;
// Reserved values 4 and 5 should not be selectable
const CUSTOM1 = 6;
const CUSTOM2 = 7;

const Num = typeof BigInt !== "undefined" ? BigInt : Number;

function decode(encoded) {
const decoder = decodeUnsignedValues(encoded);
const header = decodeHeader(decoder[0], decoder[1]);

const factorDegree = 10 ** header.precision;
const factorZ = 10 ** header.thirdDimPrecision;
const { thirdDim } = header;

let lastLat = 0;
let lastLng = 0;
let lastZ = 0;
const res = [];

let i = 2;
for (;i < decoder.length;) {
    const deltaLat = toSigned(decoder[i]) / factorDegree;
    const deltaLng = toSigned(decoder[i + 1]) / factorDegree;
    lastLat += deltaLat;
    lastLng += deltaLng;

    if (thirdDim) {
        const deltaZ = toSigned(decoder[i + 2]) / factorZ;
        lastZ += deltaZ;
        res.push([lastLat, lastLng, lastZ]);
        i += 3;
    } else {
        res.push([lastLat, lastLng]);
        i += 2;
    }
}

if (i !== decoder.length) {
    throw new Error('Invalid encoding. Premature ending reached');
}

return {
    ...header,
    polyline: res,
};
}

function decodeChar(char) {
const charCode = char.charCodeAt(0);
return DECODING_TABLE[charCode - 45];
}

function decodeUnsignedValues(encoded) {
let result = Num(0);
let shift = Num(0);
const resList = [];

encoded.split('').forEach((char) => {
    const value = Num(decodeChar(char));
    result |= (value & Num(0x1F)) << shift;
    if ((value & Num(0x20)) === Num(0)) {
        resList.push(result);
        result = Num(0);
        shift = Num(0);
    } else {
        shift += Num(5);
    }
});

if (shift > 0) {
    throw new Error('Invalid encoding');
}

return resList;
}

function decodeHeader(version, encodedHeader) {
if (+version.toString() !== FORMAT_VERSION) {
    throw new Error('Invalid format version');
}
const headerNumber = +encodedHeader.toString();
const precision = headerNumber & 15;
const thirdDim = (headerNumber >> 4) & 7;
const thirdDimPrecision = (headerNumber >> 7) & 15;
return { precision, thirdDim, thirdDimPrecision };
}

function toSigned(val) {
// Decode the sign from an unsigned value
let res = val;
if (res & Num(1)) {
    res = ~res;
}
res >>= Num(1);
return +res.toString();
}

function encode({ precision = DEFAULT_PRECISION, thirdDim = ABSENT, thirdDimPrecision = 0, polyline }) {
// Encode a sequence of lat,lng or lat,lng(,{third_dim}). Note that values should be of type BigNumber
//   `precision`: how many decimal digits of precision to store the latitude and longitude.
//   `third_dim`: type of the third dimension if present in the input.
//   `third_dim_precision`: how many decimal digits of precision to store the third dimension.

const multiplierDegree = 10 ** precision;
const multiplierZ = 10 ** thirdDimPrecision;
const encodedHeaderList = encodeHeader(precision, thirdDim, thirdDimPrecision);
const encodedCoords = [];

let lastLat = Num(0);
let lastLng = Num(0);
let lastZ = Num(0);
polyline.forEach((location) => {
   const lat = Num(Math.round(location[0] * multiplierDegree));
   encodedCoords.push(encodeScaledValue(lat - lastLat));
   lastLat = lat;

   const lng = Num(Math.round(location[1] * multiplierDegree));
   encodedCoords.push(encodeScaledValue(lng - lastLng));
   lastLng = lng;

   if (thirdDim) {
       const z = Num(Math.round(location[2] * multiplierZ));
       encodedCoords.push(encodeScaledValue(z - lastZ));
       lastZ = z;
   }
});

return [...encodedHeaderList, ...encodedCoords].join('');
}

function encodeHeader(precision, thirdDim, thirdDimPrecision) {
// Encode the `precision`, `third_dim` and `third_dim_precision` into one encoded char
if (precision < 0 || precision > 15) {
    throw new Error('precision out of range. Should be between 0 and 15');
}
if (thirdDimPrecision < 0 || thirdDimPrecision > 15) {
    throw new Error('thirdDimPrecision out of range. Should be between 0 and 15');
}
if (thirdDim < 0 || thirdDim > 7 || thirdDim === 4 || thirdDim === 5) {
    throw new Error('thirdDim should be between 0, 1, 2, 3, 6 or 7');
}

const res = (thirdDimPrecision << 7) | (thirdDim << 4) | precision;
return encodeUnsignedNumber(FORMAT_VERSION) + encodeUnsignedNumber(res);
}

function encodeUnsignedNumber(val) {
// Uses variable integer encoding to encode an unsigned integer. Returns the encoded string.
let res = '';
let numVal = Num(val);
while (numVal > 0x1F) {
    const pos = (numVal & Num(0x1F)) | Num(0x20);
    res += ENCODING_TABLE[pos];
    numVal >>= Num(5);
}
return res + ENCODING_TABLE[numVal];
}

function encodeScaledValue(value) {
// Transform a integer `value` into a variable length sequence of characters.
//   `appender` is a callable where the produced chars will land to
let numVal = Num(value);
const negative = numVal < 0;
numVal <<= Num(1);
if (negative) {
    numVal = ~numVal;
}

return encodeUnsignedNumber(numVal);
}
  // Call setupMap function to initialize the map
  setupMap();
});