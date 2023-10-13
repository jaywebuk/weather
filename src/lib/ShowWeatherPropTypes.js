import PropTypes from 'prop-types';

const ShowWeatherPropTypes = {
  data: PropTypes.shape({
    country: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    local_names: PropTypes.objectOf(PropTypes.string),
    lon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string,
  }).isRequired,
  loadingRef: PropTypes.object.isRequired,
};

export default ShowWeatherPropTypes;
