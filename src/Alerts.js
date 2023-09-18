import styles from "./styles/Alerts.module.css";
import { getALertDate } from "./lib/functions";

import { useState, useRef } from "react";

const Alerts = ({ data }) => {
    var [alertData, timezone] = data;
    var alertsRef = useRef();
    var arrowRef = useRef();
    // console.log(alertData);

    var [alertOpen, setAlertOpen] = useState(false);

    const alerts = [];
    var i = 0;

    const handleClick = () => {
        if (alertOpen) {
            alertsRef.current.style.display = "none";
            arrowRef.current.innerHTML = "&#709;";
            setAlertOpen(false);
        } else {
            alertsRef.current.style.display = "block";
            arrowRef.current.innerHTML = "&#708;";

            setAlertOpen(true);
        }
    };

    const getAlerts = (data) => {
        for (const key in data) {
            alerts.push(
                <div className={styles.alert} key={`alert-${i}`}>
                    <p className={styles.title}>{data[key]["sender_name"]}</p>
                    <p className={styles.title}>{data[key]["event"]}</p>
                    <p className={styles.title}>
                        From: {getALertDate(data[key]["start"], timezone)} to {getALertDate(data[key]["end"], timezone)}
                    </p>
                    <p>{data[key]["description"]}</p>
                </div>
            );
            i++;
        }
        return alerts;
    };

    return (
        <section className={styles.alerts}>
            <header className={styles.alertsHeader} onClick={handleClick} title="Click to expand / collapse">
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
};

export default Alerts;
