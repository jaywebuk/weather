import PropTypes from 'prop-types';

const HourPropTypes = {
  hourData: PropTypes.shape({
    clouds: PropTypes.number.isRequired,
    dew_point: PropTypes.number.isRequired,
    dt: PropTypes.number.isRequired,
    feels_like: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    pop: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    uvi: PropTypes.number.isRequired,
    visibility: PropTypes.number.isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        main: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    wind_deg: PropTypes.number.isRequired,
    wind_gust: PropTypes.number.isRequired,
    wind_speed: PropTypes.number.isRequired,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  openHiddenHours: PropTypes.object.isRequired,
  hiddenHourSections: PropTypes.object.isRequired,
};

const HourlyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(HourPropTypes.hourData).isRequired).isRequired,
  timezone: PropTypes.string.isRequired,
};

const HiddenHourPropTypes = {
  hourData: PropTypes.shape(HourPropTypes.hourData).isRequired,
  hiddenHourSections: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  weatherDescription: PropTypes.string.isRequired,
};

export { HourlyPropTypes, HourPropTypes, HiddenHourPropTypes };
