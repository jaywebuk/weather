import PropTypes from 'prop-types';

const AlertsPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      end: PropTypes.number.isRequired,
      event: PropTypes.string.isRequired,
      sender_name: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  ).isRequired,
  timezone: PropTypes.string,
};

export default AlertsPropTypes;
