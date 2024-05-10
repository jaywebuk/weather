// Import required modules
const dotenv = require('dotenv');
const axios = require('axios');
const { validationResult, check } = require('express-validator');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Load environment variables from .env file
dotenv.config();

// Set the port number
const PORT = 5000;

// Set the maximum request rate limit
const MAX_REQUESTS_PER_MINUTE = 10;

// Check if API_KEY is set in the environment variables
if (!process.env.API_KEY) {
  console.error('API_KEY is not set');
  process.exit(1);
}

// Get the API_KEY from the environment variables
const { API_KEY } = process.env;

// Initialize the Express app
const app = express();
app.use(cors());

// Set up the request rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: MAX_REQUESTS_PER_MINUTE, // Limit each IP to MAX_REQUESTS_PER_MINUTE requests per windowMs
  message: {
    error: `Limit is ${MAX_REQUESTS_PER_MINUTE} requests per minute. Please wait and try again.`,
  },
});
app.use(limiter);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Root route
app.get('/', (req, res) => {
  res.json();
});

// Function to create a new abort signal with a timeout
function newAbortSignal(timeoutMs) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

// Route to get weather data based on location query parameter
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
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the location query parameter
    const { location } = req.query;

    try {
      // Make the API request
      const options = {
        method: 'GET',
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location,
        )}&limit=10&appid=${API_KEY}`,
        signal: newAbortSignal(30000),
      };

      // Wait for the response and send it as JSON
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

// Route to get weather data based on latitude and longitude query parameters
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
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the latitude and longitude query parameters
    const { lat, lon } = req.query;
    requestCount += 1;

    try {
      // Make the API request
      const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/3.0/onecall?lat=${encodeURIComponent(
          lat,
        )}&lon=${encodeURIComponent(lon)}&units=imperial&exclude=minutely&appid=${API_KEY}`,
        signal: newAbortSignal(30000),
      };

      // Wait for the response and send it as JSON
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

