import styles from "./styles/Hourly.module.css";
import PropTypes from "prop-types";
import { convertTemp, toUpper, getTime, getCardinals, getWind } from "./lib/functions";
import wind from "./images/wind.png";
import React, { useState, useRef } from "react";

const Hourly = ({ data }) => {
    const [previousHourId, setPreviousHourId] = useState(null);
    const [previousHourElem, setPreviousHourElem] = useState(null);
    const [previousHiddenHour, setPreviousHiddenHour] = useState(null);

    const openHiddenHours = useRef([]);
    const hiddenHourSections = useRef([]);

    if (!Array.isArray(data) || data.length === 0) {
        return <div>Error: Invalid data</div>;
    }

    const [hourData, timezone] = data;

    const hours = [];
    const handleClick = (e, i) => {
        const hiddenId = hiddenHourSections.current[i];
        const thisHourElem = e.target.closest("section");
        const openHour = openHiddenHours.current[i];
        if (hiddenId === previousHourId) {
            if (hiddenId.classList.contains(styles["show-hidden-hour"])) {
                hiddenId.classList.remove(styles["show-hidden-hour"]);
                previousHourElem.classList.remove(styles["hour-selected"]);
                previousHiddenHour.innerHTML = "&gt;";
            } else {
                hiddenId.classList.add(styles["show-hidden-hour"]);
                thisHourElem.classList.add(styles["hour-selected"]);
                openHour.innerHTML = "&lt;";
            }
        } else {
            hiddenId.classList.add(styles["show-hidden-hour"]);
            thisHourElem.classList.add(styles["hour-selected"]);
            openHour.innerHTML = "&lt;";
            if (previousHourId !== null) {
                previousHourId.classList.remove(styles["show-hidden-hour"]);
                previousHourElem.classList.remove(styles["hour-selected"]);
                previousHiddenHour.innerHTML = "&gt;";
            }
        }
        thisHourElem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        hiddenId.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

        setPreviousHourId(hiddenId);
        setPreviousHourElem(thisHourElem);
        setPreviousHiddenHour(openHour);
    };
    const getHour = (thisHour) => {
        for (const key of Object.keys(thisHour)) {
            if (key > 24) break;
            const currentTime = getTime(thisHour[key].dt, timezone);
            const weatherIcon = `http://openweathermap.org/img/wn/${thisHour[key].weather[0].icon}.png`;
            const weatherDescription = toUpper(thisHour[key].weather[0].description);
            hours.push(
                <div style={{ display: "flex", minWidth: "fit-content" }} key={`hourly-${key}`}>
                    <section className={styles.hour} onClick={(e) => handleClick(e, key)} data-hidden={key} role="button" tabIndex={key}>
                        <p>{currentTime}</p>
                        <img src={weatherIcon} alt="Weather Icon" title={weatherDescription} />
                        <div className={styles.wind}>
                            <img src={wind} style={{ rotate: `${thisHour[key].wind_deg}deg` }} alt="" title={`From the ${getCardinals(thisHour[key].wind_deg)}`} />
                            <p title={toUpper(getWind(Math.round(thisHour[key].wind_speed)))}>{Math.round(thisHour[key].wind_speed)} mph</p>
                        </div>
                        <p>
                            {convertTemp(thisHour[key].temp)}
                            &deg;C /{Math.round(thisHour[key].temp)}
                            &deg;F
                        </p>
                        <p className={styles.openHiddenHour} ref={(e) => (openHiddenHours.current[key] = e)}>
                            &gt;
                        </p>
                    </section>
                    <section className={`${styles.hidden}`} ref={(e) => (hiddenHourSections.current[key] = e)}>
                        <p>{weatherDescription}</p>
                        <p className={styles.wind}>
                            {toUpper(getWind(Math.round(thisHour[key].wind_speed)))} from the {getCardinals(thisHour[key].wind_deg)}
                        </p>
                        <p>
                            Feels Like: {convertTemp(thisHour[key].feels_like)}
                            &deg;C /{Math.round(thisHour[key].feels_like)}
                            &deg;F
                        </p>
                        <p>
                            Pressure:
                            {thisHour[key].pressure} mb
                        </p>
                        <p>
                            Chance of Precipitation:
                            {Math.round(thisHour[key].pop * 100)}%
                        </p>
                    </section>
                </div>
            );
        }
        return hours;
    };

    return (
        <section className={styles.hourly}>
            <header>
                <h1>Next 24 Hours</h1>
            </header>

            <div className={styles.hourBar}>{getHour(hourData)}</div>
        </section>
    );
};

Hourly.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Hourly;
