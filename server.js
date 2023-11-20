const PORT = 5000;
const express = require('express');
const axios = require('axios');
const { validationResult, check } = require('express-validator');

const app = express();
const cors = require('cors');

let requestCount = 0;

app.use(cors());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get('/', (req, res) => {
  res.json();
});

function newAbortSignal(timeoutMs) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

app.get(
  '/weather',
  [check('location').notEmpty().withMessage('Location cannot be empty')],
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { API_KEY } = process.env;
    if (!req.query.location) {
      return res.json();
    }

    const { location } = req.query;

    try {
      const options = {
        method: 'GET',
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location,
        )}&limit=10&appid=${API_KEY}`,
        signal: newAbortSignal(30000),
      };

      const response = await axios.request(options);
      res.json(response.data);
      console.log(`City data received at ${new Date()}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

app.get(
  '/weather/location',
  [
    check('lat')
      .notEmpty()
      .withMessage('Latitude cannot be empty')
      .isNumeric()
      .withMessage('Latitude must be numeric'),
    check('lon')
      .notEmpty()
      .withMessage('Longitude cannot be empty')
      .isNumeric()
      .withMessage('Longitude must be numeric'),
  ],
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { API_KEY } = process.env;
    if (!req.query.lat || !req.query.lon) {
      return res.json();
    }

    const { lat, lon } = req.query;
    requestCount += 1;

    try {
      const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(
          lat,
        )}&lon=${encodeURIComponent(lon)}&units=imperial&appid=${API_KEY}`,
        signal: newAbortSignal(30000),
      };

      const response = await axios.request(options);
      const responseData = response.data;
      console.log(`Weather data received at ${new Date()}`);
      console.log(`Onecall requests made since server up: ${requestCount}`);
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);
