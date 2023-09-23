import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './styles/Alerts.module.css';
import { getALertDate } from './lib/functions';

function Alerts({ data }) {
  const [alertData, timezone] = data;
  const alertsRef = useRef();
  const arrowRef = useRef();
  // console.log(alertData);

  const [alertOpen, setAlertOpen] = useState(false);

  Alerts.propTypes = {
    data: PropTypes.arrayOf.isRequired,
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
    const keys = Object.keys(data);
    keys.forEach((key) => {
      alerts.push(
        <div className={styles.alert} key={`alert-${i}`}>
          <p className={styles.title}>{data[key].sender_name}</p>
          <p className={styles.title}>{data[key].event}</p>
          <p className={styles.title}>
            From: {getALertDate(data[key].start, timezone)} to{' '}
            {getALertDate(data[key].end, timezone)}
          </p>
          <p>{data[key].description}</p>
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
