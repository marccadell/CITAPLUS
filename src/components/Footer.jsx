import React from 'react';
import '../styles/Components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <img src="img/logo.png" alt="Logo del Proyecto" />
      <p>© {currentYear} CITAPLUS. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
