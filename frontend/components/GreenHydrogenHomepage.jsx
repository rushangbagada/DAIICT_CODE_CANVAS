import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import EnhancedNavbar from './EnhancedNavbar';
import './css/GreenHydrogenHomepage.css';

gsap.registerPlugin(ScrollTrigger);

const HydrogenMoleculeModel = ({ containerId }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Enhanced scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced molecule group with better structure
    const moleculeGroup = new THREE.Group();
    
    // Enhanced atom geometry with better materials
    const atomGeometry = new THREE.SphereGeometry(0.6, 64, 32);
    const atomMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x39ff14,
      transparent: true,
      opacity: 0.9,
      emissive: 0x004411,
      shininess: 100,
      specular: 0x00ff88
    });
    
    // Create hydrogen atoms with enhanced positioning
    const atom1 = new THREE.Mesh(atomGeometry, atomMaterial);
    const atom2 = new THREE.Mesh(atomGeometry, atomMaterial);
    atom1.position.set(-1.2, 0, 0);
    atom2.position.set(1.2, 0, 0);
    atom1.castShadow = true;
    atom2.castShadow = true;
    
    // Enhanced bond with better geometry
    const bondGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.4, 16);
    const bondMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00d764,
      emissive: 0x002211,
      shininess: 50
    });
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);
    bond.rotation.z = Math.PI / 2;
    bond.castShadow = true;
    
    // Add orbital rings for visual enhancement
    const ringGeometry = new THREE.TorusGeometry(1.8, 0.05, 8, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x39ff14,
      transparent: true,
      opacity: 0.3
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    
    moleculeGroup.add(atom1, atom2, bond, ring1, ring2);
    scene.add(moleculeGroup);

    // Enhanced particle system with more dynamic behavior
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
      
      // Add random velocities
      particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
      color: 0x39ff14,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    const directionalLight1 = new THREE.DirectionalLight(0x39ff14, 1.5);
    const directionalLight2 = new THREE.DirectionalLight(0x00d764, 1);
    const pointLight = new THREE.PointLight(0x00ff88, 2, 10);
    
    directionalLight1.position.set(5, 5, 5);
    directionalLight2.position.set(-5, -3, 3);
    pointLight.position.set(0, 0, 3);
    
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    
    scene.add(ambientLight, directionalLight1, directionalLight2, pointLight);

    camera.position.set(0, 0, 8);

    // Mouse interaction
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('mouseenter', handleMouseEnter);
    mountRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Enhanced animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Enhanced molecule rotation with mouse interaction
      const targetRotationY = isHovering.current ? 
        time * 0.5 + mouseRef.current.x * 0.3 : 
        time * 0.3;
      const targetRotationX = isHovering.current ? 
        mouseRef.current.y * 0.2 + Math.sin(time) * 0.1 : 
        Math.sin(time) * 0.1;
      
      moleculeGroup.rotation.y += (targetRotationY - moleculeGroup.rotation.y) * 0.05;
      moleculeGroup.rotation.x += (targetRotationX - moleculeGroup.rotation.x) * 0.05;
      
      // Enhanced orbital ring animations
      const rings = [moleculeGroup.children[3], moleculeGroup.children[4]];
      rings[0].rotation.z = time * 0.8;
      rings[1].rotation.z = time * -0.6;
      rings[1].rotation.x = -Math.PI / 4 + Math.sin(time) * 0.1;
      
      // Dynamic particle animation with mouse interaction
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Add floating motion
        positions[i + 1] += Math.sin(time + i * 0.01) * 0.01;
        
        // Mouse attraction effect
        if (isHovering.current) {
          const dx = mouseRef.current.x * 5 - positions[i];
          const dy = mouseRef.current.y * 5 - positions[i + 1];
          positions[i] += dx * 0.002;
          positions[i + 1] += dy * 0.002;
        }
        
        // Keep particles in bounds
        const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
        if (distance > 12) {
          positions[i] *= 0.95;
          positions[i + 1] *= 0.95;
          positions[i + 2] *= 0.95;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Rotate entire particle system
      particles.rotation.y = time * 0.1;
      particles.rotation.z = Math.sin(time * 0.5) * 0.1;
      
      // Dynamic lighting effects
      pointLight.intensity = 2 + Math.sin(time * 2) * 0.5;
      pointLight.position.x = Math.cos(time) * 2;
      pointLight.position.z = 3 + Math.sin(time) * 1;
      
      // Scale effect on hover
      const targetScale = isHovering.current ? 1.1 : 1.0;
      moleculeGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      
      renderer.render(scene, camera);
    };

    sceneRef.current = scene;
    rendererRef.current = renderer;
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="model-container" id={containerId} />;
};

const FuelCellModel = ({ containerId }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create fuel cell structure
    const fuelCellGroup = new THREE.Group();
    
    // Main cell body
    const cellGeometry = new THREE.BoxGeometry(2, 1, 0.2);
    const cellMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00aa55,
      transparent: true,
      opacity: 0.9
    });
    const mainCell = new THREE.Mesh(cellGeometry, cellMaterial);
    
    // Electrodes
    const electrodeGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.05);
    const electrodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff99 });
    
    const anode = new THREE.Mesh(electrodeGeometry, electrodeMaterial);
    anode.position.z = 0.15;
    
    const cathode = new THREE.Mesh(electrodeGeometry, electrodeMaterial);
    cathode.position.z = -0.15;
    
    fuelCellGroup.add(mainCell, anode, cathode);
    scene.add(fuelCellGroup);

    // Energy flow particles
    const energyParticles = [];
    for (let i = 0; i < 20; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x88ff00,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      energyParticles.push(particle);
      scene.add(particle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(ambientLight, directionalLight);

    camera.position.set(0, 0, 4);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate fuel cell slowly
      fuelCellGroup.rotation.y += 0.008;
      
      // Animate energy particles
      energyParticles.forEach((particle, index) => {
        particle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        particle.position.x += Math.cos(Date.now() * 0.001 + index) * 0.001;
      });
      
      renderer.render(scene, camera);
    };

    sceneRef.current = scene;
    rendererRef.current = renderer;
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="model-container" id={containerId} />;
};

// Animated Counter Component
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

const GreenHydrogenHomepage = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const advantagesRef = useRef(null);
  const metricsRef = useRef(null);
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

    gsap.fromTo('.advantage-card', 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.advantages-grid',
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
              The Future of <span className="highlight">Clean Energy</span>
            </h1>
            <p className="hero-subtitle">
              Powering tomorrow with green hydrogen technology. 
              Zero emissions, infinite possibilities.
            </p>
            <div className="hero-cta">
              <button className="cta-button primary">Explore Solutions</button>
              <button className="cta-button secondary">Watch Demo</button>
            </div>
          </div>
          <div className="hero-model floating-element">
            <HydrogenMoleculeModel containerId="hero-molecule" />
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* About Green Hydrogen Section */}
      <section id="about" className="about-section" ref={aboutRef}>
        <div className="container">
          <h2 className="section-title">About Green Hydrogen</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>The Clean Energy Revolution</h3>
              <p>
                Green hydrogen is produced through electrolysis powered by renewable energy sources, 
                creating a completely clean and sustainable fuel. Unlike conventional hydrogen production 
                methods, green hydrogen generates zero carbon emissions.
              </p>
              <p>
                As the world transitions to sustainable energy, green hydrogen emerges as a critical 
                solution for hard-to-decarbonize sectors including heavy industry, transportation, 
                and energy storage.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">🌱</span>
                  <span>100% Renewable</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>High Energy Density</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span>Versatile Storage</span>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="process-diagram">
                <div className="process-step">
                  <div className="step-icon solar">☀️</div>
                  <span>Solar/Wind Energy</span>
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

      {/* Advantages & Applications Section */}
      <section id="advantages" className="advantages-section" ref={advantagesRef}>
        <div className="container">
          <h2 className="section-title">Advantages & Applications</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="card-icon">🏭</div>
              <h3>Industrial Applications</h3>
              <p>Steel production, chemical processes, and heavy manufacturing benefit from hydrogen's high-temperature capabilities.</p>
            </div>
            <div className="advantage-card">
              <div className="card-icon">🚛</div>
              <h3>Transportation</h3>
              <p>Fuel cell vehicles, shipping, and aviation leverage hydrogen's energy density for long-range, heavy-duty applications.</p>
            </div>
            <div className="advantage-card">
              <div className="card-icon">🔋</div>
              <h3>Energy Storage</h3>
              <p>Store renewable energy long-term and provide grid stability during periods of high demand or low generation.</p>
            </div>
            <div className="advantage-card">
              <div className="card-icon">🌍</div>
              <h3>Global Impact</h3>
              <p>Reduce global CO₂ emissions by up to 6 gigatons annually by 2050, supporting climate goals.</p>
            </div>
            <div className="advantage-card">
              <div className="card-icon">💼</div>
              <h3>Economic Growth</h3>
              <p>Create millions of jobs and drive innovation in the emerging hydrogen economy.</p>
            </div>
            <div className="advantage-card">
              <div className="card-icon">🔧</div>
              <h3>Versatility</h3>
              <p>From heating homes to powering rockets, hydrogen's versatility makes it invaluable across sectors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section id="metrics" className="metrics-section" ref={metricsRef}>
        <div className="container">
          <h2 className="section-title">Green Hydrogen by the Numbers</h2>
          <div className="metrics-grid">
            <AnimatedCounter target={500} label="Billion Market by 2030" symbol="B+" />
            <AnimatedCounter target={85} label="Countries with H₂ Strategies" />
            <AnimatedCounter target={6} label="Gigatons CO₂ Reduction Potential" symbol="GT" />
            <AnimatedCounter target={30} label="Million Jobs by 2030" symbol="M+" />
          </div>
          <div className="fuel-cell-showcase">
            <div className="showcase-content">
              <h3>Advanced Fuel Cell Technology</h3>
              <p>Our cutting-edge fuel cells convert hydrogen into electricity with 60% efficiency, 
                 providing clean power for various applications.</p>
            </div>
            <div className="showcase-model">
              <FuelCellModel containerId="fuel-cell-model" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section" ref={contactRef}>
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Ready to Go Green?</h3>
              <p>
                Join the hydrogen revolution. Contact our team to learn how green hydrogen 
                can transform your operations and contribute to a sustainable future.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@greenhydrogen.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Clean Energy Blvd, Future City</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Full Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Company" />
                </div>
                <div className="form-group">
                  <textarea placeholder="How can we help you?" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GreenHydrogenHomepage;
