import PropTypes from 'prop-types';
import React from 'react';

function MultipleResults({ data }) {
  // console.log(data);

  MultipleResults.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            country: PropTypes.string.isRequired,
            lat: PropTypes.number.isRequired,
            lon: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
          }).isRequired,
        ).isRequired,
        PropTypes.func.isRequired,
        PropTypes.object.isRequired,
      ]).isRequired,
    ).isRequired,
  };

  const [cityData, setData, loadingRef] = data;
  function handleChange(thisData) {
    const { selectedIndex } = thisData.target.options;
    const { lat } = thisData.target.options[selectedIndex].dataset;
    const { lon } = thisData.target.options[selectedIndex].dataset;

    const keys = Object.keys(cityData);
    // console.log(cityData[0].lat);

    keys.forEach((key) => {
      // console.log(cityData[key].lat, parseFloat(lat));
      if (
        cityData[key].lat === parseFloat(lat) &&
        cityData[key].lon === parseFloat(lon)
      ) {
        setData(cityData[key]);
        // console.log(cityData[key]);
      }
    });
  }

  const extractData = () => {
    loadingRef.current.style.visibility = 'hidden';
    let id = 0;
    let options = {};
    return cityData.map((city) => {
      options = {
        id: `city-${id}`,
        'data-lat': city.lat,
        'data-lon': city.lon,
        key: (id += 1),
      };
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <option {...options}>
          {`${city.name} (${city.country}) ${city.lat.toFixed(
            6,
          )}, ${city.lon.toFixed(6)}`}
        </option>
      );
    });
  };

  return (
    <>
      <p>Multiple results were found! Please choose a city below.</p>

      <form className="multipleForm">
        <select onChange={handleChange} size={cityData.length}>
          {extractData()}
        </select>
      </form>
    </>
  );
}

export default MultipleResults;
