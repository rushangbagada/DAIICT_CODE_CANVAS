import React from 'react';
import './css/aboutus.css';

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <header className="hero">
        <img
          className="bg"
          src="https://images.pexels.com/photos/209952/pexels-photo-209952.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Team celebration"
        />
        <div className="content">
          <h1 className="head-title">About Campus Sports Hub</h1>
          <p className="title">
            Empowering student athletes to achieve excellence through sport, teamwork, and personal growth.
          </p>
        </div>
      </header>

      {/* Mission */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p className="lead">
          Campus Sports Hub is dedicated to creating an inclusive, competitive, and supportive environment where
          student athletes can pursue their passion for sports while developing essential life skills.
        </p>
        <p className="lead">
          Through our comprehensive sports programs, we aim to foster excellence, build character, and create lasting
          memories that extend far beyond graduation.
        </p>
      </section>

      {/* Stats */}
      <section className="stats">
        <h2>Our Achievements</h2>
        <div className="grid grid-4">
          <div className="card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="12" fill="url(#grad)" />
              <path
                d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"
                fill="white"
              />
            </svg>
            <h3>500+</h3>
            <p>Active Students</p>
          </div>

          {/* Additional 3 stat cards - similar SVG fixes applied */}
          {/* ... (repeat the structure for Sports Clubs, Championships Won, Years of Excellence) ... */}
        </div>
      </section>

      {/* Values */}
      <section className="values">
        <h2>Our Values</h2>
        <p className="lead">The principles that guide everything we do</p>
        <div className="grid grid-4">
          {/* Repeat value card structure with corrected SVG props */}
          {/* Example below: */}
          <div className="card">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="64" height="64" rx="12" fill="url(#orangeGradient)" />
              <path
                fill="white"
                d="M20 20 h24 v8 c0 6.6 -5.4 12 -12 12 s-12 -5.4 -12 -12 v-8 z M18 22 a2 2 0 0 0 -2 2 v6 c0 5 3 9 7 10 M46 22 a2 2 0 0 1 2 2 v6 c0 5 -3 9 -7 10 M28 44 h8 v4 h-8 z M26 50 h12 v4 h-12 z"
              />
            </svg>
            <h3>Excellence</h3>
            <p>We strive for the highest standards in athletic performance and personal development.</p>
          </div>
          {/* ... Add other value cards like Teamwork, Dedication, Passion ... */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Athletes Say</h2>
        <p className="lead">Hear from the heart of our community</p>
        <div className="grid grid-3">
          <div className="card">
            <img
              src="https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Sarah Johnson"
            />
            <h3>Sarah Johnson</h3>
            <p className="role">Basketball Team Captain, Senior</p>
            <blockquote>
              Campus Sports Hub transformed my college experience. The friendships I've made and skills I've developed
              here will last a lifetime.
            </blockquote>
          </div>

          {/* ... Add other testimonial cards for Michael Chen, Emma Rodriguez ... */}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Get in Touch</h2>
        <p className="lead">Ready to join our community? We'd love to hear from you!</p>
        <div className="grid grid-2">
          <div>
            <h3>Contact Information</h3>
            <ul>
              <li>📍 123 College Avenue, Campus City</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ sports@campushub.edu</li>
            </ul>
            <h4>Follow Us</h4>
            <p>
              {/* Example social icon */}
              <svg width="24" height="24" fill="#3B82F6"><circle cx="12" cy="12" r="12" /></svg>
              {/* Add Instagram / Twitter icons similarly */}
            </p>
          </div>
          <div>
            <h3>Office Hours</h3>
            <ul>
              <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
            <div className="tip">
              <h4>Quick Tip</h4>
              <p>
                Visit us during lunch hours (12-1 PM) for the best chance to meet with our coaches and staff!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
