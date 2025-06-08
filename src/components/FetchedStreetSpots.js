'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Loading from './Loading';
import { getStreetSpots } from '../api/streetSpotData';
import StarRating from './StarRating';

function FetchedStreetSpots({ lat, lng }) {
  const [streetSpots, setStreetSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const placeholderImage = '/images/default.png';

  useEffect(() => {
    if (lat && lng) {
      getStreetSpots(lat, lng)
        .then((spotsData) => {
          setStreetSpots(spotsData || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching street spots data:', error);
          setLoading(false);
        });
    }
  }, [lat, lng]);

  if (loading) return <Loading />;

  return (
    <div>
      <h3 className="text-center">Nearby Street Spots</h3>
      {streetSpots.length === 0 ? (
        <p className="text-center">No street spots found</p>
      ) : (
        <div className="card-container">
          {streetSpots.map((spot, index) => (
            <Link key={spot.firebaseKey} href={`/spots/${spot.firebaseKey}`} className={`street-spot-card-container ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <div className="spot-card-image-container">
                <Image src={spot.images?.[0] || placeholderImage} alt={`Street spot at ${spot.address || spot.name}`} width={130} height={130} />
              </div>
              <div className="spot-location-container">
                <h5>{spot.name}</h5>
                <StarRating rating={spot.rating || 0} />
                <p>Location: {spot.address || 'Unknown'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

FetchedStreetSpots.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default FetchedStreetSpots;
