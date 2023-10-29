import React from 'react';
import MultipleResultsPropTypes from './lib/MultipleResultsPropTypes';

function MultipleResults({ data, setData, setLoading }) {
  MultipleResults.propTypes = MultipleResultsPropTypes;

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
    setLoading('hidden');
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
