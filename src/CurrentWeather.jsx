import React from 'react';
import PropTypes from 'prop-types';
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

function CurrentWeather({ data }) {
  // console.log(data);

  CurrentWeather.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.shape({
              clouds: PropTypes.number.isRequired,
              dew_point: PropTypes.number.isRequired,
              dt: PropTypes.number.isRequired,
              feels_like: PropTypes.number.isRequired,
              humidity: PropTypes.number.isRequired,
              pressure: PropTypes.number.isRequired,
              sunrise: PropTypes.number.isRequired,
              sunset: PropTypes.number.isRequired,
              temp: PropTypes.number.isRequired,
              uvi: PropTypes.number.isRequired,
              visibility: PropTypes.number.isRequired,
              wind_deg: PropTypes.number.isRequired,
              wind_gust: PropTypes.number.isRequired,
              wind_speed: PropTypes.number.isRequired,
              weather: PropTypes.arrayOf(
                PropTypes.shape({
                  description: PropTypes.string.isRequired,
                  icon: PropTypes.string.isRequired,
                  id: PropTypes.number.isRequired,
                  main: PropTypes.string.isRequired,
                }).isRequired,
              ).isRequired,
            }).isRequired,
            PropTypes.string.isRequired,
          ]).isRequired,
        ).isRequired,
        PropTypes.shape({
          country: PropTypes.string.isRequired,
          lat: PropTypes.number.isRequired,
          lon: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          state: PropTypes.string.isRequired,
        }).isRequired,
        PropTypes.func.isRequired,
        PropTypes.object.isRequired,
        PropTypes.bool.isRequired,
      ]).isRequired,
    ).isRequired,
  };

  const [
    [currentWeather, timezone],
    cityData,
    handleRefresh,
    loadingRef,
    weatherALerts,
  ] = data;
  loadingRef.current.style.visibility = 'hidden';

  return (
    currentWeather && (
      <div className={styles.currentWeather}>
        <div className={styles.topInfo}>
          <button
            type="button"
            onClick={handleRefresh}
            onKeyDown={handleRefresh}
          >
            <img className={styles.refresh} src={refresh} alt="Refresh Icon" />
          </button>
          {/* {getUTime()} */}
          {weatherALerts && (
            <img
              className={styles.warning}
              src={warning}
              alt="Weather Warning Icon"
              title="Weather warnings issued"
            />
          )}
        </div>
        <p className={styles.currentDate}>
          {getLongDate(currentWeather.dt, timezone)}
        </p>
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
