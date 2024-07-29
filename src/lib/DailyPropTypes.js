// Import PropTypes library for typechecking props
import PropTypes from 'prop-types';

// Define the shape of the dayData prop using PropTypes.shape
const DayPropTypes = {
  // dayData is an object that is required and must have the following properties
  dayData: PropTypes.shape({
    clouds: PropTypes.number.isRequired, // A number representing the cloudiness (0-100)
    dew_point: PropTypes.number.isRequired, // A number representing the dew point in Kelvin
    dt: PropTypes.number.isRequired, // A Unix timestamp representing the time the data was observed
    feels_like: PropTypes.shape({ // An object representing the feels like temperature at different times of the day
      day: PropTypes.number.isRequired, // Feels like temperature during the day in Kelvin
      eve: PropTypes.number.isRequired, // Feels like temperature during the evening in Kelvin
      morn: PropTypes.number.isRequired, // Feels like temperature during the morning in Kelvin
      night: PropTypes.number.isRequired, // Feels like temperature during the night in Kelvin
    }).isRequired,
    humidity: PropTypes.number.isRequired, // A number representing the relative humidity (0-100)
    moon_phase: PropTypes.number.isRequired, // A number representing the moon phase (0-100)
    moonrise: PropTypes.number.isRequired, // A Unix timestamp representing the time of moonrise
    moonset: PropTypes.number.isRequired, // A Unix timestamp representing the time of moonset
    pop: PropTypes.number.isRequired, // A number representing the probability of precipitation (0-1)
    pressure: PropTypes.number.isRequired, // A number representing the atmospheric pressure in hPa
    rain: PropTypes.number, // A number representing the total precipitation in mm (optional)
    sunrise: PropTypes.number.isRequired, // A Unix timestamp representing the time of sunrise
    sunset: PropTypes.number.isRequired, // A Unix timestamp representing the time of sunset
    temp: PropTypes.shape({ // An object representing the temperature at different times of the day
      day: PropTypes.number.isRequired, // Temperature during the day in Kelvin
      eve: PropTypes.number.isRequired, // Temperature during the evening in Kelvin
      max: PropTypes.number.isRequired, // Maximum temperature in Kelvin
      min: PropTypes.number.isRequired, // Minimum temperature in Kelvin
      morn: PropTypes.number.isRequired, // Temperature during the morning in Kelvin
      night: PropTypes.number.isRequired, // Temperature during the night in Kelvin
    }).isRequired,
    uvi: PropTypes.number.isRequired, // A number representing the UV index
    weather: PropTypes.arrayOf( // An array of objects representing the weather conditions
      PropTypes.shape({
        description: PropTypes.string.isRequired, // A string representing the weather description
        icon: PropTypes.string.isRequired, // A string representing the weather icon
        id: PropTypes.number.isRequired, // A number representing the weather ID
        main: PropTypes.string.isRequired, // A string representing the weather main category
      }).isRequired,
    ).isRequired,
    wind_deg: PropTypes.number.isRequired, // A number representing the wind direction in degrees
    wind_gust: PropTypes.number.isRequired, // A number representing the wind gust speed in m/s
    wind_speed: PropTypes.number.isRequired, // A number representing the wind speed in m/s
  }).isRequired,
  timezone: PropTypes.string.isRequired, // A string representing the timezone
  onClick: PropTypes.func.isRequired, // A function that is called when the component is clicked
  index: PropTypes.number.isRequired, // A number representing the index of the day
  openHiddenDay: PropTypes.object.isRequired, // An object representing the hidden day
  hiddenDaySections: PropTypes.object.isRequired, // An object representing the hidden day sections
};

// Define the shape of the data prop using PropTypes.arrayOf
const DailyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(DayPropTypes.dayData).isRequired).isRequired, // An array of dayData objects
  timezone: PropTypes.string.isRequired, // A string representing the timezone
};

// Define the shape of the dayData prop using PropTypes.shape
const HiddenDayPropTypes = {
  dayData: PropTypes.shape(DayPropTypes.dayData).isRequired, // A dayData object
  hiddenDaySections: PropTypes.object.isRequired, // An object representing the hidden day sections
  index: PropTypes.number.isRequired, // A number representing the index of the day
};

// Export DailyPropTypes, DayPropTypes, and HiddenDayPropTypes
export { DailyPropTypes, DayPropTypes, HiddenDayPropTypes };
