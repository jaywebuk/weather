import React from 'react';
import GitHub from './images/GitHub-dark-48.png'; // Importing the GitHub image for the footer
import linkedIn from './images/LI-In-Bug.png'; // Importing the LinkedIn image for the footer

// Defining the Footer component
function Footer() {
  const startYear = 2023; // Setting the start year for the copyright
  const date = new Date().getFullYear(); // Getting the current year
  const endDate = date > startYear ? `- ${date}` : ''; // Conditionally setting the end year for the copyright

  // Returning the footer JSX
  return (
    <footer className="footer">
      {/* Copyright notice with the start year and end year */}
      <p>
        Copyright &copy; {startYear} {endDate} Jason Robinson
      </p>
      <div className="socialMedia">
        {/* GitHub link with appropriate ARIA label and target attributes */}
        <a
          href="https://github.com/jaywebuk"
          aria-label="GitHub Link"
          target="_blank"
          rel="noreferrer"
        >
          <img src={GitHub} alt="" />
        </a>
        {/* LinkedIn link with appropriate ARIA label and target attributes */}
        <a
          href="https://www.linkedin.com/in/jason-robinson-13010520a/"
          aria-label="LinkedIn Link"
          target="_blank"
          rel="noreferrer"
        >
          <img src={linkedIn} alt="" />
        </a>
      </div>
      {/* Weather data provider credit with a link */}
      <p className="provider">
        Weather data provided by{' '}
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          openweathermap.org
        </a>
      </p>
    </footer>
  );
}

// Exporting the Footer component for use in other files
export default Footer;
