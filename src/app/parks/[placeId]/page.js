'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Slider from 'react-slick';
import { fetchParkDetails } from '@/api/googleData';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ViewPark({ params }) {
  const [parkDetails, setParkDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { placeId } = params;

  useEffect(() => {
    fetchParkDetails(placeId)
      .then(setParkDetails)
      .catch((err) => {
        console.error('Error fetching park details:', err);
      });
  }, [placeId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImageIndex(next),
  };

  if (!parkDetails) return <p>Loading park details...</p>;

  const photoUrls = parkDetails.photos?.map((photo) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`) || [];

  return (
    <div className="spot-page-container">
      <div className="image-section">
        {photoUrls.length > 0 && (
          <>
            <Slider {...settings}>
              {photoUrls.map((url, index) => (
                <div key={url}>
                  <Image src={url} alt={`Park ${index + 1}`} className="spot-image" height={300} width={500} style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </Slider>

            <div className="image-previews">
              {photoUrls.map((url, index) => (
                <Image
                  key={url}
                  src={url}
                  alt={`Preview of park ${index + 1}`}
                  className={`image-preview ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setCurrentImageIndex(index);
                  }}
                  tabIndex={0}
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="details-section">
        <h1>{parkDetails.name}</h1>
        <p>{parkDetails.formatted_address}</p>
        <p>Rating: {parkDetails.rating || 'N/A'}</p>
        <p>Total Ratings: {parkDetails.user_ratings_total || 0}</p>
        <p>Phone: {parkDetails.formatted_phone_number || 'Not listed'}</p>
        {parkDetails.website && (
          <p>
            Website:{' '}
            <a href={parkDetails.website} target="_blank" rel="noreferrer">
              {parkDetails.website}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

ViewPark.propTypes = {
  params: PropTypes.shape({
    placeId: PropTypes.string.isRequired,
  }).isRequired,
};
