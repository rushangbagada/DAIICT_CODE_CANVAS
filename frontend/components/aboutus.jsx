import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EnhancedNavbar from './EnhancedNavbar';
import './css/AboutUs.css';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    gsap.fromTo('.about-hero-title', 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );
    
    gsap.fromTo('.about-hero-subtitle', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, delay: 0.3, ease: "power3.out" }
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

    gsap.fromTo('.team-card', 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.team-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Floating animation for hero elements
    gsap.to('.floating-element', {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

  }, []);

  return (
    <div className="about-us-page">
      {/* Enhanced Navigation */}
      <EnhancedNavbar />

      {/* Hero Section */}
      <section className="about-hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="particle-field"></div>
        </div>
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1 className="about-hero-title">
              About <span className="highlight">Our Mission</span>
            </h1>
            <p className="about-hero-subtitle">
              Pioneering the future of sustainable technology and innovation. 
              Building tomorrow's solutions today with passion and purpose.
            </p>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="mission-section" ref={missionRef}>
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-content">
            <div className="mission-text">
              <h3>Driving Sustainable Innovation</h3>
              <p>
                We are committed to revolutionizing the way the world thinks about clean energy 
                and sustainable technology. Our mission is to accelerate the global transition 
                to renewable energy through cutting-edge green hydrogen solutions.
              </p>
              <p>
                By combining advanced research, innovative engineering, and strategic partnerships, 
                we're creating a cleaner, more sustainable future for generations to come. 
                Every project we undertake contributes to reducing global carbon emissions 
                and building a resilient energy ecosystem.
              </p>
              <div className="mission-stats">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Countries Served</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Tons CO₂ Reduced</span>
                </div>
              </div>
            </div>
            <div className="mission-visual floating-element">
              <div className="mission-icon-container">
                <div className="mission-icon">🌱</div>
                <div className="icon-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="vision-section" ref={visionRef}>
        <div className="container">
          <h2 className="section-title">Our Vision</h2>
          <div className="vision-content">
            <div className="vision-cards">
              <div className="vision-card">
                <div className="vision-icon">🚀</div>
                <h3>Innovation Leadership</h3>
                <p>Leading the charge in breakthrough technologies that reshape industries and create new possibilities for sustainable development.</p>
              </div>
              <div className="vision-card">
                <div className="vision-icon">🌍</div>
                <h3>Global Impact</h3>
                <p>Expanding our reach across continents to create a worldwide network of clean energy solutions and environmental stewardship.</p>
              </div>
              <div className="vision-card">
                <div className="vision-icon">⚡</div>
                <h3>Energy Future</h3>
                <p>Building the foundation for a hydrogen-powered economy that ensures energy security and environmental sustainability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="values-section" ref={valuesRef}>
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Excellence</h3>
              <p>We pursue excellence in every project, maintaining the highest standards of quality and performance in all our endeavors.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>We believe in the power of partnership, working closely with clients, communities, and stakeholders to achieve shared goals.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌿</div>
              <h3>Sustainability</h3>
              <p>Environmental responsibility is at the heart of everything we do, ensuring our solutions benefit both people and the planet.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We constantly push boundaries, embracing new technologies and methodologies to solve tomorrow's challenges today.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Integrity</h3>
              <p>We conduct business with transparency, honesty, and ethical practices that build trust and lasting relationships.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Learning</h3>
              <p>We foster a culture of continuous learning and growth, staying ahead of industry trends and technological advances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section" ref={teamRef}>
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-intro">
            <p>
              Our diverse team of experts combines decades of experience in renewable energy, 
              engineering, and sustainable technology to deliver world-class solutions.
            </p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👨‍💼</div>
              </div>
              <h3>Dr. Alex Chen</h3>
              <p className="team-role">Chief Technology Officer</p>
              <p className="team-bio">15+ years in renewable energy research and hydrogen technology development.</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👩‍💼</div>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="team-role">Head of Engineering</p>
              <p className="team-bio">Expert in electrolyzer design and green hydrogen production systems.</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👨‍💼</div>
              </div>
              <h3>Dr. Rajesh Patel</h3>
              <p className="team-role">Director of Research</p>
              <p className="team-bio">Leading researcher in sustainable energy solutions and climate technology.</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👩‍💼</div>
              </div>
              <h3>Maria Rodriguez</h3>
              <p className="team-role">Operations Manager</p>
              <p className="team-bio">Specialist in project management and sustainable operations optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join Our Mission?</h2>
            <p>Connect with us to explore partnership opportunities and learn more about our innovative solutions.</p>
            <div className="cta-buttons">
              <button className="cta-button primary">Get in Touch</button>
              <button className="cta-button secondary">View Careers</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
