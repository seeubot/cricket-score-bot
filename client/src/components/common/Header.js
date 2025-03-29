// client/src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if user has a theme preference stored
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src="/assets/images/cricket-logo.png" alt="CREX" />
        CREX
      </Link>
      
      <nav className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/series" className={`nav-link ${isActive('/series') ? 'active' : ''}`}>Series</Link>
        <Link to="/fixtures" className={`nav-link ${isActive('/fixtures') ? 'active' : ''}`}>Fixtures</Link>
        <Link to="/stats" className={`nav-link ${isActive('/stats') ? 'active' : ''}`}>Stats Corner</Link>
        <Link to="/rankings" className={`nav-link ${isActive('/rankings') ? 'active' : ''}`}>Rankings</Link>
        
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>
    </header>
  );
};

export default Header;

// client/src/components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/series">Series</a></li>
              <li><a href="/fixtures">Fixtures</a></li>
              <li><a href="/stats">Stats Corner</a></li>
              <li><a href="/rankings">Rankings</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://twitter.com/crexapp" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://facebook.com/crexapp" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com/crexapp" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CREX. All rights reserved.</p>
          <p>Powered by CricAPI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// client/src/components/common/Loader.js
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
