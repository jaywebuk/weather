require('dotenv').config();

const PORT = 5000;
const axios = require('axios');
const { validationResult, check } = require('express-validator');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

if (!process.env.API_KEY) {
  console.error('API_KEY is not set');
  process.exit(1);
}

const { API_KEY } = process.env;

const app = express();
app.use(cors());

let requestCount = 0;

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
      error: `Limit is 10 requests per minute. Please wait and try again.`,
    },
  }),
);

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
  [
    check('location')
      .notEmpty()
      .withMessage('Location cannot be empty')
      .isString()
      .withMessage('Location must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      console.log(requestCount, `City data received at ${new Date()}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return null;
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.query.lat || !req.query.lon) {
      return res.json();
    }

    const { lat, lon } = req.query;
    requestCount += 1;

    try {
      const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/3.0/onecall?lat=${encodeURIComponent(
          lat,
        )}&lon=${encodeURIComponent(lon)}&units=imperial&exclude=minutely&appid=${API_KEY}`,
        signal: newAbortSignal(30000),
      };

      const response = await axios.request(options);
      const responseData = response.data;
      console.log(requestCount, `Weather data received at ${new Date()}`);
      console.log(`Onecall requests made since server up: ${requestCount}`);
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return null;
  },
);
