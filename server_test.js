const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cityData = require('./city.json');
const weatherData = require('./weather.json');

const app = express();
app.use(cors());
const PORT = 5000;

app.listen(PORT, () => console.log(`Test Server is running on port ${PORT}`));

let fetchCount = 0;

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: `Limit is 10 requests per minute. Please wait and try again.`,
  },
});

app.use(limiter);

app.get('/', (req, res) => {
  res.json();
});

app.get('/weather', (req, res) => {
  fetchCount += 1;
  res.json(cityData);
  console.log(`${fetchCount}, Test city data received at ${Date()}`);
});

app.get('/weather/location', (req, res) => {
  fetchCount += 1;
  res.json(weatherData);
  console.log(`Test weather data received at ${Date()}`);
  console.log(fetchCount, `Requests made since test server up: ${fetchCount}`);
});
