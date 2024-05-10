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
} from './lib/functions';
import wind from './images/wind.png';
import sun from './images/sun.png';
import moon from './images/moon.png';

// Day component
function Day({ dayData, timezone, onClick, index, openHiddenDay, hiddenDaySections, currentTime }) {
  // Extract relevant data from the dayData prop
  const thisDaysDate = getShortDate(dayData.dt, timezone);
  const weatherIcon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  const weatherDescription = toUpper(dayData.weather[0].description);

  // Check if the day is today or not
  const today = getShortDate(currentTime, timezone);
  const day = getShortDate(dayData.dt, timezone);

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
        {today === day && <p>Today</p>}
        {today !== day && <p>{thisDaysDate}</p>}
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
      />
    </button>
  );
}

// HiddenDay component
function HiddenDay({ hiddenDaySections, dayData, index }) {
  // Render the HiddenDay component
  return (
    <section
      className={styles.hidden}
      ref={(e) => {
        hds.current[index] = e;
      }}
    >
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
function Daily({ data, currentTime, timezone = 'Europe/London' }) {
  // Initialize state and refs
  const [previousHiddenDay, setPreviousHiddenDay] = useState({
    thisId: null,
    thisElem: null,
    hiddenElem: null,
  });
  const openHiddenDay = useRef([]);
  const hiddenDaySections = useRef([]);

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
  currentTime: PropTypes.number.isRequired,
  timezone: PropTypes.string,
};

Day.propTypes = {
  dayData: PropTypes.shape({
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
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  openHiddenDay: PropTypes.shape({ current: PropTypes.arrayOf(PropTypes.any) }),
  hiddenDaySections: PropTypes.shape({ current: PropTypes.arrayOf(PropTypes.any) }),
  currentTime: PropTypes.number.isRequired,
};

HiddenDay.propTypes = {
  hiddenDaySections: PropTypes.shape({ current: PropTypes.arrayOf(PropTypes.any) }),
  dayData: PropTypes.shape({
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
  }).isRequired,
  index: PropTypes.number.isRequired,
};

// Export the Daily component
export default Daily;
