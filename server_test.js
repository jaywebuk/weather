/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const PORT = 5000;
const express = require('express');
const axios = require('axios');

const app = express();
const cors = require('cors');

let requestCount = 0;

app.use(cors());

app.listen(5000, () => console.log(`Test Server is running on port ${PORT}`));

app.get('/', (req, res) => {
  res.json();
});

app.get('/weather', (req, res) => {
  const json = require('./city.json');
  res.json(json);
  console.log(`Test city data received at ${Date()}`);
});

app.get('/weather/location', (req, res) => {
  requestCount += 1;
  const json = require('./weather.json');
  res.json(json);
  console.log(`Test weather data received at ${Date()}`);
  console.log(`Requests made since test server up: ${requestCount}`);
});
