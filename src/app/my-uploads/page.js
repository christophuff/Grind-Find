'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import StreetSpotCard from '../../components/StreetSpotCard';
import { getStreetSpotsByUser } from '../../api/streetSpotData';
import { useAuth } from '../../utils/context/authContext';

function MyUploads() {
  const [streetSpots, setStreetSpots] = useState([]);
  const { user } = useAuth();

  const getUserStreetSpots = useCallback(() => {
    if (user) {
      getStreetSpotsByUser(user.uid).then(setStreetSpots);
    }
  }, [user]);

  useEffect(() => {
    document.title = 'GrindFind || My Uploads';
    if (user) {
      getUserStreetSpots();
    }
  }, [user, getUserStreetSpots]);

  return (
    <div className="uploads-page">
      <Link href="/my-uploads/new-spot" passHref>
        <button type="button" className="pink-btn">
          Add A Street Spot
        </button>
      </Link>

      <div className="card-container">
        {/* Map through the streetSpots and display each one */}
        {streetSpots.length > 0 ? (
          streetSpots.map((streetSpot) => <StreetSpotCard key={streetSpot.firebaseKey} streetSpotObj={streetSpot} onUpdate={getUserStreetSpots} />)
        ) : (
          <p>No street spots uploaded yet.</p> // Display a message if the user hasn't uploaded any spots
        )}
      </div>
    </div>
  );
}

export default MyUploads;
