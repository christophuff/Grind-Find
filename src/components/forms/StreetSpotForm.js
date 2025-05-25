'use client';

import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { getSkaters } from '../../api/skaterData'; // Fetching skaters
import { createStreetSpot, updateStreetSpot } from '../../api/streetSpotData'; // Adjust API methods

const initialState = {
  name: '',
  description: '',
  address: '',
  skater_id: '',
  uid: '',
  images: [], // Store an array of image URLs
};

function StreetSpotForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  const [skater, setSkaters] = useState([]); // Store the list of skaters here
  const router = useRouter();
  const { user } = useAuth(); // Get the user data (uid)

  useEffect(() => {
    if (user) {
      // Fetch skaters when user is available
      getSkaters(user.uid)
        .then((skaterList) => {
          setSkaters(skaterList);

          // If editing an existing spot, set the form data
          if (obj.firebaseKey) {
            setFormInput({
              ...obj,
              skater_id: obj.skater_id || '', // Ensure skater_id is passed correctly
              uid: user.uid, // Set the user's UID
            });
          } else {
            // If creating a new spot, set the UID in the form
            setFormInput((prevInput) => ({
              ...prevInput,
              uid: user.uid, // Add user.uid to the form data
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

  // Handle image file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert file list to array
    const uploadPromises = files.map((file) => {
      // Generate a unique file name
      const fileName = `${new Date().getTime()}-${file.name}`;

      // Create a reference to Firebase Storage
      const storageRef = firebase.storage().ref(`streetSpotImages/${fileName}`);

      // Upload the file to Firebase Storage
      return storageRef.put(file).then(() => storageRef.getDownloadURL());
    });

    // Wait for all file uploads to complete and get the URLs
    Promise.all(uploadPromises)
      .then((urls) => {
        setFormInput((prevState) => ({
          ...prevState,
          images: urls, // Store the URLs in the state
        }));
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formInput,
      created_by: formInput.skater_id, // Use skater_id in the created_by field
      address: formInput.address, // Store the address for the spot
      images: formInput.images, // Store the uploaded image URLs
    };

    // Check if we are updating an existing spot or creating a new one
    if (obj.firebaseKey) {
      updateStreetSpot(payload).then(() => router.push(`/my-uploads`));
    } else {
      createStreetSpot(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateStreetSpot(patchPayload).then(() => {
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

      {/* IMAGE UPLOAD INPUT */}
      <label htmlFor="images" className="form-label">
        Spot Images
      </label>
      <input
        type="file"
        id="images"
        name="images"
        multiple // Allow multiple file uploads
        onChange={handleFileChange}
        className="form-input"
      />

      {/* IMAGE PREVIEW */}
      <div className="image-previews">
        {formInput.images && formInput.images.length > 0 ? (
          formInput.images.map((image, index) => <img key={image} src={image} alt={`Preview ${index}`} className="image-preview" />)
        ) : (
          <p>No images selected</p> // Or simply leave it empty
        )}
      </div>

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
    images: PropTypes.arrayOf(PropTypes.string), // Expecting an array of image URLs
    address: PropTypes.string, // Changed from location to address
    name: PropTypes.string,
    skater_id: PropTypes.string,
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
  }),
};

export default StreetSpotForm;
