const express = require('express');
const cors = require('cors');
const cityData = require('./city.json');
const weatherData = require('./weather.json');

const app = express();
const PORT = 5000;

let requestCount = 0;

app.use(cors());

app.listen(PORT, () => console.log(`Test Server is running on port ${PORT}`));

app.get('/', (req, res) => {
  res.json();
});

app.get('/weather', (req, res) => {
  res.json(cityData);
  console.log(`Test city data received at ${Date()}`);
});

app.get('/weather/location', (req, res) => {
  requestCount += 1;
  res.json(weatherData);
  console.log(`Test weather data received at ${Date()}`);
  console.log(`Requests made since test server up: ${requestCount}`);
});
