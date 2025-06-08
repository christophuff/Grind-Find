'use client';

import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import GoogleMapComponent from '../components/GoogleMapComponent';
import FetchedParks from '../components/FetchedParks';
import FetchedStreetSpots from '../components/FetchedStreetSpots';
import SearchBar from '../components/SearchBar';
import { fetchNearbyParks } from '../api/googleData';
import { getStreetSpots } from '../api/streetSpotData';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [parks, setParks] = useState([]);
  const [streetSpots, setStreetSpots] = useState([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const { user, loading } = useAuth();

  // ✅ Safely load Google Maps API once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!loading && user) {
      setLat(user.location?.lat || 36.1627);
      setLng(user.location?.lng || -86.7816);
      setIsAuthLoaded(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (isAuthLoaded && lat && lng) {
      fetchNearbyParks(lat, lng)
        .then((parksData) => {
          setParks(parksData.results);
        })
        .catch((error) => {
          console.error('Error fetching parks:', error);
        });

      getStreetSpots(lat, lng)
        .then((streetSpotsData) => {
          setStreetSpots(streetSpotsData);
        })
        .catch((error) => {
          console.error('Error fetching street spots:', error);
        });
    }
  }, [lat, lng, isAuthLoaded]);

  const handleSearch = (cityOrZip) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityOrZip}&key=${apiKey}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results[0]) {
          const newLocation = data.results[0].geometry.location;
          setLat(newLocation.lat);
          setLng(newLocation.lng);
        } else {
          alert('City or ZIP Code not found');
        }
      })
      .catch((error) => {
        console.error('Error geocoding location:', error);
      });
  };

  if (!isLoaded || !isAuthLoaded) return <div>Loading map...</div>;

  return (
    <div className="home-search">
      <SearchBar onSubmit={handleSearch} />
      <div className="main-page">
        <div className="map">
          <GoogleMapComponent key={`${lat}-${lng}`} lat={lat} lng={lng} parks={parks} streetSpots={streetSpots} onSelectPark={(park) => console.log('Selected park:', park)} onSelectStreetSpot={(spot) => console.log('Selected street spot:', spot)} />
        </div>
        <div className="nearby-container">
          <div className="fetched-parks">
            <FetchedParks lat={lat} lng={lng} />
          </div>
          <div className="fetched-street-spots">
            <FetchedStreetSpots lat={lat} lng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
