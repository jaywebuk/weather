import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for typechecking
import styles from './styles/Alerts.module.css';
import { getAlertDate } from './lib/functions';

/**
 * Parses the description and converts URLs to clickable links.
 * @param {string} description - The description to parse.
 * @returns {JSX.Element[]} - An array of elements containing parsed text.
 */
/* const parseDescription = (description) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return description.split(urlRegex).map((part) =>
    urlRegex.test(part) ? (
      <a key={part} href={part}>
        {part}
      </a>
    ) : (
      <span key={part}>{part}</span>
    ),
  );
}; */

const parseDescription = (description) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split by URLs and process each part separately
  return description.split(urlRegex).map((part) => {
    // Check if the part is a URL
    if (urlRegex.test(part)) {
      return (
        <a key={part} href={part}>
          {part}
        </a>
      );
      /// eslint-disable-next-line no-else-return
    }
    // If it's not a URL, split by sentence-ending punctuation
    return part.split(/([.\n]+)/).map((sentence, index) => {
      if (sentence.trim() === '' || /[.\n]+/.test(sentence)) {
        // Skip empty strings and sentence-ending punctuation alone
        return null;
      }
      return (
        // eslint-disable-next-line react/no-array-index-key
        <p className={styles.alertText} key={index}>
          {sentence.trim()}
        </p>
      );
    });
  });
};

/**
 * Displays an alert with a given description.
 * @param {object} props - The component props.
 * @param {string} props.description - The description of the alert.
 */
function Alert({ description }) {
  return <p>{parseDescription(description)}</p>;
}

Alert.propTypes = {
  description: PropTypes.string.isRequired,
};

/**
 * Displays a list of alerts with provided data and timezone.
 * @param {object} props - The component props.
 * @param {object} props.data - The alerts data.
 * @param {string} props.timezone - The timezone for date formatting.
 */
function Alerts({ data, timezone }) {
  Alerts.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired, // Ensure data is provided
    timezone: PropTypes.string.isRequired, // Ensure timezone is provided
  };

  const alertsRef = useRef();
  const arrowRef = useRef();

  const [alertOpen, setAlertOpen] = useState(false);

  /**
   * Handles the click event for expanding, closing, or collapsing the alerts.
   */
  const handleClick = () => {
    if (alertOpen) {
      alertsRef.current.style.display = 'none';
      arrowRef.current.innerHTML = '&#709;';
      setAlertOpen(false);
    } else {
      alertsRef.current.style.display = 'block';
      arrowRef.current.innerHTML = '&#708;';
      setAlertOpen(true);
    }
  };

  /**
   * Generates the alerts list based on the provided data.
   * @returns {JSX.Element[]} - An array of alert elements.
   */
  const getAlerts = () => {
    const keys = Object.keys(data);
    const alertsList = [];

    keys.forEach((key) => {
      const alertColour = data[key].event.split(' ')[0];
      alertsList.push(
        <div className={styles.alert} key={`alert-${key}`}>
          <header>
            <h1 className={styles.title}>{data[key].sender_name}</h1>
            <h2 className={`${styles.title} ${styles[alertColour]}`}>{data[key].event}</h2>
          </header>
          <p className={styles.title}>
            From: {getAlertDate(data[key].start, timezone)} to{' '}
            {getAlertDate(data[key].end, timezone)}
          </p>
          <Alert description={data[key].description} />
          <p className={styles.tags}>Tags: {data[key].tags.toString()}</p>
        </div>,
      );
    });

    return alertsList;
  };

  return (
    <section className={styles.alerts}>
      <header
        className={styles.alertsHeader}
        onClick={handleClick}
        onKeyDown={handleClick}
        title="Click to Expand / Close / collapse"
        role="button"
        tabIndex={0}
      >
        <h1>Weather Warnings Issued ({data.length})</h1>
        <p className={styles.alertArrow} ref={arrowRef}>
          &#709;
        </p>
      </header>
      <div className={styles.alertEvents} ref={alertsRef}>
        <hr />
        {getAlerts()}
      </div>
    </section>
  );
}

export default Alerts;
