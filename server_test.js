/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const PORT = 5000;
const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
const cors = require('cors');

let requestCount = 0;

app.use(cors());

app.listen(5000, () => console.log(`Test Server is running on port ${PORT}`));

app.get('/', (req, res) => {
  res.json();
});

function newAbortSignal(timeoutMs) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

app.get('/weather', (req, res) => {
  const { API_KEY } = process.env;
  if (!req.query.location) {
    res.json();
  }
  const { location } = req.query;

  const data = require('./city.json');
  res.json(data);
  // console.log(data);
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
  const data = require('./weather.json');
  res.json(data);
  // console.log(data);
  console.log(`Weather data received at ${Date()}`);
  console.log(`Requests made since server up: ${requestCount}`);
});
