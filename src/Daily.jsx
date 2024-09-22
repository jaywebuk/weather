/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
// Import necessary modules and components
import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types'; // For typechecking
import styles from './styles/Daily.module.css';
import {
  convertTemp,
  toUpper,
  getShortDate,
  getCardinals,
  getWind,
  getShortTime,
  handleClick,
  getDay,
} from './lib/functions';
import wind from './images/wind.png';
import sun from './images/sun.png';
import moon from './images/moon.png';
import warning from './images/warning.png';

// Day component
function Day({
  dayData,
  timezone,
  onClick,
  index,
  openHiddenDay,
  hiddenDaySections,
  currentTime,
  weatherAlerts,
}) {
  // Extract relevant data from the dayData prop
  const thisDaysDate = getShortDate(dayData.dt, timezone);
  const thisDaysDateTS = dayData.dt;

  const weatherIcon = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  const weatherDescription = toUpper(dayData.weather[0].description);
  const ohd = openHiddenDay;

  // Check if the day is today or not
  const today = getShortDate(currentTime, timezone);
  const day = getShortDate(dayData.dt, timezone);

  let isAlert;

  if (weatherAlerts && weatherAlerts.length > 0) {
    isAlert = weatherAlerts.some(
      (alert) =>
        index < 7 &&
        (getDay(thisDaysDateTS) === getDay(alert.start) ||
          getDay(thisDaysDateTS) === getDay(alert.end)),
    );
  }

  // Render the Day component
  return (
    <button className={styles.dayDiv} type="button" onClick={(e) => onClick(e, index)}>
      <section
        className={styles.day}
        data-hidden={index}
        role="alert"
        tabIndex={index}
        title="Click to Expand / Close"
      >
        {weatherAlerts && isAlert && (
          <img
            className={styles.warning}
            src={warning}
            alt="Weather Warning Icon"
            title="Weather warnings issued for today"
          />
        )}
        <p>{today === day ? 'Today' : thisDaysDate}</p>
        <img src={weatherIcon} alt="Weather Icon" title={toUpper(weatherDescription)} />
        <div className={styles.wind}>
          <img
            src={wind}
            style={{ rotate: `${dayData.wind_deg}deg` }}
            alt=""
            title={`From the ${getCardinals(dayData.wind_deg)}`}
          />
          <p title={toUpper(getWind(Math.round(dayData.wind_speed)))}>
            {Math.round(dayData.wind_speed)} mph
          </p>
        </div>
        <div className={styles.dailyTemp}>
          <img src={sun} alt="Average temperature for the daytime" />
          <p>
            {convertTemp(dayData.temp.day)}
            &deg;C / {Math.round(dayData.temp.day)}
            &deg;F
          </p>
          <p
            className={styles.openHiddenDay}
            ref={(e) => {
              ohd.current[index] = e;
            }}
          >
            &gt;
          </p>
        </div>
        <div className={styles.dailyTemp}>
          <img src={moon} alt="Average temperature for the nightime" />
          <p>
            {convertTemp(dayData.temp.night)}
            &deg;C / {Math.round(dayData.temp.night)}
            &deg;F
          </p>
        </div>{' '}
      </section>
      <HiddenDay
        key={dayData.dt}
        hiddenDaySections={hiddenDaySections}
        dayData={dayData}
        index={index}
        isAlert={isAlert}
      />
    </button>
  );
}

// HiddenDay component
function HiddenDay({ hiddenDaySections, dayData, index, isAlert }) {
  // Render the HiddenDay component
  const hds = hiddenDaySections;
  return (
    <section
      className={styles.hidden}
      ref={(e) => {
        hds.current[index] = e;
      }}
    >
      {isAlert && <p>Weather Alerts Issued</p>}
      <p>{dayData.summary}</p>
      <p className={styles.wind}>
        {toUpper(getWind(Math.round(dayData.wind_speed)))} from the {getCardinals(dayData.wind_deg)}
      </p>
      <p>Pressure: {dayData.pressure} mb</p>
      <p>Chance of Precipitation: {Math.round(dayData.pop * 100)}%</p>
      <p>
        Sunrise: {getShortTime(dayData.sunrise)} Sunset: {getShortTime(dayData.sunset)}
      </p>
    </section>
  );
}

// Daily component
function Daily({ data, currentTime, timezone = 'Europe/London', weatherAlerts }) {
  // Initialize state and refs
  const [previousHiddenDay, setPreviousHiddenDay] = useState({
    thisId: null,
    thisElem: null,
    hiddenElem: null,
  });
  const openHiddenDay = useRef([]);
  const hiddenDaySections = useRef([]);

  // console.log(weatherAlerts[0].start);

  // Define the handleClickCallback function
  const handleClickCallback = useCallback(
    function handleClickCallback(e, i) {
      handleClick(
        e,
        i,
        hiddenDaySections,
        openHiddenDay,
        previousHiddenDay,
        setPreviousHiddenDay,
        styles,
      );
    },
    [previousHiddenDay],
  );

  // Render the Daily component
  const days = data.map((dayData, index) => (
    <Day
      key={dayData.dt}
      dayData={dayData}
      timezone={timezone}
      onClick={handleClickCallback}
      index={index}
      openHiddenDay={openHiddenDay}
      hiddenDaySections={hiddenDaySections}
      currentTime={currentTime}
      weatherAlerts={weatherAlerts}
    />
  ));

  return (
    <section className={styles.daily}>
      <header>
        <h1>Week Outlook</h1>
      </header>

      <div className={styles.dayBar}>{days}</div>
    </section>
  );
}

// Typechecking props for the components
Daily.propTypes = {
  currentTime: PropTypes.number.isRequired, // eslint-disable-next-line react/require-default-props
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ).isRequired,
      temp: PropTypes.shape({
        day: PropTypes.number.isRequired,
        night: PropTypes.number.isRequired,
      }).isRequired,
      wind_speed: PropTypes.number.isRequired,
      wind_deg: PropTypes.number.isRequired,
      pressure: PropTypes.number.isRequired,
      pop: PropTypes.number.isRequired,
      sunrise: PropTypes.number.isRequired,
      sunset: PropTypes.number.isRequired,
      summary: PropTypes.string.isRequired,
    }),
  ).isRequired,
  timezone: PropTypes.string,
  weatherAlerts: PropTypes.any,
};

Day.propTypes = {
  dayData: PropTypes.object.isRequired,
  timezone: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  openHiddenDay: PropTypes.object.isRequired,
  hiddenDaySections: PropTypes.object.isRequired,
  currentTime: PropTypes.number.isRequired,
  weatherAlerts: PropTypes.array,
};

HiddenDay.propTypes = {
  dayData: PropTypes.shape({
    dt: PropTypes.number.isRequired,
    pop: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
    sunrise: PropTypes.number.isRequired,
    sunset: PropTypes.number.isRequired,
    temp: PropTypes.shape({
      day: PropTypes.number.isRequired,
      night: PropTypes.number.isRequired,
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
    wind_deg: PropTypes.number.isRequired,
    wind_speed: PropTypes.number.isRequired,
  }).isRequired,
  hiddenDaySections: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.any),
  }),
  index: PropTypes.number.isRequired,
  isAlert: PropTypes.any,
};

// Export the Daily component
export default Daily;
