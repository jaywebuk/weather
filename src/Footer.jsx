import React from 'react';

function Footer() {
  const startYear = 2023;
  const date = new Date().getFullYear();
  const endDate = date > startYear ? `- ${date}` : '';

  return (
    <footer className="footer">
      <p>Copyright &copy; 2023 {endDate} Jason Robinson</p>
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
