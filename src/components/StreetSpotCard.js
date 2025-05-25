'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { deleteStreetSpot } from '../api/streetSpotData';

function StreetSpotCard({ streetSpotObj, onUpdate }) {
  const deleteThisSpot = () => {
    if (window.confirm(`Delete ${streetSpotObj.name}?`)) {
      deleteStreetSpot(streetSpotObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <div className="spot-card-container">
      <div className="spot-card-image-container">
        <Image className="spot-card-image" src={streetSpotObj.images && streetSpotObj.images[0] ? streetSpotObj.images[0] : '/public/images/default.png'} width={130} height={130} alt={streetSpotObj.description} />
      </div>
      <div className="spot-location-container">
        <h3>{streetSpotObj.name}</h3>
        <p>{streetSpotObj.address}</p>
        {/* ratings will go here */}
      </div>
      <div className="spot-button-container">
        <Link href={`/spots/${streetSpotObj.firebaseKey}`} passHref>
          <button type="button" className="pink-btn">
            VIEW
          </button>
        </Link>
        <br />
        <Link href={`/my-uploads/edit-spot/${streetSpotObj.firebaseKey}`} passHref>
          <button type="button" className="pink-btn">
            EDIT
          </button>
        </Link>
        <br />
        <button type="button" className="red-btn" onClick={deleteThisSpot}>
          DELETE
        </button>
      </div>
    </div>
  );
}

StreetSpotCard.propTypes = {
  streetSpotObj: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default StreetSpotCard;
