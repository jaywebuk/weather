import styles from "./styles/CurrentWeather.module.css";
import { convertTemp, getCardinals, getWind, toUpper, getLongDate, getUTime, getShortTime } from "./lib/functions";
import warning from "./images/warning.png";
import refresh from "./images/refresh.png";
import wind from "./images/wind.png";
import sunrise from "./images/sunrise.png";
import sunset from "./images/sunset.png";

const CurrentWeather = ({ data }) => {
    let [[currentWeather, timezone], cityData, handleRefresh, loadingRef, weatherALerts] = data;
    loadingRef.current.style.visibility = "hidden";

    return (
        currentWeather && (
            <div className={styles.currentWeather}>
                <div className={styles.topInfo}>
                    <img className={styles.refresh} src={refresh} alt="Refresh Icon" onClick={handleRefresh} />
                    {/* {getUTime()} */}
                    {weatherALerts && <img className={styles.warning} src={warning} alt="Weather Warning Icon" title="Weather warnings issued" />}
                </div>
                <p className={styles.currentDate}>{getLongDate(currentWeather.dt, timezone)}</p>
                <h1>
                    {cityData[0]["name"]}, {cityData[0]["state"]} ({cityData[0]["country"]})
                </h1>
                <p className={styles.coords}>
                    {cityData[0]["lat"]}, {cityData[0]["lon"]}
                </p>
                <p className={styles.description}>
                    {toUpper(currentWeather.weather[0].description)} with {getWind(currentWeather.wind_speed)}
                </p>
                <div className={styles.tempDetails}>
                    <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`} alt="Weather Icon" title={toUpper(currentWeather.weather[0].description)} />
                    <div className={styles.wind}>
                        <img src={wind} style={{ rotate: currentWeather.wind_deg + "deg" }} alt="Wind Icon" title={"From the " + getCardinals(currentWeather.wind_deg)} />
                        <p>{Math.round(currentWeather.wind_speed)} mph</p>
                    </div>
                    <p>
                        {convertTemp(currentWeather.temp)}&deg;C / {Math.round(currentWeather.temp)}&deg;F
                        <br />
                        <span className="feelsLike" style={{ fontSize: "0.8rem" }}>
                            Feels like {convertTemp(currentWeather.feels_like)}&deg;C / {Math.round(currentWeather.feels_like)}&deg;F
                        </span>
                    </p>
                </div>
                <div className={styles.sunrise}>
                    {currentWeather.wind_gust > 0 && <p className={styles.gust}>Gusts of {Math.round(currentWeather.wind_gust)} mph</p>}
                    {!currentWeather.wind_gust && <p className={styles.gust}></p>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "150px" }}>
                        <img src={sunrise} alt="" />
                        {getShortTime(currentWeather.sunrise)}
                        <img src={sunset} alt="" />
                        {getShortTime(currentWeather.sunset)}
                    </div>
                </div>
            </div>
        )
    );
};

export default CurrentWeather;
