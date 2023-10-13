import PropTypes from 'prop-types';

const CurrentWeatherPropTypes = {
  currentWeather: PropTypes.shape({
    dt: PropTypes.number.isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    wind_speed: PropTypes.number.isRequired,
    wind_deg: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    feels_like: PropTypes.number.isRequired,
    wind_gust: PropTypes.number,
    sunrise: PropTypes.number.isRequired,
    sunset: PropTypes.number.isRequired,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  cityData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    local_names: PropTypes.objectOf(PropTypes.string),
    lon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string,
  }).isRequired,
  handleRefresh: PropTypes.func.isRequired,
  loadingRef: PropTypes.object.isRequired,
  weatherAlerts: PropTypes.bool.isRequired,
};

export default CurrentWeatherPropTypes;
