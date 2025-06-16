'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

function EditProfileForm({ currentBio, currentName, currentEmail, onSave, onCancel }) {
  const [bioInput, setBioInput] = useState(currentBio || '');
  const [nameInput, setNameInput] = useState(currentName || '');
  const [emailInput, setEmailInput] = useState(currentEmail || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ bio: bioInput, name: nameInput, email: emailInput });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2 input" controlId="nameInput">
        <Form.Control type="text" placeholder="Your username" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-2 input" controlId="emailInput">
        <Form.Control type="text" placeholder="Your email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-2 input" controlId="bioTextarea">
        <Form.Control as="textarea" rows={3} placeholder="Write a short bio..." value={bioInput} onChange={(e) => setBioInput(e.target.value)} />
      </Form.Group>
      <Button type="submit" size="sm" className="me-2">
        Save
      </Button>
      <Button variant="secondary" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
}

EditProfileForm.propTypes = {
  currentBio: PropTypes.string,
  currentName: PropTypes.string,
  currentEmail: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditProfileForm;
