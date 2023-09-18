import styles from "./styles/Hourly.module.css";
import PropTypes from "prop-types";
import { convertTemp, toUpper, getTime, getCardinals, getWind } from "./lib/functions";
import wind from "./images/wind.png";
import { useState, useRef } from "react";

const Hourly = ({ data }) => {
    var [hourData, timezone] = data;
    var [previousHourId, setPreviousHourId] = useState(null);
    var [previousHourElem, setPreviousHourElem] = useState(null);
    var [previousHiddenHour, setPreviousHiddenHour] = useState(null);
    const openHiddenHours = useRef([]);
    const hiddenHourSections = useRef([]);

    const hours = [];
    const handleClick = (e, i) => {
        let hiddenId = "#hidden-" + e.target.closest("section").dataset.hidden;
        let thisHourElem = e.target.closest("section");
        if (hiddenId === previousHourId) {
            if (getComputedStyle(hiddenHourSections.current[i]).display === "block") {
                hiddenHourSections.current[i].style.display = "none";
                previousHourElem.style.backgroundColor = "";
                previousHiddenHour.innerHTML = "&gt;";
            } else {
                hiddenHourSections.current[i].style.display = "block";
                thisHourElem.style.backgroundColor = "#ccffec";
                openHiddenHours.current[i].innerHTML = "&lt;";
            }
        } else {
            hiddenHourSections.current[i].style.display = "block";
            thisHourElem.style.backgroundColor = "#ccffec";
            openHiddenHours.current[i].innerHTML = "&lt;";
            if (previousHourId !== null) {
                hiddenHourSections.current[parseInt(previousHourId.split("-")[1])].style.display = "none";
                previousHourElem.style.backgroundColor = "";
                previousHiddenHour.innerHTML = "&gt;";
            }
        }
        thisHourElem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        hiddenHourSections.current[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

        setPreviousHourId(hiddenId);
        setPreviousHourElem(thisHourElem);
        setPreviousHiddenHour(openHiddenHours.current[i]);
    };
    const getHour = (data) => {
        for (const key in data) {
            const currentTime = getTime(data[key]["dt"], timezone);
            const weatherIcon = `http://openweathermap.org/img/wn/${data[key]["weather"][0]["icon"]}.png`;
            const weatherDescription = toUpper(data[key]["weather"][0]["description"]);
            hours.push(
                <div style={{ display: "flex", minWidth: "fit-content" }} key={`hourly-${key}`}>
                    <section className={styles.hour} onClick={(e) => handleClick(e, key)} data-hidden={key}>
                        <p>{currentTime}</p>
                        <img src={weatherIcon} alt="Weather Icon" title={weatherDescription} />
                        <div className={styles.wind}>
                            <img src={wind} style={{ rotate: data[key]["wind_deg"] + "deg" }} alt="" title={"From the " + getCardinals(data[key]["wind_deg"])} />
                            <p title={toUpper(getWind(Math.round(data[key]["wind_speed"])))}>{Math.round(data[key]["wind_speed"])} mph</p>
                        </div>
                        <p>
                            {convertTemp(data[key]["temp"])}&deg;C / {Math.round(data[key]["temp"])}&deg;F
                        </p>
                        <p className={styles.openHiddenHour} ref={(e) => (openHiddenHours.current[key] = e)}>
                            &gt;
                        </p>
                    </section>
                    <section className={`${styles.hidden}`} id={`hidden-${key}`} ref={(e) => (hiddenHourSections.current[key] = e)}>
                        <p>{weatherDescription}</p>
                        <p className={styles.wind}>
                            {toUpper(getWind(Math.round(data[key]["wind_speed"])))} from the {getCardinals(data[key]["wind_deg"])}
                        </p>
                        <p>
                            Feels Like: {convertTemp(data[key]["feels_like"])}&deg;C / {Math.round(data[key]["feels_like"])}&deg;F
                        </p>
                        <p>Pressure: {data[key]["pressure"]} mb</p>
                        <p>Chance of Precipitation: {Math.round(data[key]["pop"] * 100)}%</p>
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
