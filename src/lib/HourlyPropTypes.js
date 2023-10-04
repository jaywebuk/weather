import PropTypes from 'prop-types';

const HourlyPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
      wind_deg: PropTypes.number.isRequired,
      wind_speed: PropTypes.number.isRequired,
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      pressure: PropTypes.number.isRequired,
      pop: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  timezone: PropTypes.string.isRequired,
};

export default HourlyPropTypes;
