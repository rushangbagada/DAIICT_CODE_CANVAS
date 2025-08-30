import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { CountUp } from 'countup.js';
import { Link } from 'react-router-dom';
import EnhancedNavbar from './EnhancedNavbar';
import './css/aboutus.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Green-Themed SVG Icon Components (Corrected names from previous theme) ---

const ExcellenceIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1"> // Note: ID is reused, which is valid.
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
    <path d="M12 2.5C6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5s9.5-4.25 9.5-9.5S17.25 2.5 12 2.5ZM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8Z" fill="white" opacity="0.3"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Zm-1 11h-1v-4h1v4Zm4-3h-1v-2h-2v2h-1v-2h-1v-2h1V8h1v2h2V8h1v2h-1v3Z" fill="white"/>
  </svg>
);

const TeamworkIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.71 14.29c-.39.39-1.02.39-1.41 0l-1.42-1.42c-.39-.39-.39-1.02 0-1.41L12 8.41l4.54 4.54c.39.39.39 1.02 0 1.41l-1.42 1.42c-.39.39-1.02.39-1.41 0L12 14.17l-2.71 2.12z" fill="white" transform="rotate(45 12 12)"/>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="white" opacity="0.3"/>
    </svg>
);

const DedicationIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
    </svg>
);

const PassionIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="white" opacity="0.3"/>
    </svg>
);

const InnovationIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="white"/>
    </svg>
);

const SustainabilityIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
    </svg>
);

const SafetyIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white"/>
    </svg>
);

const CollaborationIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="radiumGreenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#radiumGreenGradient)" />
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v7H5v-3H4zm3-7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM13 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-1 1h2v7h-2v-7z" fill="white"/>
    </svg>
);

// Animated Counter Component (from GreenHydrogenHomepage)
const AnimatedCounter = ({ target, duration = 2000, label, symbol = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to({ value: 0 }, {
            value: target,
            duration: duration / 1000,
            ease: "power2.out",
            onUpdate: function() {
              setCount(Math.floor(this.targets()[0].value));
            }
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={elementRef} className="metric-item">
      <div className="metric-number">
        {count.toLocaleString()}{symbol}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
};

const AboutUs = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const valuesRef = useRef(null);
  const metricsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );
    
    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, delay: 0.3, ease: "power3.out" }
    );
    
    gsap.fromTo('.hero-cta', 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, delay: 0.6, ease: "back.out(1.7)" }
    );

    // Scroll-based animations
    gsap.fromTo('.section-title', 
      { opacity: 0, y: 50 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.section-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.value-card', 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.values-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, []);

  return (
    <div className="green-hydrogen-homepage">
      {/* Enhanced Navigation */}
      <EnhancedNavbar />

      {/* Hero Section */}
      <section id="home" className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="particle-field"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              About <span className="highlight">Verdant Hydrogen</span>
            </h1>
            <p className="hero-subtitle">
              Pioneering a sustainable future with clean, renewable hydrogen energy.
              Leading the global transition to zero-emission solutions.
            </p>
            <div className="hero-cta">
              <Link to="#mission" className="cta-button primary">Our Mission</Link>
              <Link to="#contact" className="cta-button secondary">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="about-section" ref={aboutRef}>
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Accelerating the Green Energy Transition</h3>
              <p>
                Verdant Hydrogen is dedicated to accelerating the global energy transition. Our mission is to produce,
                store, and distribute green hydrogen at scale, providing a carbon-free energy source to power industries,
                transportation, and communities worldwide.
              </p>
              <p>
                We are committed to technological innovation, operational excellence, and unwavering safety standards to
                build a cleaner, more sustainable planet for future generations.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">🌱</span>
                  <span>Sustainable Production</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Clean Energy Solutions</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span>Carbon Neutrality</span>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="process-diagram">
                <div className="process-step">
                  <div className="step-icon solar">☀️</div>
                  <span>Renewable Energy</span>
                </div>
                <div className="process-arrow">→</div>
                <div className="process-step">
                  <div className="step-icon electrolysis">⚡</div>
                  <span>Electrolysis</span>
                </div>
                <div className="process-arrow">→</div>
                <div className="process-step">
                  <div className="step-icon hydrogen">H₂</div>
                  <span>Green Hydrogen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="metrics-section" ref={metricsRef}>
        <div className="container">
          <h2 className="section-title">Our Impact by the Numbers</h2>
          <div className="metrics-grid">
            <AnimatedCounter target={500} label="MW Electrolyzer Capacity" symbol="+" />
            <AnimatedCounter target={1.2} label="Tons of CO2 Reduced Annually" symbol="M+" />
            <AnimatedCounter target={15} label="Active R&D Projects" symbol="+" />
            <AnimatedCounter target={10} label="Years of Innovation" symbol="+" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values">
        <h2>Our Core Values</h2>
        <p className="lead">The principles that guide everything we do.</p>
        <div className="grid grid-4">
          <div className="card">
            <InnovationIcon />
            <h3>Innovation</h3>
            <p>We relentlessly pursue new technologies and methods to make green hydrogen more efficient and accessible.</p>
          </div>
          <div className="card">
            <SustainabilityIcon />
            <h3>Sustainability</h3>
            <p>Our commitment to the planet is at the heart of every decision we make, from production to delivery.</p>
          </div>
          <div className="card">
            <SafetyIcon />
            <h3>Safety</h3>
            <p>We uphold the most rigorous safety protocols to protect our team, our partners, and our communities.</p>
          </div>
          <div className="card">
            <CollaborationIcon />
            <h3>Collaboration</h3>
            <p>We build strong partnerships to create a powerful, interconnected clean energy ecosystem.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Experts Say</h2>
        <p className="lead">Hear from the heart of our community.</p>
        <div className="grid grid-3">
          <div className="card">
            <img
              src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Dr. Aris Thorne"
            />
            <h3>Dr. Aris Thorne</h3>
            <p className="role">Lead Scientist, R&D</p>
            <blockquote>
              “Working at Verdant Hydrogen allows me to be at the forefront of the energy revolution. The commitment to
              pushing the boundaries of what's possible is truly inspiring.”
            </blockquote>
          </div>
          <div className="card">
            <img
              src="https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Lena Petrova"
            />
            <h3>Lena Petrova</h3>
            <p className="role">Chief Operations Engineer</p>
            <blockquote>
              “The scale of our operations is immense, but our focus on safety and efficiency is even greater. I'm proud
              to lead a team that is building the infrastructure for a cleaner tomorrow.”
            </blockquote>
          </div>
          <div className="card">
            <img
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Kenji Tanaka"
            />
            <h3>Kenji Tanaka</h3>
            <p className="role">Sustainability Partner, EcoVentures</p>
            <blockquote>
              “Partnering with Verdant Hydrogen has been a game-changer for our logistics fleet. Their green hydrogen
              solution is reliable, cost-effective, and a major step towards our corporate carbon-neutral goals.”
            </blockquote>
          </div>
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
              <li>📍 123 Innovation Drive, Metropolis</li>
              <li>📞 (555) 2H2-FUEL</li>
              <li>✉️ info@verdanthydrogen.com</li>
            </ul>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <Link to="#" aria-label="Facebook"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></Link>
              <Link to="#" aria-label="Twitter"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.58-."/></svg></Link>
              <Link to="#" aria-label="Instagram"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></Link>
            </div>
          </div>
          <div>
            <h3>Office Hours</h3>
            <ul>
              <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 4:00 PM</li>
              <li>Sunday: By Appointment Only</li>
            </ul>
            <div className="tip">
              <h4>Quick Tip</h4>
              <p>
                Schedule a virtual tour of our facilities to see our green hydrogen production process in action!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
