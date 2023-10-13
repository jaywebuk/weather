/* eslint-disable prefer-const */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const PORT = 5000;
const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
const cors = require('cors');

let requestCount = 1;

app.use(cors());

app.listen(5000, () => console.log(`Server is running on port ${PORT}`));

app.get('/', (req, res) => {
  res.json();
});

app.get('/weather', (req, res) => {
  const { API_KEY } = process.env;
  if (!req.query.location) {
    res.json();
  }
  const { location } = req.query;

  /* const data = require('./city.json');
  res.json(data);
  // console.log(data); */

  const options = {
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=10&appid=${API_KEY}`,
  };

  axios
    .request(options)
    .then((response) => {
      // console.log(response.data);
      res.json(response.data);
      console.log(`City data received at ${Date()}`);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get('/weather/location', (req, res) => {
  const { API_KEY } = process.env;
  if (!req.query.lat) {
    res.json();
  }
  const { lat } = req.query;
  const { lon } = req.query;
  // console.log(lat, lon);

  requestCount += 1;
  /* const data = require('./weather.json');
  res.json(data);
  // console.log(data);
  console.log(`Weather data received at ${Date()}`);
  console.log(`Requests made since server up: ${requestCount}`); */

  const options = {
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
  };
  requestCount += 1;

  axios
    .request(options)
    .then((response) => {
      // console.log(response.data);
      const responseData = response.data;
      console.log(`Weather data received at ${Date()}`);
      console.log(`Requests made since server up: ${requestCount}`);
      res.json(responseData);
    })
    .catch((error) => {
      console.error(error);
    });
});
