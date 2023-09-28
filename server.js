/* eslint-disable no-unused-vars */
const PORT = 5000;
const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
const cors = require('cors');

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
  console.log(data); */

  const options = {
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=10&appid=${API_KEY}`,
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
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
  console.log(lat, lon);

  /* const data = require('./weather.json');
  res.json(data);
  console.log(data); */

  const options = {
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});
