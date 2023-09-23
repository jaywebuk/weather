import axios from 'axios';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CurrentWeather from './CurrentWeather';
import Alerts from './Alerts';
import Hourly from './Hourly';
import Daily from './Daily';

function ShowWeather({ data }) {
  const [cityData, loadingRef] = data;

  ShowWeather.propTypes = {
    data: PropTypes.arrayOf.isRequired,
  };

  // console.log(cityData);
  const [weatherData, setWeatherData] = useState();
  const [refreshData, setRefreshData] = useState();
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  const handleRefresh = () => {
    // e.preventDefault();
    setRefreshData(!refreshData);
  };
  useEffect(() => {
    loadingRef.current.style.visibility = 'visible';
    const { lat } = cityData;
    const { lon } = cityData;
    // console.log(lat, lon);
    // console.log("cityData", cityData[0]);

    const options = {
      method: 'GET',
      url: `http://localhost:5000/weather/location?lat=${lat}&lon=${lon}`,
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setWeatherData(response.data);
        setWeatherAlerts(typeof response.data.alerts !== 'undefined');
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {};
  }, [refreshData, cityData]);
  return (
    weatherData && (
      <>
        <CurrentWeather
          data={[
            [weatherData.current, weatherData.timezone],
            cityData,
            handleRefresh,
            loadingRef,
            weatherAlerts,
          ]}
        />
        {weatherAlerts && (
          <Alerts data={[weatherData.alerts, weatherData.timezone]} />
        )}
        <Hourly data={[weatherData.hourly, weatherData.timezone]} />
        <Daily data={[weatherData.daily, weatherData.timezone]} />
        {/* <pre>{JSON.stringify(weatherData)}</pre> */}
        {/* <pre>{JSON.stringify(cityData)}</pre> */}
        {/* {console.log("weatherData", weatherData)} */}
      </>
    )
  );
}

export default ShowWeather;
