import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './styles/Alerts.module.css';
import { getAlertDate } from './lib/functions';

function Alerts({ data }) {
  // console.log(data);
  const [alertData, timezone] = data;
  const alertsRef = useRef();
  const arrowRef = useRef();

  const [alertOpen, setAlertOpen] = useState(false);

  Alerts.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([
        // Prop type for the first element (array of objects)
        PropTypes.arrayOf(
          PropTypes.shape({
            sender_name: PropTypes.string.isRequired,
            event: PropTypes.string.isRequired,
            start: PropTypes.number.isRequired,
            end: PropTypes.number.isRequired,
            description: PropTypes.string.isRequired,
            tags: PropTypes.arrayOf(PropTypes.string).isRequired,
          }),
        ),
        // Prop type for the second element (string)
        PropTypes.string.isRequired,
      ]),
    ).isRequired,
  };

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
    const keys = Object.keys(alertData);
    keys.forEach((key) => {
      alerts.push(
        <div className={styles.alert} key={`alert-${i}`}>
          <p className={styles.title}>{alertData[key].sender_name}</p>
          <p className={styles.title}>{alertData[key].event}</p>
          <p className={styles.title}>
            From: {getAlertDate(alertData[key].start, timezone)} to{' '}
            {getAlertDate(alertData[key].end, timezone)}
          </p>
          <p>{alertData[key].description}</p>
          <p className={styles.tags}>Tags: {alertData[key].tags.toString()}</p>
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
        title="Click to expand / collapse"
        role="button"
        tabIndex={0}
      >
        <h1>Weather Warnings Issued</h1>
        <p className={styles.alertArrow} ref={arrowRef}>
          &#709;
        </p>
      </header>
      <div className={styles.alertEvents} ref={alertsRef}>
        {getAlerts(alertData)}
      </div>
    </section>
  );
}

export default Alerts;
