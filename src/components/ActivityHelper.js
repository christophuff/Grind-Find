'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPen, faStar, faUserPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export default function ActivityHelper({ activity, skaterName }) {
  const { type, timestamp, metadata } = activity;
  const formattedTime = new Date(timestamp).toLocaleString();

  const iconMap = {
    spot_upload: faUpload,
    spot_edit: faPen,
    rating: faStar,
    follow: faUserPlus,
  };

  const icon = iconMap[type] || faQuestionCircle;

  switch (type) {
    case 'spot_upload':
      return (
        <>
          <FontAwesomeIcon icon={icon} className="activity-icon" />
          <div>
            {' '}
            {skaterName} uploaded{' '}
            <Link href={`/spots/${metadata.spotId}`}>
              <strong>{metadata.spotName}</strong>
            </Link>{' '}
            <br />
            <small className="text-muted">{formattedTime}</small>
          </div>
        </>
      );
    case 'spot_edit':
      return (
        <>
          <FontAwesomeIcon icon={icon} className="activity-icon" />
          <div>
            {' '}
            {skaterName} edited{' '}
            <Link href={`/spots/${metadata.spotId}`}>
              <strong>{metadata.spotName}</strong>
            </Link>{' '}
            <br />
            <small className="text-muted">{formattedTime}</small>
          </div>
        </>
      );
    case 'rating':
      return (
        <>
          <FontAwesomeIcon icon={icon} className="activity-icon" />
          <div>
            {' '}
            {skaterName} rated{' '}
            <Link href={`/spots/${metadata.spotId}`}>
              <strong>{metadata.spotName}</strong>
            </Link>{' '}
            {metadata.ratingValue} Stars
            <br />
            <small className="text-muted">{formattedTime}</small>
          </div>
        </>
      );
    case 'follow':
      return (
        <>
          <FontAwesomeIcon icon={icon} className="activity-icon" />
          <div>
            {' '}
            {skaterName} followed{' '}
            <Link href={`/skater/${metadata.followedId}`}>
              <strong>{metadata.followedUsername}</strong>
            </Link>{' '}
            <br />
            <small className="text-muted">{formattedTime}</small>
          </div>
        </>
      );
    default:
      return (
        <>
          <FontAwesomeIcon icon={icon} className="activity-icon" />
          <div>
            {' '}
            {skaterName} did something
            <br />
            <small className="text-muted">{formattedTime}</small>
          </div>
        </>
      );
  }
}

ActivityHelper.propTypes = {
  activity: PropTypes.shape({
    type: PropTypes.oneOf(['spot_upload', 'spot_edit', 'rating', 'follow']).isRequired,
    timestamp: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      spotId: PropTypes.string,
      spotName: PropTypes.string,
      ratingValue: PropTypes.number,
      followedId: PropTypes.string,
      followedUsername: PropTypes.string,
    }).isRequired,
  }).isRequired,
  skaterName: PropTypes.string.isRequired,
};
