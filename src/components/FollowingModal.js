'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';

function FollowingModal({ following, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h5 className="text-center">Following</h5>
        <ul className="list-group mt-3">
          {following.length === 0 ? (
            <p className="fst-italic text-muted">Not following anyone.</p>
          ) : (
            following.map((f) => (
              <li key={f.skater_id} className="list-group-item text-center">
                <Link href={`/skater/${f.skater_id}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark">
                  <Image src={f.skaterObject?.profile_picture || '/images/default.png'} alt="Skater Avatar" width={40} height={40} roundedCircle />
                  <span>{f.skaterObject?.name || 'Unnamed Skater'}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
        <button type="button" className="pink-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

FollowingModal.propTypes = {
  following: PropTypes.arrayOf(
    PropTypes.shape({
      skater_id: PropTypes.string,
      skaterObject: PropTypes.shape({
        name: PropTypes.string,
        profile_picture: PropTypes.string,
      }),
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FollowingModal;
