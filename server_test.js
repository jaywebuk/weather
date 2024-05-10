// Import required modules
const express = require('express'); // Web framework for Node.js
const rateLimit = require('express-rate-limit'); // Middleware for rate limiting requests
const cors = require('cors'); // Middleware for enabling CORS
const cityData = require('./city.json'); // Import city data from JSON file
const weatherData = require('./weather5.json'); // Import weather data from JSON file

// Initialize Express app
const app = express();
app.use(cors()); // Enable CORS
const PORT = 5000; // Set port number

app.listen(PORT, () => console.log(`Test Server is running on port ${PORT}`)); // Start the server

// Initialize fetch count variable
let fetchCount = 0;

// Initialize rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // Limit requests per minute
  max: 10, // Maximum number of requests per IP
  message: {
    error: `Limit is 10 requests per minute. Please wait and try again.`,
  },
});

// Apply rate limiter to the app
app.use(limiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json(); // Return empty JSON response
});

// Weather endpoint
app.get('/weather', (req, res) => {
  fetchCount += 1; // Increment fetch count
  res.json(cityData); // Return city data
  console.log(`${fetchCount}, Test city data received at ${Date()}`); // Log fetch count and current time
});

// Weather location endpoint
app.get('/weather/location', (req, res) => {
  fetchCount += 1; // Increment fetch count
  res.json(weatherData); // Return weather data
  console.log(`Test weather data received at ${Date()}`); // Log current time
  console.log(fetchCount, `Requests made since test server up: ${fetchCount}`); // Log fetch count and number of requests since server started
});

