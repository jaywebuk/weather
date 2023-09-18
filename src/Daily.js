import styles from "./styles/Daily.module.css";
import PropTypes from "prop-types";
import { convertTemp, toUpper, getShortDate, getCardinals, getWind, getShortTime } from "./lib/functions";
import wind from "./images/wind.png";
import sun from "./images/sun.png";
import moon from "./images/moon.png";
import { useState, useRef } from "react";

const Daily = ({ data }) => {
    var [dayData, timezone] = data;
    var [previousDayId, setPreviousDayId] = useState(null);
    var [previousDayElem, setpreviousDayElem] = useState(null);
    var [previousHiddenDay, setPreviousHiddenDay] = useState(null);
    const openHiddenDays = useRef([]);
    const hiddenDaySections = useRef([]);

    const days = [];
    const handleClick = (e, i) => {
        let hiddenId = "#hidden_day-" + e.target.closest("section").dataset.hidden;
        let thisDayElem = e.target.closest("section");
        if (hiddenId === previousDayId) {
            if (getComputedStyle(hiddenDaySections.current[i]).display === "block") {
                hiddenDaySections.current[i].style.display = "none";
                previousDayElem.style.backgroundColor = "";
                previousHiddenDay.innerHTML = "&gt;";
            } else {
                hiddenDaySections.current[i].style.display = "block";
                thisDayElem.style.backgroundColor = "#ccffec";
                openHiddenDays.current[i].innerHTML = "&lt;";
            }
        } else {
            hiddenDaySections.current[i].style.display = "block";
            thisDayElem.style.backgroundColor = "#ccffec";
            openHiddenDays.current[i].innerHTML = "&lt;";
            if (previousDayId !== null) {
                hiddenDaySections.current[parseInt(previousDayId.split("-")[1])].style.display = "none";
                previousDayElem.style.backgroundColor = "";
                previousHiddenDay.innerHTML = "&gt;";
            }
        }
        thisDayElem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        hiddenDaySections.current[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

        setPreviousDayId(hiddenId);
        setpreviousDayElem(thisDayElem);
        setPreviousHiddenDay(openHiddenDays.current[i]);
    };
    const getDay = (data) => {
        for (const key in data) {
            const currentDate = getShortDate(data[key]["dt"], timezone);
            const weatherIcon = `http://openweathermap.org/img/wn/${data[key]["weather"][0]["icon"]}.png`;
            const weatherDescription = toUpper(data[key]["weather"][0]["description"]);

            days.push(
                <div style={{ display: "flex", minWidth: "fit-content" }} key={`daily-${key}`}>
                    <section className={styles.day} onClick={(e) => handleClick(e, key)} data-hidden={key}>
                        <p>{currentDate}</p>
                        <img src={weatherIcon} alt="Weather Icon" title={toUpper(weatherDescription)} />
                        <div className={styles.wind}>
                            <img src={wind} style={{ rotate: data[key]["wind_deg"] + "deg" }} alt="" title={"From the " + getCardinals(data[key]["wind_deg"])} />
                            <p title={toUpper(getWind(Math.round(data[key]["wind_speed"])))}>{Math.round(data[key]["wind_speed"])} mph</p>
                        </div>
                        <div className={styles.dailyTemp}>
                            <img src={sun} alt="" />
                            <p>
                                {convertTemp(data[key]["temp"]["day"])}&deg;C / {Math.round(data[key]["temp"]["day"])}&deg;F
                            </p>
                            <p className={styles.openHiddenDay} ref={(e) => (openHiddenDays.current[key] = e)}>
                                &gt;
                            </p>
                        </div>
                        <div className={styles.dailyTemp}>
                            <img src={moon} alt="" />
                            <p>
                                {convertTemp(data[key]["temp"]["night"])}&deg;C / {Math.round(data[key]["temp"]["night"])}&deg;F
                            </p>
                        </div>
                    </section>
                    <section className={styles.hidden} id={`hidden-day-${key}`} ref={(e) => (hiddenDaySections.current[key] = e)}>
                        <p>{toUpper(data[key]["weather"][0]["description"])}</p>
                        <p className={styles.wind}>
                            {toUpper(getWind(data[key]["wind_speed"]))} from the {getCardinals(data[key]["wind_deg"])}
                        </p>
                        <p>Pressure: {data[key]["pressure"]} mb</p>
                        <p>Chance of Precipitation: {Math.round(data[key]["pop"] * 100)}%</p>
                        <p>
                            Sunrise: {getShortTime(data[key]["sunrise"])} Sunset: {getShortTime(data[key]["sunset"])}
                        </p>
                    </section>
                </div>
            );
        }
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
};

Daily.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Daily;
