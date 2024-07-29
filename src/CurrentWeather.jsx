import React, { useRef } from 'react';
// Import PropTypes for prop validation
import CurrentWeatherPropTypes from './lib/CurrentWeatherPropTypes';

// Import utility functions
import {
  convertTemp,
  getCardinals,
  getWind,
  toUpper,
  getLongDate,
  getShortTime,
} from './lib/functions';

// Import image assets
import warning from './images/warning.png';
import refresh from './images/refresh.png';
import wind from './images/wind.png';
import sunrise from './images/sunrise.png';
import sunset from './images/sunset.png';

/**
 * CurrentWeather component displays the current weather information for a given city.
 * @param {object} currentWeather - The current weather data.
 * @param {string} timezone - The timezone of the current weather data.
 * @param {object} cityData - The city data associated with the current weather data.
 * @param {function} handleRefresh - The function to handle the refresh action.
 * @param {object} weatherAlerts - The weather alerts data.
 * @returns {JSX.Element} - The rendered CurrentWeather component.
 */
function CurrentWeather({
  currentWeather,
  timezone,
  cityData,
  handleRefresh,
  weatherAlerts,
}) {
  const refreshButton = useRef();

  return (
    currentWeather && (
      <div className={styles.currentWeather}>
        {/* Display the refresh and warning icons */}
        <div className={styles.topInfo}>
          <button
            type="button"
            onClick={() => {
              handleRefresh(refreshButton);
            }}
            onKeyDown={handleRefresh}
            ref={refreshButton}
          >
            <img className={styles.refresh} src={refresh} alt="Refresh Icon" />
          </button>
          {weatherAlerts && (
            <img
              className={styles.warning}
              src={warning}
              alt="Weather Warning Icon"
              title="Weather warnings issued"
            />
          )}
        </div>
        {/* Display the current date */}
        <p className={styles.currentDate}>{getLongDate(currentWeather.dt, timezone)}</p>
        {/* Display the city name, state, and country */}
        <h1>
          {cityData.name}, {cityData.state} ({cityData.country})
        </h1>
        {/* Display the latitude and longitude of the city */}
        <p className={styles.coords}>
          {cityData.lat.toFixed(6)}, {cityData.lon.toFixed(6)}
        </p>
        {/* Display the weather description and wind information */}
        <p className={styles.description}>
          {toUpper(currentWeather.weather[0].description)} with&nbsp;
          {getWind(currentWeather.wind_speed)}
        </p>
        {/* Display the temperature details */}
        <div className={styles.tempDetails}>
          {/* Display the weather icon and description */}
          <img
            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
            alt="Weather Icon"
            title={toUpper(currentWeather.weather[0].description)}
          />
          {/* Display the wind direction and speed */}
          <div className={styles.wind}>
            <img
              src={wind}
              style={{ rotate: `${currentWeather.wind_deg}deg` }}
              alt="Wind Icon"
              title={`From the ${getCardinals(currentWeather.wind_deg)}`}
            />
            <p>{Math.round(currentWeather.wind_speed)} mph</p>
          </div>
          {/* Display the temperature in Celsius and Fahrenheit */}
          <p>
            {convertTemp(currentWeather.temp)}
            &deg;C / {Math.round(currentWeather.temp)}
            &deg;F
            <br />
            {/* Display the feels like temperature */}
            <span className="feelsLike" style={{ fontSize: '0.8rem' }}>
              Feels like {convertTemp(currentWeather.feels_like)}
              &deg;C / {Math.round(currentWeather.feels_like)}
              &deg;F
            </span>
          </p>
        </div>
        {/* Display the wind gusts and sunrise/sunset times */}
        <div className={styles.sunrise}>
          {/* Display the wind gusts */}
          {currentWeather.wind_gust > 0 && (
            <p className={styles.gust}>
              Gusts of&nbsp;
              {Math.round(currentWeather.wind_gust)} mph
            </p>
          )}
          {/* Display the sunrise and sunset times */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '150px',
            }}
          >
            <img src={sunrise} alt="" />
            {getShortTime(currentWeather.sunrise)}
            <img src={sunset} alt="" />
            {getShortTime(currentWeather.sunset)}
          </div>
        </div>
      </div>
    )
  );
}

// Validate the props using PropTypes
CurrentWeather.propTypes = CurrentWeatherPropTypes;

// Export the CurrentWeather component
export default CurrentWeather;
