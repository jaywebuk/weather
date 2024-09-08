import React, { useState, useRef, useCallback } from 'react';
import { HourlyPropTypes, HourPropTypes, HiddenHourPropTypes } from './lib/HourlyPropTypes';
import styles from './styles/Hourly.module.css';
import {
  convertTemp,
  toUpper,
  getTime,
  getShortTime,
  getCardinals,
  getWind,
  getDay,
  handleClick,
} from './lib/functions';
import wind from './images/wind.png';

function Hour({
  hourData,
  timezone,
  onClick,
  index,
  openHiddenHour,
  hiddenHourSections,
  currentTime,
}) {
  const todayTime = getTime(hourData.dt, timezone);
  const currentShortTime = getShortTime(hourData.dt, timezone);
  const weatherIcon = `https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png`;
  const weatherDescription = toUpper(hourData.weather[0].description);
  const ohh = openHiddenHour;

  const today = getDay(currentTime, timezone);
  const day = getDay(hourData.dt, timezone);

  return (
    <button className={styles.hourDiv} type="button" onClick={(e) => onClick(e, index)}>
      <section
        className={styles.hour}
        role="alert"
        data-hidden={index}
        tabIndex={index}
        title="Click to Expand / Close"
        key={currentShortTime}
      >
        {/* We show just the time */}
        {today === day && <p>{currentShortTime}</p>}
        {/* We show the day and the time because it is the next day */}
        {today !== day && <p>{todayTime}</p>}{' '}
        <img src={weatherIcon} alt={weatherDescription} title={weatherDescription} />
        <div className={styles.wind}>
          <img
            src={wind}
            style={{ rotate: `${hourData.wind_deg}deg` }}
            alt=""
            title={`From the ${getCardinals(hourData.wind_deg)}`}
          />
          <p title={toUpper(getWind(Math.round(hourData.wind_speed)))}>
            {Math.round(hourData.wind_speed)} mph
          </p>
        </div>
        <p className={styles.gust}>Gusts: {Math.round(hourData.wind_gust)}mph</p>
        <p>
          {convertTemp(hourData.temp)}
          &deg;C / {Math.round(hourData.temp)}
          &deg;F
        </p>
        <p
          className={styles.openHiddenHour}
          ref={(e) => {
            ohh.current[index] = e;
          }}
        >
          &gt;
        </p>
      </section>
      <HiddenHour
        key={hourData.dt}
        hiddenHourSections={hiddenHourSections}
        hourData={hourData}
        index={index}
        weatherDescription={weatherDescription}
      />
    </button>
  );
}

function HiddenHour({ hiddenHourSections, hourData, index, weatherDescription }) {
  const hhs = hiddenHourSections;
  return (
    <section
      className={`${styles.hidden}`}
      ref={(e) => {
        hhs.current[index] = e;
      }}
    >
      <p>{weatherDescription}</p>
      <p className={styles.wind}>
        {toUpper(getWind(Math.round(hourData.wind_speed)))} from the{' '}
        {getCardinals(hourData.wind_deg)}
      </p>
      <p>
        Feels Like: {convertTemp(hourData.feels_like)}
        &deg;C / {Math.round(hourData.feels_like)}
        &deg;F
      </p>
      <p>Pressure: {hourData.pressure} mb</p>
      <p>Chance of Precipitation: {Math.round(hourData.pop * 100)}%</p>
    </section>
  );
}

function Hourly({ data, currentTime, timezone = 'Europe/London' }) {
  const [previousHiddenHour, setPreviousHiddenHour] = useState({
    thisId: null,
    thisElem: null,
    hiddenElem: null,
  });
  const openHiddenHour = useRef([]);
  const hiddenHourSections = useRef([]);

  const handleClickCallback = useCallback(
    function handleClickCallback(e, i) {
      handleClick(
        e,
        i,
        hiddenHourSections,
        openHiddenHour,
        previousHiddenHour,
        setPreviousHiddenHour,
        styles,
      );
    },
    [previousHiddenHour],
  );

  const hours = data.map((hourData, index) => (
    <Hour
      key={hourData.dt}
      hourData={hourData}
      timezone={timezone}
      onClick={handleClickCallback}
      index={index}
      openHiddenHour={openHiddenHour}
      hiddenHourSections={hiddenHourSections}
      currentTime={currentTime}
    />
  ));

  return (
    <section className={styles.hourly}>
      <header>
        <h1>Next 48 Hours</h1>
      </header>

      <div className={styles.hourBar}>{hours}</div>
    </section>
  );
}

Hourly.propTypes = HourlyPropTypes;
Hour.propTypes = HourPropTypes;
HiddenHour.propTypes = HiddenHourPropTypes;

export default Hourly;
