import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>Copyright &copy; 2023 Jason Robinson</p>
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
