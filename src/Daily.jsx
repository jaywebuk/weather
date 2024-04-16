import React, { useState, useRef, useCallback } from 'react';
import { DailyPropTypes, DayPropTypes, HiddenDayPropTypes } from './lib/DailyPropTypes';
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

function Day({ dayData, timezone, onClick, index, openHiddenDay, hiddenDaySections, currentTime }) {
  const thisDaysDate = getShortDate(dayData.dt, timezone);
  const weatherIcon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  const weatherDescription = toUpper(dayData.weather[0].description);
  const ohd = openHiddenDay;

  const today = getShortDate(currentTime, timezone);
  const day = getShortDate(dayData.dt, timezone);

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
            title={`Wind from the ${getCardinals(dayData.wind_deg)}`}
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

function HiddenDay({ hiddenDaySections, dayData, index }) {
  const hds = hiddenDaySections;
  return (
    <section
      className={styles.hidden}
      ref={(e) => {
        hds.current[index] = e;
      }}
    >
      <p>{toUpper(dayData.weather[0].description)}</p>
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

function Daily({ data, currentTime, timezone = 'Europe/London' }) {
  const [previousHiddenDay, setPreviousHiddenDay] = useState({
    thisId: null,
    thisElem: null,
    hiddenElem: null,
  });
  const openHiddenDay = useRef([]);
  const hiddenDaySections = useRef([]);
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

Daily.propTypes = DailyPropTypes;
Day.propTypes = DayPropTypes;
HiddenDay.propTypes = HiddenDayPropTypes;

export default Daily;
