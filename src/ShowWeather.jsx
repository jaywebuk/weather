import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ShowWeatherPropTypes from './lib/ShowWeatherPropTypes';
import CurrentWeather from './CurrentWeather';
import Alerts from './Alerts';
import Hourly from './Hourly';
import Daily from './Daily';

function ShowWeather({ data, setLoading }) {
  // Declare state variables
  const [weatherData, setWeatherData] = useState(); // To store the weather data
  const [refreshData, setRefreshData] = useState(false); // To control the refresh functionality
  const [weatherAlerts, setWeatherAlerts] = useState(false); // To store the weather alerts
  const [fetchCount, setFetchCount] = useState(0); // To count the number of fetches
  const [longLoading, setLongLoading] = useState(false); // To indicate long loading
  const [abortFetch, setAbortFetch] = useState(false); // To indicate if the fetch was aborted
  const [requestError, setRequestError] = useState(null); // To store any request errors
  const [errorMessage, setErrorMessage] = useState(null); // To store any error messages

  // handleRefresh function handles the refresh button click event
  const handleRefresh = (refreshButton) => {
    const refButt = refreshButton;
    setFetchCount(0);
    if (!refButt.current) return undefined;
    refButt.current.setAttribute('disabled', 'disabled'); // Disable the refresh button
    refButt.current.style.opacity = '0.3'; // Set the opacity of the refresh button to 0.3
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 2,
      0,
      0,
    );
    const delay = target - now; // Calculate the delay before enabling the refresh button
    const timeoutId = setTimeout(() => {
      if (!refButt.current) return;

      refButt.current.removeAttribute('disabled'); // Enable the refresh button
      refButt.current.style.opacity = '1'; // Set the opacity of the refresh button to 1
    }, delay);

    setRefreshData(!refreshData); // Toggle the refreshData state variable

    return () => clearTimeout(timeoutId); // Clear the timeout when the component unmounts
  };

  // useEffect hook to fetch the weather data
  useEffect(() => {
    setFetchCount((prevCount) => prevCount + 1);
    if (fetchCount >= 1) return undefined;
    setRequestError(null);
    setLoading('visible'); // Set the loading state variable to 'visible'
    const { lat, lon } = data;

    const timeoutId = setTimeout(() => {
      setLongLoading(true); // Set the longLoading state variable to true if the request takes too long
    }, 10000);

    const options = {
      method: 'GET',
      // url: `http://192.168.1.81:6010/weather/location?lat=${lat}&lon=${lon}`,
      url: `https://localhost:6010/weather/location?lat=${lat}&lon=${lon}`,
      timeout: 30000,
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setWeatherData(() => response.data); // Set the weather data
        setWeatherAlerts(response.data.alerts !== undefined); // Set the weather alerts
        clearTimeout(timeoutId); // Clear the timeout
        setLongLoading(false); // Set the longLoading state variable to false
        setLoading('hidden'); // Set the loading state variable to 'hidden'
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Shucks, an error occurred. Please try again.');
        setLongLoading(false);
        clearTimeout(timeoutId);
        setAbortFetch(true);
        setLoading('hidden');
        if (error.response.data) {
          setRequestError(error.response.data);
        }
      });

    return () => {
      clearTimeout(timeoutId); // Clear the timeout when the component unmounts
      setLongLoading(false); // Set the longLoading state variable to false
      setAbortFetch(false); // Set the abortFetch state variable to false
      setLoading('hidden'); // Set the loading state variable to 'hidden'
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]); // Run the effect when the refreshData state variable changes

  return (
    <>
      {errorMessage && <div>{errorMessage}</div>}
      {longLoading && (
        <div>
          <p>This is taking longer than usual. Please wait...</p>
        </div>
      )}
      {abortFetch && !requestError && (
        <div>
          <p>Request took too long or there was a connection error. Please try again.</p>
        </div>
      )}
      {weatherData && (
        <>
          <CurrentWeather
            currentWeather={weatherData.current}
            timezone={weatherData.timezone}
            cityData={data}
            handleRefresh={handleRefresh}
            weatherAlerts={weatherAlerts}
          />
          {weatherAlerts && <Alerts data={weatherData.alerts} timezone={weatherData.timezone} />}
          <Hourly
            data={weatherData.hourly}
            currentTime={weatherData.current.dt}
            timezone={weatherData.timezone}
            timezoneOffset={weatherData.timezone_offset}
          />
          <Daily
            data={weatherData.daily}
            currentTime={weatherData.current.dt}
            timezone={weatherData.timezone}
            weatherAlerts={weatherData.alerts}
          />
        </>
      )}
      {requestError && <p>{requestError.error}</p>}
      {/* {weatherData && console.log(weatherData)} */}
    </>
  );
}

ShowWeather.propTypes = ShowWeatherPropTypes;

export default ShowWeather;
