import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
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

function Daily({ data }) {
  const [previousDayId, setPreviousDayId] = useState(null);
  const [previousDayElem, setpreviousDayElem] = useState(null);
  const [previousHiddenDay, setPreviousHiddenDay] = useState(null);
  const openHiddenDays = useRef([]);
  const hiddenDaySections = useRef([]);

  if (!Array.isArray(data) || data.length === 0) {
    return <div>Error: Invalid data</div>;
  }

  const [dayData, timezone] = data;
  const days = [];
  const handleClick = (e, i) => {
    const hiddenId = hiddenDaySections.current[i];
    const thisDayElem = e.target.closest('section');
    const openDay = openHiddenDays.current[i];
    if (hiddenId === previousDayId) {
      if (hiddenId.classList.contains(styles['show-hidden-day'])) {
        hiddenId.classList.remove(styles['show-hidden-day']);
        previousDayElem.classList.remove(styles['day-selected']);
        previousHiddenDay.innerHTML = '&gt;';
      } else {
        hiddenId.classList.add(styles['show-hidden-day']);
        thisDayElem.classList.add(styles['day-selected']);
        openDay.innerHTML = '&lt;';
      }
    } else {
      hiddenId.classList.add(styles['show-hidden-day']);
      thisDayElem.classList.add(styles['day-selected']);
      openDay.innerHTML = '&lt;';
      if (previousDayId !== null) {
        previousDayId.classList.remove(styles['show-hidden-day']);
        previousDayElem.classList.remove(styles['day-selected']);
        previousHiddenDay.innerHTML = '&gt;';
      }
    }
    thisDayElem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
    hiddenId.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });

    setPreviousDayId(hiddenId);
    setpreviousDayElem(thisDayElem);
    setPreviousHiddenDay(openDay);
  };
  const getDay = (thisDay) => {
    const keys = Object.keys(thisDay);

    keys.forEach((key) => {
      const currentDate = getShortDate(thisDay[key].dt, timezone);
      const weatherIcon = `http://openweathermap.org/img/wn/${thisDay[key].weather[0].icon}.png`;
      const weatherDescription = toUpper(thisDay[key].weather[0].description);

      days.push(
        <div className={styles.dayDiv} key={`daily-${key}`}>
          <section
            className={styles.day}
            onClick={(e) => handleClick(e, key)}
            onKeyDown={(e) => handleClick(e, key)}
            data-hidden={key}
            role="button alert"
            tabIndex={key}
            title="Click to Expand"
          >
            <p>{currentDate}</p>
            <img
              src={weatherIcon}
              alt="Weather Icon"
              title={toUpper(weatherDescription)}
            />
            <div className={styles.wind}>
              <img
                src={wind}
                style={{ rotate: `${thisDay[key].wind_deg}deg` }}
                alt=""
                title={`From the ${getCardinals(thisDay[key].wind_deg)}`}
              />
              <p title={toUpper(getWind(Math.round(thisDay[key].wind_speed)))}>
                {Math.round(thisDay[key].wind_speed)} mph
              </p>
            </div>
            <div className={styles.dailyTemp}>
              <img src={sun} alt="Average temperature for the daytime" />
              <p>
                {convertTemp(thisDay[key].temp.day)}&deg;C /{' '}
                {Math.round(thisDay[key].temp.day)}&deg;F
              </p>
              <p
                className={styles.openHiddenDay}
                ref={(e) => {
                  openHiddenDays.current[key] = e;
                }}
              >
                &gt;
              </p>
            </div>
            <div className={styles.dailyTemp}>
              <img src={moon} alt="Average temperature for the nightime" />
              <p>
                {convertTemp(thisDay[key].temp.night)}&deg;C /{' '}
                {Math.round(thisDay[key].temp.night)}&deg;F
              </p>
            </div>
          </section>
          <section
            className={styles.hidden}
            ref={(e) => {
              hiddenDaySections.current[key] = e;
            }}
          >
            <p>{toUpper(thisDay[key].weather[0].description)}</p>
            <p className={styles.wind}>
              {toUpper(getWind(thisDay[key].wind_speed))} from the{' '}
              {getCardinals(thisDay[key].wind_deg)}
            </p>
            <p>Pressure: {thisDay[key].pressure} mb</p>
            <p>
              Chance of Precipitation: {Math.round(thisDay[key].pop * 100)}%
            </p>
            <p>
              Sunrise: {getShortTime(thisDay[key].sunrise)} Sunset:{' '}
              {getShortTime(thisDay[key].sunset)}
            </p>
          </section>
        </div>,
      );
    });
    return days;
  };

  return (
    <section className={styles.daily}>
      <header>
        <h1>Week Outlook</h1>
      </header>

      <div className={styles.dayBar}>{getDay(dayData)}</div>
    </section>
  );
}

Daily.propTypes = {
  data: PropTypes.arrayOf.isRequired,
};

export default Daily;
