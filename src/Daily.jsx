import React, { useState, useRef, useMemo, useCallback, memo } from 'react';
import { DailyPropTypes, DayPropTypes, HiddenDayPropTypes } from './lib/DailyPropTypes';
import styles from './styles/Daily.module.css';
import {
  convertTemp,
  toUpper,
  getShortDate,
  getCardinals,
  getWind,
  getShortTime,
} from './lib/functions';
import wind from './images/wind.png';
import sun from './images/sun.png';
import moon from './images/moon.png';

const Day = memo(function Day({
  dayData,
  timezone,
  onClick,
  index,
  openHiddenDays,
  hiddenDaySections,
  currentTime,
}) {
  const thisDaysDate = getShortDate(dayData.dt, timezone);
  const weatherIcon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  const weatherDescription = toUpper(dayData.weather[0].description);
  const ohd = openHiddenDays;

  const today = getShortDate(currentTime, timezone);
  const day = getShortDate(dayData.dt, timezone);

  return (
    <div className={styles.dayDiv}>
      <section
        className={styles.day}
        onClick={(e) => onClick(e, index)}
        onKeyDown={() => null}
        data-hidden={index}
        role="button"
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
    </div>
  );
});

const HiddenDay = memo(function HiddenDay({ hiddenDaySections, dayData, index }) {
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
      </p>{' '}
    </section>
  );
});

const Daily = memo(function Daily({ data, currentTime, timezone = 'Europe/London' }) {
  const [previousState, setPreviousState] = useState({
    dayId: null,
    dayElem: null,
    hiddenDay: null,
  });
  const openHiddenDays = useRef([]);
  const hiddenDaySections = useRef([]);
  const showHiddenDay = (element, thisDayElem, openDay) => {
    const day = openDay;
    element.classList.add(styles['show-hidden-day']);
    thisDayElem.classList.add(styles['day-selected']);
    day.innerHTML = '&lt;';
  };

  const smoothScrollIntoView = (element) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  };

  const hideHiddenDay = useCallback(
    function hideHiddenDay(element) {
      element.classList.remove(styles['show-hidden-day']);
      previousState.dayElem.classList.remove(styles['day-selected']);
      previousState.hiddenDay.innerHTML = '&gt;';
    },
    [previousState.dayElem, previousState.hiddenDay],
  );

  const handleClick = useCallback(
    function handleClick(e, i) {
      const hiddenId = hiddenDaySections.current[i];
      const thisDayElem = e.target.closest('section');
      const openDay = openHiddenDays.current[i];
      if (hiddenId === previousState.dayId) {
        if (hiddenId.classList.contains(styles['show-hidden-day'])) {
          hideHiddenDay(hiddenId);
        } else {
          showHiddenDay(hiddenId, thisDayElem, openDay);
        }
      } else {
        showHiddenDay(hiddenId, thisDayElem, openDay);
        if (previousState.dayId !== null) {
          hideHiddenDay(previousState.dayId);
        }
      }

      smoothScrollIntoView(thisDayElem);
      smoothScrollIntoView(hiddenId);

      setPreviousState((prevState) => ({
        ...prevState,
        dayId: hiddenId,
        dayElem: thisDayElem,
        hiddenDay: openDay,
      }));
    },
    [hideHiddenDay, previousState.dayId],
  );

  const days = useMemo(() => {
    return data.map((dayData, index) => (
      <Day
        key={dayData.dt}
        dayData={dayData}
        timezone={timezone}
        onClick={handleClick}
        index={index}
        openHiddenDays={openHiddenDays}
        hiddenDaySections={hiddenDaySections}
        currentTime={currentTime}
      />
    ));
  }, [currentTime, data, handleClick, timezone]);

  return (
    <section className={styles.daily}>
      <header>
        <h1>Week Outlook</h1>
      </header>

      <div className={styles.dayBar}>{days}</div>
    </section>
  );
});

Daily.propTypes = DailyPropTypes;
Day.propTypes = DayPropTypes;
HiddenDay.propTypes = HiddenDayPropTypes;

export default Daily;
