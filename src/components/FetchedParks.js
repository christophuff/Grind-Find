'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Loading from './Loading';
import { fetchNearbyParks } from '../api/googleData';
import StarRating from './StarRating';

function FetchedParks({ lat, lng }) {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  const placeholderImage = '/images/default.png';

  useEffect(() => {
    if (lat && lng) {
      fetchNearbyParks(lat, lng)
        .then((parksData) => {
          setParks(parksData.results || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching parks data:', error);
          setLoading(false);
        });
    }
  }, [lat, lng]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h3 className="text-center">Nearby Parks</h3>
      {parks.length === 0 ? (
        <p className="text-center">No parks found</p>
      ) : (
        <div className="card-container">
          {parks.map((park, index) => (
            <Link key={park.place_id} href={`/parks/${park.place_id}`}>
              <div className={`spot-card-container ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <div className="spot-card-image-container">
                  <Image src={park.photoUrl || placeholderImage} alt={`Skatepark at ${park.vicinity || park.name}`} width={130} height={130} />
                </div>
                <div className="spot-location-container">
                  <h5>{park.name}</h5>
                  <StarRating rating={park.rating || 0} />
                  <p>Location: {park.vicinity || 'Unknown'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

FetchedParks.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default FetchedParks;
