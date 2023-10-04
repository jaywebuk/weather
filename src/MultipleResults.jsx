import React from 'react';
// import PropTypes from 'prop-types';
import MultipleResultsPropTypes from './lib/MultipleResultsPropTypes';

function MultipleResults({ data, setData, loadingRef }) {
  // console.log(data, setData, loadingRef);

  MultipleResults.propTypes = MultipleResultsPropTypes;
  const loading = loadingRef;

  function handleChange(thisData) {
    const { selectedIndex } = thisData.target.options;
    const { lat } = thisData.target.options[selectedIndex].dataset;
    const { lon } = thisData.target.options[selectedIndex].dataset;

    const keys = Object.keys(data);

    keys.forEach((key) => {
      if (data[key].lat === parseFloat(lat) && data[key].lon === parseFloat(lon)) {
        setData(data[key]);
      }
    });
  }

  const extractData = () => {
    loading.current.style.visibility = 'hidden';
    let id = 0;
    // let options = {};
    return data.map((city) => {
      /* options = {
        id: `city-${id}`,
        'data-lat': city.lat,
        'data-lon': city.lon,
        key: (id += 1),
      }; */
      id += 1;
      return (
        // <option {...options}>
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
