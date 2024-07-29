import PropTypes from 'prop-types';

const ShowWeatherPropTypes = {
  data: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    timezone: PropTypes.string,
    timezone_offset: PropTypes.number,
    current: PropTypes.shape({
      dt: PropTypes.bool,
      sunrise: PropTypes.number,
      sunset: PropTypes.number,
      temp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      feels_like: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    }),
    minutely: PropTypes.arrayOf(
      PropTypes.shape({
        dt: PropTypes.number,
        precipitation: PropTypes.number,
      }),
    ),
    hourly: PropTypes.arrayOf(
      PropTypes.shape({
        dt: PropTypes.number,
        temp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        feels_like: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        pressure: PropTypes.number,
        humidity: PropTypes.number,
        dew_point: PropTypes.number,
        uvi: PropTypes.number,
        clouds: PropTypes.number,
        visibility: PropTypes.number,
        wind_speed: PropTypes.number,
        wind_deg: PropTypes.number,
        wind_gust: PropTypes.number,
        weather: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            main: PropTypes.string,
            description: PropTypes.string,
            icon: PropTypes.string,
          }),
        ),
        pop: PropTypes.number,
      }),
    ),
    daily: PropTypes.arrayOf(
      PropTypes.shape({
        dt: PropTypes.number,
        sunrise: PropTypes.number,
        sunset: PropTypes.number,
        moonrise: PropTypes.number,
        moonset: PropTypes.number,
        moon_phase: PropTypes.number,
        temp: PropTypes.shape({
          day: PropTypes.number,
          min: PropTypes.number,
          max: PropTypes.number,
          night: PropTypes.number,
          eve: PropTypes.number,
          morn: PropTypes.number,
        }),
        feels_like: PropTypes.shape({
          day: PropTypes.number,
          night: PropTypes.number,
          eve: PropTypes.number,
          morn: PropTypes.number,
        }),
        pressure: PropTypes.number,
        humidity: PropTypes.number,
        dew_point: PropTypes.number,
        wind_speed: PropTypes.number,
        wind_deg: PropTypes.number,
        wind_gust: PropTypes.number,
        weather: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            main: PropTypes.string,
            description: PropTypes.string,
            icon: PropTypes.string,
          }),
        ),
        clouds: PropTypes.number,
        pop: PropTypes.number,
        rain: PropTypes.number,
        uvi: PropTypes.number,
      }),
    ),
    alerts: PropTypes.arrayOf(
      PropTypes.shape({
        sender_name: PropTypes.string,
        event: PropTypes.string,
        start: PropTypes.number,
        end: PropTypes.number,
        description: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }),
  loadingRef: PropTypes.object,
};

export default ShowWeatherPropTypes;
