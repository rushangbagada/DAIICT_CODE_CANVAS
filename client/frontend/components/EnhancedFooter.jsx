import React from 'react';
import { Link } from 'react-router-dom';
import './css/EnhancedFooter.css';

const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="enhanced-footer">
      <div className="footer-background">
        <div className="footer-particles"></div>
        <div className="footer-glow"></div>
      </div>
      
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="brand-icon">
                <span className="icon-gradient">H₂</span>
              </div>
              <div className="brand-text">
                <span className="brand-main">Green</span>
                <span className="brand-sub">Hydrogen</span>
              </div>
            </div>
            <p className="brand-description">
              Leading the green hydrogen revolution for a sustainable future. 
              Powering tomorrow with clean energy solutions and zero-emission technology.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
                <span className="social-text">LinkedIn</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
                <span className="social-text">Twitter</span>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <span className="social-icon">📺</span>
                <span className="social-text">YouTube</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span className="social-icon">🔗</span>
                <span className="social-text">GitHub</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-section">
            <h3 className="section-title">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <span className="link-icon">🏠</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="footer-link">
                  <span className="link-icon">ℹ️</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/india-map" className="footer-link">
                  <span className="link-icon">🗺️</span>
                  <span>India Map</span>
                </Link>
              </li>
              <li>
                <Link to="/hydrogen-plants" className="footer-link">
                  <span className="link-icon">⚡</span>
                  <span>H₂ Plants</span>
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="footer-link">
                  <span className="link-icon">💬</span>
                  <span>ChatBot</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Tools */}
          <div className="footer-section">
            <h3 className="section-title">Technology</h3>
            <ul className="footer-links">
              <li>
                <Link to="/threeDmodels" className="footer-link">
                  <span className="link-icon">🔬</span>
                  <span>3D Models</span>
                </Link>
              </li>
              <li>
                <Link to="/ml-results" className="footer-link">
                  <span className="link-icon">🤖</span>
                  <span>ML Analysis</span>
                </Link>
              </li>
              <li>
                <Link to="/pdf-generator" className="footer-link">
                  <span className="link-icon">📄</span>
                  <span>PDF Reports</span>
                </Link>
              </li>
              <li>
                <a href="#analytics" className="footer-link">
                  <span className="link-icon">📊</span>
                  <span>Data Analytics</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access - User Functions */}
          <div className="footer-section">
            <h3 className="section-title">Quick Access</h3>
            <ul className="footer-links">
              <li>
                <Link to="/login" className="footer-link">
                  <span className="link-icon">🔑</span>
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  <span className="link-icon">👤</span>
                  <span>Register</span>
                </Link>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  <span className="link-icon">📧</span>
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a href="#support" className="footer-link">
                  <span className="link-icon">🆘</span>
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated with Green Hydrogen</h3>
              <p>Get the latest news, research, and insights delivered to your inbox.</p>
            </div>
            <div className="newsletter-form">
              <form className="subscribe-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="newsletter-input"
                    required 
                  />
                  <button type="submit" className="subscribe-button">
                    <span className="button-text">Subscribe</span>
                    <span className="button-icon">📬</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="bottom-content">
            <div className="copyright">
              <p>
                © {currentYear} <span className="brand-name">GreenH₂</span>. 
                All rights reserved. Building a cleaner tomorrow.
              </p>
            </div>
            <div className="bottom-links">
              <a href="#privacy" className="bottom-link">Privacy Policy</a>
              <a href="#terms" className="bottom-link">Terms of Service</a>
              <a href="#cookies" className="bottom-link">Cookie Policy</a>
              <a href="#security" className="bottom-link">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
