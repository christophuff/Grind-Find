'use client';

import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { getSkaters } from '../../api/skaterData';
import { createStreetSpot, updateStreetSpot } from '../../api/streetSpotData';
import { logActivity } from '../../api/activityData';

const initialState = {
  name: '',
  description: '',
  address: '',
  skater_id: '',
  uid: '',
  images: [],
  latitude: '',
  longitude: '',
  security_level: '',
};

function StreetSpotForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  const [skater, setSkaters] = useState([]);
  const [isGeocodingComplete, setIsGeocodingComplete] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getSkaters(user.uid)
        .then((skaterList) => {
          setSkaters(skaterList);

          if (obj.firebaseKey) {
            setFormInput({
              ...obj,
              skater_id: obj.skater_id || '',
              uid: user.uid,
            });
          } else {
            setFormInput((prevInput) => ({
              ...prevInput,
              uid: user.uid,
            }));
          }
        })
        .catch((error) => console.error('Error fetching skaters:', error));
    }
  }, [user, obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map((file) => {
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = firebase.storage().ref(`streetSpotImages/${fileName}`);
      return storageRef.put(file).then(() => storageRef.getDownloadURL());
    });

    Promise.all(uploadPromises)
      .then((urls) => {
        setFormInput((prevState) => ({
          ...prevState,
          images: urls,
        }));
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  const handleLocationSubmit = (address) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results[0]) {
          const newLocation = data.results[0].geometry.location;
          setFormInput({
            ...formInput,
            latitude: newLocation.lat,
            longitude: newLocation.lng,
          });
          setIsGeocodingComplete(true);
        } else {
          alert('Location not found.');
        }
      })
      .catch((error) => {
        console.error('Error geocoding location:', error);
        alert('Error geocoding location');
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isGeocodingComplete) {
      handleLocationSubmit(formInput.address);
    }

    if (!isGeocodingComplete) {
      alert('Geocoding is not completed yet. Please wait a moment and try again!');
      return;
    }

    const payload = {
      ...formInput,
      created_by: formInput.skater_id,
      address: formInput.address,
      images: formInput.images,
    };

    if (obj.firebaseKey) {
      updateStreetSpot(payload).then(() => {
        const activity = {
          skater_id: payload.skater_id,
          type: 'spot_edit',
          timestamp: new Date().toISOString(),
          metadata: {
            spotId: obj.firebaseKey,
            spotName: payload.name,
          },
        };

        logActivity(activity)
          .then(() => console.log('Activity logged: spot_edit'))
          .catch((err) => console.error('Activity logging failed:', err));

        router.push('/my-uploads');
      });
    } else {
      createStreetSpot(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateStreetSpot(patchPayload).then(() => {
          // Log activity
          const activity = {
            skater_id: payload.skater_id,
            type: 'spot_upload',
            timestamp: new Date().toISOString(),
            metadata: {
              spotId: name,
              spotName: payload.name,
            },
          };

          logActivity(activity)
            .then(() => console.log('Activity logged: spot_upload'))
            .catch((err) => console.error('Activity logging failed:', err));

          router.push('/my-uploads');
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="street-spot-form">
      <h2>{obj.firebaseKey ? 'Update' : 'Create'} Street Spot</h2>

      {/* NAME INPUT */}
      <label htmlFor="name" className="form-label">
        Spot Name
      </label>
      <input type="text" id="name" name="name" placeholder="Enter a spot name" value={formInput.name} onChange={handleChange} required className="form-input" />

      {/* IMAGE UPLOAD */}
      <label htmlFor="images" className="form-label">
        Spot Images
      </label>
      <input type="file" id="images" name="images" multiple onChange={handleFileChange} className="form-input" />

      {/* IMAGE PREVIEWS */}
      <div className="image-previews">{formInput.images && formInput.images.length > 0 ? formInput.images.map((image, index) => <img key={image} src={image} alt={`Preview ${index}`} className="image-preview" />) : <p>No images selected</p>}</div>

      {/* ADDRESS INPUT */}
      <label htmlFor="address" className="form-label">
        Spot Address
      </label>
      <input type="text" id="address" name="address" placeholder="Enter spot address" value={formInput.address} onChange={handleChange} required className="form-input" />

      {/* SKATER SELECT */}
      <label htmlFor="skater_id" className="form-label">
        Skater
      </label>
      <select id="skater_id" name="skater_id" value={formInput.skater_id || ''} onChange={handleChange} required className="form-select">
        <option value="">Select a Skater</option>
        {skater
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((skaters) => (
            <option key={skaters.skater_id} value={skaters.skater_id}>
              {skaters.name}
            </option>
          ))}
      </select>

      {/* DESCRIPTION TEXTAREA */}
      <label htmlFor="description" className="form-label">
        Description
      </label>
      <textarea id="description" name="description" placeholder="Description" value={formInput.description} onChange={handleChange} required className="form-textarea" />

      {/* SECURITY LEVEL DROPDOWN */}
      <label htmlFor="security_level" className="form-label">
        Security Level
      </label>
      <select id="security_level" name="security_level" value={formInput.security_level} onChange={handleChange} required className="form-select">
        <option value="">Select security level</option>
        <option value="High">High</option>
        <option value="Moderate">Moderate</option>
        <option value="Low">Low</option>
      </select>

      {/* SUBMIT BUTTON */}
      <button type="submit" className="form-button">
        {obj.firebaseKey ? 'Update' : 'Create'} Street Spot
      </button>
    </form>
  );
}

StreetSpotForm.propTypes = {
  obj: PropTypes.shape({
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.string,
    name: PropTypes.string,
    skater_id: PropTypes.string,
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    security_level: PropTypes.string, // NEW PROP TYPE
  }),
};

export default StreetSpotForm;
