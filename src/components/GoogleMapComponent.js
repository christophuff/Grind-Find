import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import fetchNearbyParks from '../api/googleData'; // Import the API function
import SearchBar from './SearchBar'; // Import the SearchBar component

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultLocation = {
  lat: 36.1627, // Nashville, TN Latitude
  lng: -86.7816, // Nashville, TN Longitude
};

function GoogleMapComponent() {
  const [location, setLocation] = useState(defaultLocation);
  const [parks, setParks] = useState([]); // To store the fetched parks data

  // Function to call fetchNearbyParks and update state
  const getNearbyParks = (lat, lng) => {
    fetchNearbyParks(lat, lng)
      .then((parksData) => {
        // Log and check the data structure returned
        console.log('Fetched Parks:', parksData);

        // Make sure parksData results are returned and update the state
        if (parksData.results) {
          setParks(parksData.results); // Update state with parks data
        } else {
          setParks([]); // If no parks found, set it to an empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching parks:', error); // Handle any errors
      });
  };

  // Call fetchNearbyParks whenever the location changes
  useEffect(() => {
    getNearbyParks(location.lat, location.lng);
  }, [location]); // This hook runs every time location changes

  // Function to handle location change from SearchBar
  const handleLocationSubmit = (address) => {
    const apiKey = 'AIzaSyAnfCI55bELlwCarUVQr3LL1eOhN2GEqiE';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    // Geocode the address to lat, lng
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results[0]) {
          const newLocation = data.results[0].geometry.location;
          setLocation({ lat: newLocation.lat, lng: newLocation.lng }); // Update the location
        } else {
          alert('Location not found.');
        }
      })
      .catch((error) => {
        console.error('Error geocoding location:', error);
      });
  };

  return (
    <div>
      {/* SearchBar to take user input for location */}
      <SearchBar onSubmit={handleLocationSubmit} />

      <LoadScript googleMapsApiKey="AIzaSyAnfCI55bELlwCarUVQr3LL1eOhN2GEqiE">
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={12}>
          <Marker position={location} />
          {/* Dynamically add markers for each park */}
          {parks.length > 0 ? (
            parks.map((park) => (
              <Marker
                key={park.place_id}
                position={{
                  lat: park.geometry.location.lat,
                  lng: park.geometry.location.lng,
                }}
                title={park.name} // Show the park name on hover
              />
            ))
          ) : (
            <p>No skateparks found nearby.</p> // If no parks are found, display a message
          )}
        </GoogleMap>
      </LoadScript>

      {/* Button to move the map to a new location */}
      <button
        type="button"
        onClick={() => setLocation({ lat: 36.1699, lng: -86.785 })} // Just an example location
      >
        Move Map to New Location (Nearby)
      </button>
    </div>
  );
}

export default GoogleMapComponent;
