/*
 * SearchForm Component:
 * This functional component represents a search form for inputting a location.
 * It takes two props: handleSubmit (a function) and inputRef (a ref object).
 */

// Disable ESLint rule for prop-types as this component does not use prop-types
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function SearchForm({ handleSubmit /* , inputRef */ }) {
  const [searchTerm, setSearchTerm] = useState();
  return (
    <form onSubmit={handleSubmit} role="search" id="searchForm">
      <input
        // ref={inputRef}
        type="text"
        name="city"
        id="city"
        placeholder="Location"
        style={{ backgroundColor: 'white' }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        value={searchTerm}
        required
      />
      <input type="submit" className="search-button" value="Go" />
    </form>
  );
}

export default SearchForm;
