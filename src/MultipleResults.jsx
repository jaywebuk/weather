import React from 'react';
import MultipleResultsPropTypes from './lib/MultipleResultsPropTypes'; // Import custom propTypes for this component

/**
 * MultipleResults component displays a list of cities with their respective countries and coordinates.
 * When a city is selected, the component updates the data and loading state.
 *
 * @param {Object} data - An array of city objects containing name, country, lat, and lon properties.
 * @param {Function} setData - A callback function to update the data state.
 * @param {Function} setLoading - A callback function to update the loading state.
 * @returns {JSX.Element} - Rendered MultipleResults component.
 */
function MultipleResults({ data, setData, setLoading }) {
  // Prop validation using custom propTypes
  MultipleResults.propTypes = MultipleResultsPropTypes;

  /**
   * handleChange - Updates the data and loading state when a city is selected.
   *
   * @param {Object} thisData - The event target object containing the selected city data.
   */
  function handleChange(thisData) {
    const { selectedIndex } = thisData.target.options;
    const { lat } = thisData.target.options[selectedIndex].dataset;
    const { lon } = thisData.target.options[selectedIndex].dataset;

    // Iterate through the data array to find the selected city and update the data state
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key].lat === parseFloat(lat) && data[key].lon === parseFloat(lon)) {
        setData(data[key]);
      }
    });
  }

  /**
   * extractData - Extracts the city data and returns an array of options for the select element.
   *
   * @returns {JSX.Element[]} - An array of option elements containing city data.
   */
  const extractData = () => {
    setLoading('hidden'); // Hide the loading state
    let id = 0;
    return data.map((city) => {
      id += 1;
      return (
        <option id={`city-${id}`} data-lat={city.lat} data-lon={city.lon} key={id}>
          {`${city.name} (${city.country}) ${city.lat.toFixed(6)}, ${city.lon.toFixed(6)}`}
        </option>
      );
    });
  };

  return (
    <>
      <p>Multiple results were found! Please choose a city below.</p>

      <form className="multipleForm">
        <select onChange={handleChange} size={data.length}>
          {extractData()}
        </select>
      </form>
    </>
  );
}

export default MultipleResults;
