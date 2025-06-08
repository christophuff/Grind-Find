'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Slider from 'react-slick';
import { useAuth } from '@/utils/context/authContext';
import InteractiveStarRating from '@/components/InteractiveStarRating';
import { getSingleStreetSpot, updateStreetSpot } from '../../../api/streetSpotData';
import { getSingleSkater } from '../../../api/skaterData'; // ✅ import skater fetcher
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ViewSpot({ params }) {
  const { firebaseKey } = params;
  const [spotDetails, setSpotDetails] = useState({});
  const [skater, setSkater] = useState(null); // ✅ new skater state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    getSingleStreetSpot(firebaseKey)
      .then((data) => {
        setSpotDetails(data);
        if (data.ratings && userId && data.ratings[userId]) {
          setHasRated(true);
        }
      })
      .catch((error) => console.error('Error fetching spot details:', error));
  }, [firebaseKey, userId]);

  useEffect(() => {
    if (spotDetails.skater_id) {
      getSingleSkater(spotDetails.skater_id)
        .then(setSkater)
        .catch((err) => console.error('Error fetching skater info:', err));
    }
  }, [spotDetails.skater_id]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleRating = (value) => {
    if (!userId) {
      alert('You must be logged in to rate.');
      return;
    }

    const existingRatings = spotDetails.ratings || {};

    if (existingRatings[userId]) {
      alert('You already rated this spot.');
      return;
    }

    const updatedRatings = {
      ...existingRatings,
      [userId]: value,
    };

    const allRatings = Object.values(updatedRatings);
    const average = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;

    updateStreetSpot({
      firebaseKey,
      ratings: updatedRatings,
      rating: Math.round(average * 10) / 10,
    })
      .then(() => {
        setHasRated(true);
        setSpotDetails((prev) => ({
          ...prev,
          ratings: updatedRatings,
          rating: Math.round(average * 10) / 10,
        }));
        alert('Thanks for your rating!');
      })
      .catch((err) => {
        console.error('Error saving rating:', err);
        alert('Could not save rating');
      });
  };

  if (!spotDetails || !spotDetails.images) return <p>Loading...</p>;

  const settings = {
    dots: false,
    infinite: spotDetails.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImageIndex(next),
  };

  return (
    <div className="spot-page-container">
      <div className="image-section">
        {/* Image Carousel */}
        <Slider {...settings}>
          {spotDetails.images.map((image, index) => (
            <div key={image}>
              <img src={image} alt={`Spot ${index + 1}`} className="spot-image" width={500} height={300} />
            </div>
          ))}
        </Slider>

        {/* Image Previews Below Carousel */}
        <div className="image-previews">
          {spotDetails.images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`Preview of spot ${index + 1}`}
              className={`image-preview ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleImageClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick(index);
                }
              }}
              tabIndex={0}
              width={80}
              height={80}
            />
          ))}
        </div>
      </div>

      <div className="details-section">
        <h1>{spotDetails.name}</h1>
        <p>{spotDetails.address}</p>
        <p>
          Security Level: <span className={`security-badge ${spotDetails.security_level?.toLowerCase()}`}>{spotDetails.security_level || 'Unknown'}</span>
        </p>

        {spotDetails.rating && (
          <p>
            Average Rating: {spotDetails.rating} ★ ({Object.keys(spotDetails.ratings || {}).length} rating
            {Object.keys(spotDetails.ratings || {}).length !== 1 ? 's' : ''})
          </p>
        )}

        {!hasRated ? (
          <>
            <p>Rate this spot:</p>
            <InteractiveStarRating onRate={handleRating} />
          </>
        ) : (
          <p>You rated this spot: {spotDetails.ratings?.[userId]} ★</p>
        )}

        <p>{spotDetails.description || ''}</p>
        <p>Created by: {skater?.name || 'Unknown'}</p>
      </div>
    </div>
  );
}

ViewSpot.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
