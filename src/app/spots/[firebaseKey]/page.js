'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Slider from 'react-slick';
import viewSpotDetails from '@/api/mergedData'; // Correct import for merged data
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'; // Importing the slick-carousel styles

export default function ViewSpot({ params }) {
  const [spotDetails, setSpotDetails] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image in carousel
  const { firebaseKey } = params;

  // Fetch the data using the firebaseKey
  useEffect(() => {
    viewSpotDetails(firebaseKey)
      .then(setSpotDetails)
      .catch((error) => console.error('Error fetching spot details:', error));
  }, [firebaseKey]);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImageIndex(next),
  };

  if (!spotDetails || !spotDetails.images) return <p>Loading...</p>;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="spot-page-container">
      <div className="image-section">
        {/* Image Carousel */}
        <Slider {...settings}>
          {spotDetails.images.map((image, index) => (
            <div key={image}>
              <img
                src={image}
                alt={`Spot ${index + 1}`}
                className="spot-image"
                width={500} // Provide width and height for Next.js optimization
                height={300}
              />
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
        <p>{spotDetails.description || ''}</p>
        <p>Created by: {spotDetails.skaterObject?.name}</p>
      </div>
    </div>
  );
}

ViewSpot.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired, // Specify that firebaseKey should be a string and is required
  }).isRequired,
};
