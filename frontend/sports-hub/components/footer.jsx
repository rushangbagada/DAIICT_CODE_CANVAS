import React from 'react';
import './css/footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Logo and Description */}
          <div className="footer-logo">
            <div className="logo-wrapper">
              <div className="logo-icon">🏆</div>
              <div>
                <span className="logo-title">Campus Sports</span>
                <span className="logo-highlight">Hub</span>
              </div>
            </div>
            <p className="description">
              Uniting students through sports, fostering teamwork, and celebrating athletic excellence. 
              Join our community and discover your potential.
            </p>
            <div className="social-icons">
              <a href="#" className="icon">📘</a>
              <a href="#" className="icon">📸</a>
              <a href="#" className="icon">🐦</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/sports-clubs">Sports Clubs</Link></li>
              <li><Link to="/calender">Match Calendar</Link></li>
              <li><Link to="/result">Results & Scores</Link></li>
              <li><Link to="/gallery">Photo Gallery</Link></li>
              <li><Link to="/register">Join a Club</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li>📍 123 College Ave, Campus City</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ sports@campushub.edu</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Campus Sports Hub. All rights reserved. Built with passion for college sports.</p>
        </div>
      </div>
    </footer>
  );
}
