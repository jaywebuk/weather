import axios from "axios";
import CurrentWeather from "./CurrentWeather";
import Alerts from "./Alerts";
import Hourly from "./Hourly";
import Daily from "./Daily";
import { useState, useEffect } from "react";

const ShowWeather = ({ data }) => {
    var [cityData, loadingRef] = data;
    // console.log(cityData);
    const [weatherData, setWeatherData] = useState();
    const [refreshData, setRefreshData] = useState();
    const [weatherAlerts, setWeatherAlerts] = useState(false);

    const handleRefresh = () => {
        setRefreshData(!refreshData);
    };
    useEffect(() => {
        loadingRef.current.style.visibility = "visible";
        const lat = cityData[0]["lat"];
        const lon = cityData[0]["lon"];
        // console.log(lat, lon);
        // console.log("cityData", cityData[0]);

        const options = {
            method: "GET",
            url: `http://localhost:5000/weather/location?lat=${lat}&lon=${lon}`,
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setWeatherData(response.data);
                setWeatherAlerts(typeof response.data["alerts"] !== "undefined");
            })
            .catch(function (error) {
                console.error(error);
            });

        return () => {};
    }, [refreshData, cityData]);
    return (
        weatherData && (
            <>
                <CurrentWeather data={[[weatherData["current"], weatherData["timezone"]], cityData, handleRefresh, loadingRef, weatherAlerts]} />
                {weatherAlerts && <Alerts data={[weatherData["alerts"], weatherData["timezone"]]} />}
                <Hourly data={[weatherData["hourly"], weatherData["timezone"]]} />
                <Daily data={[weatherData["daily"], weatherData["timezone"]]} />
                {/* <pre>{JSON.stringify(weatherData)}</pre> */}
                {/* <pre>{JSON.stringify(cityData)}</pre> */}
                {/* {console.log("weatherData", weatherData)} */}
            </>
        )
    );
};

export default ShowWeather;
