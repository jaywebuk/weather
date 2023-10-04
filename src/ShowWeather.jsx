// import PropTypes from 'prop-types';

import axios from 'axios';
import { useState, useEffect } from 'react';
import ShowWeatherPropTypes from './lib/ShowWeatherPropTypes';
import CurrentWeather from './CurrentWeather';
import Alerts from './Alerts';
import Hourly from './Hourly';
import Daily from './Daily';

function ShowWeather({ data, loadingRef }) {
  // console.log(data, loadingRef);

  ShowWeather.propTypes = ShowWeatherPropTypes;
  const loading = loadingRef;

  // const [data, loadingRef] = data;
  const [weatherData, setWeatherData] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
  const [consoleCount, setConsoleCount] = useState(1);

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  useEffect(() => {
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

        setWeatherData(response.data);
        setWeatherAlerts(response.data.alerts !== undefined);
      })
      .catch((error) => {
        console.error(error);
      });
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
        <Hourly data={weatherData.hourly} timezone={weatherData.timezone} />
        <Daily data={weatherData.daily} timezone={weatherData.timezone} />
        {/* {console.log(weatherData.daily)} */}
      </>
    )
  );
}

export default ShowWeather;
