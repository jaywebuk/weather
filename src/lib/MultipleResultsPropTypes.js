import PropTypes from 'prop-types';

const MultipleResultsPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      country: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  setData: PropTypes.func.isRequired,
};

export default MultipleResultsPropTypes;
