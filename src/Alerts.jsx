import React, { useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import AlertsPropTypes from './lib/AlertsPropTypes';
import styles from './styles/Alerts.module.css';
import { getAlertDate } from './lib/functions';

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

function Alert({ description }) {
  /* Alert.propTypes = {
    description: PropTypes.string.isRequired,
  }; */

  Alert.propTypes = AlertsPropTypes;

  return <p>{parseDescription(description)}</p>;
}

function Alerts({ data, timezone }) {
  // console.log(data, timezone);

  Alerts.propTypes = AlertsPropTypes;

  const alertsRef = useRef();
  const arrowRef = useRef();

  const [alertOpen, setAlertOpen] = useState(false);

  const alerts = [];
  let i = 0;

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

  const getAlerts = () => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      alerts.push(
        <div className={styles.alert} key={`alert-${i}`}>
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
      i += 1;
    });
    return alerts;
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
        {getAlerts(data)}
      </div>
    </section>
  );
}

export default Alerts;
