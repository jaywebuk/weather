import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import CurrentWeatherPropTypes from './lib/CurrentWeatherPropTypes';
import styles from './styles/CurrentWeather.module.css';
import {
  convertTemp,
  getCardinals,
  getWind,
  toUpper,
  getLongDate,
  getShortTime,
} from './lib/functions';
import warning from './images/warning.png';
import refresh from './images/refresh.png';
import wind from './images/wind.png';
import sunrise from './images/sunrise.png';
import sunset from './images/sunset.png';

function CurrentWeather({
  currentWeather,
  timezone,
  cityData,
  handleRefresh,
  loadingRef,
  weatherAlerts,
}) {
  CurrentWeather.propTypes = CurrentWeatherPropTypes;
  const loading = loadingRef;
  const refreshButton = useRef();

  loading.current.style.visibility = 'hidden';

  return (
    currentWeather && (
      <div className={styles.currentWeather}>
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
        <p className={styles.currentDate}>{getLongDate(currentWeather.dt, timezone)}</p>
        <h1>
          {cityData.name}, {cityData.state} ({cityData.country})
        </h1>
        <p className={styles.coords}>
          {cityData.lat.toFixed(6)},{cityData.lon.toFixed(6)}
        </p>
        <p className={styles.description}>
          {toUpper(currentWeather.weather[0].description)} with&nbsp;
          {getWind(currentWeather.wind_speed)}
        </p>
        <div className={styles.tempDetails}>
          <img
            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
            alt="Weather Icon"
            title={toUpper(currentWeather.weather[0].description)}
          />
          <div className={styles.wind}>
            <img
              src={wind}
              style={{ rotate: `${currentWeather.wind_deg}deg` }}
              alt="Wind Icon"
              title={`From the ${getCardinals(currentWeather.wind_deg)}`}
            />
            <p>{Math.round(currentWeather.wind_speed)} mph</p>
          </div>
          <p>
            {convertTemp(currentWeather.temp)}
            &deg;C /{Math.round(currentWeather.temp)}
            &deg;F
            <br />
            <span className="feelsLike" style={{ fontSize: '0.8rem' }}>
              Feels like {convertTemp(currentWeather.feels_like)}
              &deg;C / {Math.round(currentWeather.feels_like)}
              &deg;F
            </span>
          </p>
        </div>
        <div className={styles.sunrise}>
          {currentWeather.wind_gust > 0 && (
            <p className={styles.gust}>
              Gusts of&nbsp;
              {Math.round(currentWeather.wind_gust)} mph
            </p>
          )}
          {!currentWeather.wind_gust && <p className={styles.gust} />}
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

export default CurrentWeather;
