/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ShowWeatherPropTypes from './lib/ShowWeatherPropTypes';
import CurrentWeather from './CurrentWeather';
import Alerts from './Alerts';
import Hourly from './Hourly';
import Daily from './Daily';

function ShowWeather({ data, loadingRef }) {
  const loading = loadingRef;
  const [weatherData, setWeatherData] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
  const [consoleCount, setConsoleCount] = useState(1);
  const [fetchCount, setFetchCount] = useState(0);
  // const refButt = useRef(null);
  const handleRefresh = (refreshButton) => {
    const refButt = refreshButton;
    setFetchCount(0);
    if (!refButt.current) return;
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

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  };

  /* useEffect(() => {
    return handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

  useEffect(() => {
    setFetchCount((prevCount) => prevCount + 1);
    if (fetchCount >= 1) return;
    loading.current.style.visibility = 'visible';
    const { lat, lon } = data;

    const options = {
      method: 'GET',
      url: `http://localhost:5000/weather/location?lat=${lat}&lon=${lon}`,
    };
    axios
      .request(options)
      .then((response) => {
        console.log(consoleCount, response.data);
        setConsoleCount((prevCount) => prevCount + 1);

        setWeatherData(() => response.data);
        setWeatherAlerts(response.data.alerts !== undefined);
      })
      .catch((error) => {
        console.error(error);
      });
    // /eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

  return (
    weatherData && (
      <>
        <CurrentWeather
          currentWeather={weatherData.current}
          timezone={weatherData.timezone}
          cityData={data}
          handleRefresh={handleRefresh}
          loadingRef={loadingRef}
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
          timezone={weatherData.timezone}
          weatherAlerts={weatherData.alerts}
        />
        {/* {console.log(weatherData.daily)} */}
      </>
    )
  );
}

ShowWeather.propTypes = ShowWeatherPropTypes;

export default ShowWeather;
