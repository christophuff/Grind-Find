'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

function InteractiveStarRating({ onRate, disabled }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleClick = (rating) => {
    setSelected(rating);
    onRate(rating);
  };

  return (
    <div className="interactive-star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered ?? selected) ? 'filled' : ''}`}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(null)}
          onClick={() => !disabled && handleClick(star)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              handleClick(star);
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

InteractiveStarRating.propTypes = {
  onRate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

InteractiveStarRating.defaultProps = {
  disabled: false,
};

export default InteractiveStarRating;
