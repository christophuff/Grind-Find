import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icon import
import PropTypes from 'prop-types'; // Import PropTypes

function SearchBar({ onSubmit }) {
  const [input, setInput] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input); // Pass the input back to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <button type="submit" className="search-button" aria-label="Search">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <input type="text" value={input} onChange={handleInputChange} placeholder="Enter Location or ZipCode" className="search-input" />
    </form>
  );
}

// PropTypes validation for onSubmit
SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Ensures onSubmit is a required function
};

export default SearchBar;
