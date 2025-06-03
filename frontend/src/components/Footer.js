//frontend/src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div>
          <h4>Fashion Spot</h4>
          <p>Discover your style with us.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@fashionspot.com</p>
          <p>Phone: +123-456-7890</p>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} Fashion Spot. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
