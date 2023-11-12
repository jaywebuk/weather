import React, { useState, useRef, useCallback, memo, useMemo } from 'react';
import { DailyPropTypes, DayPropTypes, HiddenDayPropTypes } from './lib/DailyPropTypes';
import styles from './styles/Daily.module.css';
import {
  convertTemp,
  toUpper,
  getShortDate,
  getCardinals,
  getWind,
  getShortTime,
  smoothScrollIntoView,
  hideHiddenElement,
  showHiddenElement,
} from './lib/functions';
import wind from './images/wind.png';
import sun from './images/sun.png';
import moon from './images/moon.png';

const Day = memo(function Day({
  dayData,
  timezone,
  onClick,
  index,
  openHiddenElem,
  hiddenElemSections,
  currentTime,
}) {
  const thisDaysDate = getShortDate(dayData.dt, timezone);
  const weatherIcon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  const weatherDescription = toUpper(dayData.weather[0].description);
  const ohd = openHiddenElem;

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
        hiddenElemSections={hiddenElemSections}
        dayData={dayData}
        index={index}
      />
    </button>
  );
});

const HiddenDay = memo(function HiddenDay({ hiddenElemSections, dayData, index }) {
  const hds = hiddenElemSections;
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
});

function Daily({ data, currentTime, timezone = 'Europe/London' }) {
  const [previousState, setPreviousState] = useState({
    thisId: null,
    thisElem: null,
    hiddenElem: null,
  });
  const openHiddenElem = useRef([]);
  const hiddenElemSections = useRef([]);

  const handleClick = useCallback(
    function handleClick(e, i) {
      const hiddenId = hiddenElemSections.current[i];
      const thisElem = e.target.closest('section');
      const openElem = openHiddenElem.current[i];
      if (hiddenId === previousState.thisId) {
        if (hiddenId.classList.contains(styles['show-hidden-elem'])) {
          hideHiddenElement(hiddenId, styles, previousState);
        } else {
          showHiddenElement(hiddenId, thisElem, openElem, styles);
        }
      } else {
        showHiddenElement(hiddenId, thisElem, openElem, styles);
        if (previousState.thisId !== null) {
          hideHiddenElement(previousState.thisId, styles, previousState);
        }
      }

      smoothScrollIntoView(thisElem);
      smoothScrollIntoView(hiddenId);

      setPreviousState((prevState) => ({
        ...prevState,
        thisId: hiddenId,
        thisElem,
        hiddenElem: openElem,
      }));
    },
    [previousState],
  );

  const days = useMemo(() => {
    return data.map((dayData, index) => (
      <Day
        key={dayData.dt}
        dayData={dayData}
        timezone={timezone}
        onClick={handleClick}
        index={index}
        openHiddenElem={openHiddenElem}
        hiddenElemSections={hiddenElemSections}
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
}

Daily.propTypes = DailyPropTypes;
Day.propTypes = DayPropTypes;
HiddenDay.propTypes = HiddenDayPropTypes;

export default Daily;
