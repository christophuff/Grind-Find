'use client';

import React, { useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import MapStyle from './MapStyle';

const containerStyle = {
  width: '97%',
  height: '70vh',
};

function GoogleMapComponent({ lat, lng, parks, streetSpots }) {
  const mapRef = useRef(null);

  return (
    <div className="map-container">
      <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={12} ref={mapRef} options={{ styles: MapStyle }}>
        {/* Park Markers - Red */}
        {typeof window !== 'undefined' &&
          window.google &&
          parks
            .filter((park) => park.geometry?.location?.lat && park.geometry?.location?.lng)
            .map((park) => (
              <Marker
                key={park.place_id}
                position={{
                  lat: park.geometry.location.lat,
                  lng: park.geometry.location.lng,
                }}
                title={park.name}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            ))}

        {/* Street Spot Markers - Blue */}
        {typeof window !== 'undefined' &&
          window.google &&
          streetSpots
            .filter((spot) => spot.latitude && spot.longitude)
            .map((spot) => (
              <Marker
                key={spot.firebaseKey}
                position={{
                  lat: spot.latitude,
                  lng: spot.longitude,
                }}
                title={spot.name}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            ))}
      </GoogleMap>
    </div>
  );
}

GoogleMapComponent.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  parks: PropTypes.arrayOf(
    PropTypes.shape({
      place_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      geometry: PropTypes.shape({
        location: PropTypes.shape({
          lat: PropTypes.number,
          lng: PropTypes.number,
        }),
      }),
    }),
  ).isRequired,
  streetSpots: PropTypes.arrayOf(
    PropTypes.shape({
      firebaseKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  ).isRequired,
};

export default GoogleMapComponent;
