import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for typechecking
import styles from './styles/Alerts.module.css';
import { getAlertDate } from './lib/functions';

/**
 * Parses the description and converts URLs to clickable links.
 * @param {string} description - The description to parse.
 * @returns {JSX.Element[]} - An array of elements containing parsed text.
 */
const parseDescription = (description) => {
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
};

/**
 * Displays an alert with a given description.
 * @param {object} props - The component props.
 * @param {string} props.description - The description of the alert.
 */
function Alert({ description }) {
  Alert.propTypes = {
    description: PropTypes.string.isRequired, // Ensure description is provided
  };

  return <p>{parseDescription(description)}</p>;
}

/**
 * Displays a list of alerts with provided data and timezone.
 * @param {object} props - The component props.
 * @param {object} props.data - The alerts data.
 * @param {string} props.timezone - The timezone for date formatting.
 */
function Alerts({ data, timezone }) {
  Alerts.propTypes = {
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
      alertsList.push(
        <div className={styles.alert} key={`alert-${key}`}>
          <p className={styles.title}>{data[key].sender_name}</p>
          <p className={styles.title}>{data[key].event}</p>
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
        <h1>Weather Warnings Issued</h1>
        <p className={styles.alertArrow} ref={arrowRef}>
          &#709;
        </p>
      </header>
      <div className={styles.alertEvents} ref={alertsRef}>
        {getAlerts()}
      </div>
    </section>
  );
}

export default Alerts;
