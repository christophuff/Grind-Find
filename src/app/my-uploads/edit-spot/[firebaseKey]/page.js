'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleStreetSpot } from '../../../../api/streetSpotData';
import StreetSpotForm from '../../../../components/forms/StreetSpotForm';

export default function EditStreetSpot({ params }) {
  const [editItem, setEditItem] = useState({});
  //  grab the firebasekey
  const { firebaseKey } = params;

  useEffect(() => {
    getSingleStreetSpot(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  // pass object to form
  return <StreetSpotForm obj={editItem} />;
}

EditStreetSpot.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
