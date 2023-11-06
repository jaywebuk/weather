import React, { useState, useRef, useCallback, memo, useMemo } from 'react';
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
  smoothScrollIntoView,
} from './lib/functions';
import wind from './images/wind.png';

const Hour = memo(function Hour({
  hourData,
  timezone,
  onClick,
  index,
  openHiddenHours,
  hiddenHourSections,
  currentTime,
}) {
  const todayTime = getTime(hourData.dt, timezone);
  const currentShortTime = getShortTime(hourData.dt, timezone);
  const weatherIcon = `http://openweathermap.org/img/wn/${hourData.weather[0].icon}.png`;
  const weatherDescription = toUpper(hourData.weather[0].description);
  const ohh = openHiddenHours;

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
            title={`Wind from the ${getCardinals(hourData.wind_deg)}`}
          />
          <p title={toUpper(getWind(Math.round(hourData.wind_speed)))}>
            {Math.round(hourData.wind_speed)} mph
          </p>
        </div>
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
});

const HiddenHour = memo(function HiddenHour({
  hiddenHourSections,
  hourData,
  index,
  weatherDescription,
}) {
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
});

function Hourly({ data, currentTime, timezone = 'Europe/London' }) {
  const [previousState, setPreviousState] = useState({
    hourId: null,
    hourElem: null,
    hiddenHour: null,
  });
  const openHiddenHours = useRef([]);
  const hiddenHourSections = useRef([]);
  const showHiddenHour = useCallback(function showHiddenHour(element, thisHourElem, openHour) {
    const hour = openHour;
    element.classList.add(styles['show-hidden-hour']);
    thisHourElem.classList.add(styles['hour-selected']);
    hour.innerHTML = '&lt;';
  }, []);

  const hideHiddenHour = useCallback(
    function hideHiddenHour(element) {
      element.classList.remove(styles['show-hidden-hour']);
      previousState.hourElem.classList.remove(styles['hour-selected']);
      previousState.hiddenHour.innerHTML = '&gt;';
    },
    [previousState.hiddenHour, previousState.hourElem],
  );

  const handleClick = useCallback(
    function handleClick(e, i) {
      const hiddenId = hiddenHourSections.current[i];
      const thisHourElem = e.target.closest('section');
      const openHour = openHiddenHours.current[i];
      if (hiddenId === previousState.hourId) {
        if (hiddenId.classList.contains(styles['show-hidden-hour'])) {
          hideHiddenHour(hiddenId);
        } else {
          showHiddenHour(hiddenId, thisHourElem, openHour);
        }
      } else {
        showHiddenHour(hiddenId, thisHourElem, openHour);
        if (previousState.hourId !== null) {
          hideHiddenHour(previousState.hourId);
        }
      }

      smoothScrollIntoView(thisHourElem);
      smoothScrollIntoView(hiddenId);

      setPreviousState((prevState) => ({
        ...prevState,
        hourId: hiddenId,
        hourElem: thisHourElem,
        hiddenHour: openHour,
      }));
    },
    [previousState.hourId, hideHiddenHour],
  );

  const hours = useMemo(() => {
    return data.map((hourData, index) => (
      <Hour
        key={hourData.dt}
        hourData={hourData}
        timezone={timezone}
        onClick={handleClick}
        index={index}
        openHiddenHours={openHiddenHours}
        hiddenHourSections={hiddenHourSections}
        currentTime={currentTime}
      />
    ));
  }, [currentTime, data, handleClick, timezone]);

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
