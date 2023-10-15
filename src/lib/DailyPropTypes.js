import PropTypes from 'prop-types';

const DayPropTypes = {
  dayData: PropTypes.shape({
    clouds: PropTypes.number.isRequired,
    dew_point: PropTypes.number.isRequired,
    dt: PropTypes.number.isRequired,
    feels_like: PropTypes.shape({
      day: PropTypes.number.isRequired,
      eve: PropTypes.number.isRequired,
      morn: PropTypes.number.isRequired,
      night: PropTypes.number.isRequired,
    }).isRequired,
    humidity: PropTypes.number.isRequired,
    moon_phase: PropTypes.number.isRequired,
    moonrise: PropTypes.number.isRequired,
    moonset: PropTypes.number.isRequired,
    pop: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    rain: PropTypes.number,
    sunrise: PropTypes.number.isRequired,
    sunset: PropTypes.number.isRequired,
    temp: PropTypes.shape({
      day: PropTypes.number.isRequired,
      eve: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
      morn: PropTypes.number.isRequired,
      night: PropTypes.number.isRequired,
    }).isRequired,
    uvi: PropTypes.number.isRequired,
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
  openHiddenDays: PropTypes.object.isRequired,
  hiddenDaySections: PropTypes.object.isRequired,
};

const DailyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(DayPropTypes.dayData).isRequired).isRequired,
  timezone: PropTypes.string.isRequired,
};

const HiddenDayPropTypes = {
  dayData: PropTypes.shape(DayPropTypes.dayData).isRequired,
  hiddenDaySections: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export { DailyPropTypes, DayPropTypes, HiddenDayPropTypes };
