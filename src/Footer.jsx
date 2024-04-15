import React from 'react';
import GitHub from './images/GitHub-dark-48.png';
import linkedIn from './images/LI-In-Bug.png';

function Footer() {
  const startYear = 2023;
  const date = new Date().getFullYear();
  const endDate = date > startYear ? `- ${date}` : '';

  return (
    <footer className="footer">
      <p>Copyright &copy; 2023 {endDate} Jason Robinson</p>
      <div className="socialMedia">
        <a
          href="https://github.com/jaywebuk"
          aria-label="GitHub Link"
          target="_blank"
          rel="noreferrer"
        >
          <img src={GitHub} alt="" />
        </a>
        <a
          href="https://www.linkedin.com/in/jason-robinson-13010520a/"
          aria-label="LinkedIn Link"
          target="_blank"
          rel="noreferrer"
        >
          <img src={linkedIn} alt="" />
        </a>
      </div>
      <p className="provider">
        Weather data provided by{' '}
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          openweathermap.org
        </a>
      </p>
    </footer>
  );
}

export default Footer;
