const PORT = 5000;
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors());

app.listen(5000, () => console.log(`Server is running on port ${PORT}`));

app.get("/", (req, res) => {
    res.json();
});

app.get("/weather", (req, res) => {
    let API_KEY = process.env.API_KEY;
    if (!req.query.location) {
        res.json();
    }
    let location = req.query.location;

    const data = require("./city.json");
    res.json(data);
    // console.log(data);

    /* const options = {
        method: "GET",
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=10&appid=${API_KEY}`,
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            res.json(response.data);
        })
        .catch(function (error) {
            console.error(error);
        }); */
});

app.get("/weather/location", (req, res) => {
    let API_KEY = process.env.API_KEY;
    if (!req.query.lat) {
        res.json();
    }
    let lat = req.query.lat;
    let lon = req.query.lon;

    const data = require("./weather.json");
    res.json(data);
    // console.log(data);

    /* const options = {
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            res.json(response.data);
        })
        .catch(function (error) {
            console.error(error);
        }); */
});
