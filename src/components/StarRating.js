import React from 'react';
import PropTypes from 'prop-types';

// Star Component
function Star({ filled, id }) {
  const starClassName = filled ? 'star filled' : 'star';
  return (
    <span className={starClassName} key={id}>
      ★
    </span>
  );
}

// Star Rating Component
function StarRating({ rating }) {
  // Full stars
  const fullStars = Math.floor(rating);
  // Half star
  const halfStar = rating % 1 !== 0;
  // Empty stars
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {/* Create the full stars */}
      {[...Array(fullStars)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Star key={`full-${index}`} filled />
      ))}

      {/* If there's a half star, add it */}
      {halfStar && <Star key="half" filled={false} />}

      {/* Create the empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Star key={`empty-${index}`} filled={false} />
      ))}
    </div>
  );
}

Star.propTypes = {
  filled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};
StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
