import PropTypes from 'prop-types';

const CurrentWeatherPropTypes = {
  currentWeather: PropTypes.shape({
    dt: PropTypes.number,
    sunrise: PropTypes.number,
    sunset: PropTypes.number,
    temp: PropTypes.number,
    feels_like: PropTypes.number,
    pressure: PropTypes.number,
    humidity: PropTypes.number,
    dew_point: PropTypes.number,
    uvi: PropTypes.number,
    clouds: PropTypes.number,
    visibility: PropTypes.number,
    wind_speed: PropTypes.number,
    wind_deg: PropTypes.number,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        main: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
      }),
    ),
  }).isRequired,
  handleRefresh: PropTypes.func.isRequired,
  loadingRef: PropTypes.object.isRequired,
  weatherAlerts: PropTypes.bool.isRequired,
};

export default CurrentWeatherPropTypes;
