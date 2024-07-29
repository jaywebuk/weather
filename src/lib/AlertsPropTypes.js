// Import PropTypes library for typechecking the components' props
import PropTypes from 'prop-types';

// Define the shape of the Alert object in the alerts array
const AlertPropTypes = {
  description: PropTypes.string.isRequired, // Required string describing the alert
  end: PropTypes.number.isRequired, // Required number representing the end time of the alert
  event: PropTypes.string.isRequired, // Required string representing the type of the alert
  sender_name: PropTypes.string.isRequired, // Required string representing the name of the sender
  start: PropTypes.number.isRequired, // Required number representing the start time of the alert
  tags: PropTypes.arrayOf(PropTypes.string), // Optional array of strings representing the tags of the alert
};

// Define the shape of the alerts array prop
const AlertsPropTypes = {
  data: PropTypes.arrayOf(AlertPropTypes).isRequired, // Required array of Alert objects
  timezone: PropTypes.string, // Optional string representing the timezone
};

// Export AlertsPropTypes and AlertPropTypes for use in other components
export { AlertsPropTypes, AlertPropTypes };

