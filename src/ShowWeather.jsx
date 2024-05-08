import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ShowWeatherPropTypes from './lib/ShowWeatherPropTypes';
import CurrentWeather from './CurrentWeather';
import Alerts from './Alerts';
import Hourly from './Hourly';
import Daily from './Daily';

function ShowWeather({ data, setLoading }) {
  const [weatherData, setWeatherData] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [longLoading, setLongLoading] = useState(false);
  const [abortFetch, setAbortFetch] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRefresh = (refreshButton) => {
    const refButt = refreshButton;
    setFetchCount(0);
    if (!refButt.current) return undefined;
    refButt.current.setAttribute('disabled', 'disabled');
    refButt.current.style.opacity = '0.3';
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
    const delay = target - now;
    const timeoutId = setTimeout(() => {
      if (!refButt.current) return;

      refButt.current.removeAttribute('disabled');
      refButt.current.style.opacity = '1';
    }, delay);

    setRefreshData(!refreshData);

    return () => clearTimeout(timeoutId);
  };

  function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);

    return abortController.signal;
  }

  useEffect(() => {
    setFetchCount((prevCount) => prevCount + 1);
    if (fetchCount >= 1) return undefined;
    setRequestError(null);
    setLoading('visible');
    const { lat, lon } = data;

    const timeoutId = setTimeout(() => {
      setLongLoading(true);
    }, 10000);

    const options = {
      method: 'GET',
      // url: `http://192.168.1.81:5000/weather/location?lat=${lat}&lon=${lon}`,
      url: `http://localhost:5000/weather/location?lat=${lat}&lon=${lon}`,
      signal: newAbortSignal(30000),
    };
    axios
      .request(options)
      .then((response) => {
        setWeatherData(() => response.data);
        setWeatherAlerts(response.data.alerts !== undefined);
        clearTimeout(timeoutId);
        setLongLoading(false);
        setLoading('hidden');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Shucks, an error occurred. Please try again.');
        setLongLoading(false);
        clearTimeout(timeoutId);
        setAbortFetch(true);
        setLoading('hidden');
        setRequestError(error.response.data);
      });

    return () => {
      clearTimeout(timeoutId);
      setLongLoading(false);
      setAbortFetch(false);
      setLoading('hidden');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

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
