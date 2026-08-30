// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  FaLaptopCode, FaMobileAlt, FaGlobe, FaRobot, 
  FaBrain, FaCloud, FaServer, FaAws, 
  FaCheckCircle, FaShoppingCart, FaCloudDownloadAlt,
  FaEnvelope, FaLinkedin, FaUsers, FaTrophy,
  FaReact, FaNodeJs, FaPython, FaDocker, FaFigma, FaDatabase, FaRocket, FaShieldAlt
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

// Firebase Imports
import { auth, googleProvider } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Auth States
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password Registration
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowModal(false);
      setErrorMsg('');
      alert("Account Created Successfully!");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Email/Password Login
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowModal(false);
      setErrorMsg('');
      alert("Logged In Successfully!");
    } catch (error) {
      setErrorMsg("Invalid Email or Password");
    }
  };

  // Google Authentication
  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowModal(false);
      setErrorMsg('');
      alert("Logged In with Google!");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged Out Successfully!");
  };

  const servicesData = [
    {
      title: "Custom Software Development",
      icon: <FaLaptopCode className="card-icon" />,
      desc: "Our core service. Customized software solutions tailored for your business needs.",
      items: ["Custom Business Software", "ERP & CRM Software", "Inventory Management", "HR Management System", "Billing & POS Software", "School/Institute Management"]
    },
    {
      title: "Web Development",
      icon: <FaGlobe className="card-icon" />,
      desc: "High-performance, responsive websites built with React, Next.js, and Node.js.",
      items: ["Business & Corporate Websites", "Portfolio Websites", "E-commerce Websites", "Web Applications", "Admin Dashboards"]
    },
    {
      title: "Mobile App Development",
      icon: <FaMobileAlt className="card-icon" />,
      desc: "Modern and scalable mobile applications built with Flutter and React Native.",
      items: ["Android & iOS Apps", "Cross-platform Apps", "Business & E-commerce Apps", "SaaS Mobile Apps"]
    },
    {
      title: "AI Automation",
      icon: <FaRobot className="card-icon" />,
      desc: "AI-driven automation to make your business operations smarter and more efficient.",
      items: ["Business Process Automation", "AI Chatbots", "Customer Support Automation", "WhatsApp & Email Automation"]
    },
    {
      title: "AI Agent Development",
      icon: <FaBrain className="card-icon" />,
      desc: "Dedicated Artificial Intelligence agents to handle specific tasks for your company.",
      items: ["Customer Support AI Agent", "Sales & Lead Qualification Agent", "HR AI Assistant", "Internal Knowledge Assistant"]
    },
    {
      title: "SaaS Development",
      icon: <FaCloud className="card-icon" />,
      desc: "Complete SaaS product development, transforming startup ideas into reality.",
      items: ["MVP Development", "SaaS Dashboard", "Subscription System", "Payment Integration"]
    },
    {
      title: "API & Backend Development",
      icon: <FaServer className="card-icon" />,
      desc: "Secure, robust, and scalable backend architecture for your applications.",
      items: ["REST APIs Development", "Third-party API Integration", "Payment Gateway Integration", "Authentication Systems"]
    },
    {
      title: "Cloud & DevOps",
      icon: <FaAws className="card-icon" />,
      desc: "Reliable server management and cloud infrastructure solutions.",
      items: ["AWS Deployment", "Cloud Infrastructure", "CI/CD Pipeline", "Docker & Server Management"]
    }
  ];

  const technologiesData = [
    { name: "React.js", icon: <FaReact /> },
    { name: "Node.js", icon: <FaNodeJs /> },
    { name: "Python", icon: <FaPython /> },
    { name: "AWS", icon: <FaAws /> },
    { name: "Docker", icon: <FaDocker /> },
    { name: "Figma", icon: <FaFigma /> },
    { name: "SQL/NoSQL", icon: <FaDatabase /> },
    { name: "Android/iOS", icon: <FaMobileAlt /> }
  ];

  return (
    <div className="app">
      
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="Crodyto Logo" className="logo" />
          <h2>Crodyto</h2>
        </div>
        <ul className="nav-links">
          <li className="dropdown">
            <a href="#services">IT Services</a>
            <ul className="dropdown-content">
              {servicesData.map((service, index) => (
                <li key={index}>
                  <a href={`#service-${index}`}>
                    {index + 1}. {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#technologies">Technologies</a></li>
          <li className="dropdown">
            <a href="#products">Ready Products</a>
          </li>
          <li><a href="#contact">Contact Us</a></li>
          <li>
            {user ? (
              <button className="btn-signin" style={{ backgroundColor: '#e11d48' }} onClick={handleLogout}>
                Logout ({user.email.split('@')[0]})
              </button>
            ) : (
              <button className="btn-signin" onClick={() => { setShowModal(true); setIsSignUp(false); }}>
                Sign In
              </button>
            )}
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">Next-Gen IT & Software Solutions</div>
          <h1>Empowering Your Digital Future with Innovation</h1>
          <p>We transform complex business ideas into high-performing digital realities using AI, Web & Mobile technologies.</p>
          <button className="btn-primary">Book a Free Consultation</button>
        </div>
      </header>

      {/* Company Stats Section */}
      <section className="stats-section">
        <div className="stat-box">
          <FaTrophy className="stat-icon" />
          <h3>350+</h3>
          <p>Projects Delivered</p>
        </div>
        <div className="stat-box">
          <FaUsers className="stat-icon" />
          <h3>45+</h3>
          <p>Expert Employees</p>
        </div>
        <div className="stat-box">
          <FaCheckCircle className="stat-icon" />
          <h3>100%</h3>
          <p>Client Satisfaction</p>
        </div>
      </section>

      {/* About Crodyto Section */}
      <section id="about" className="section about-section">
        <div className="about-container">
          <div className="about-text">
            <span className="about-subtitle">WHO WE ARE</span>
            <h2>Driven by Excellence, Built for Scale</h2>
            <p>
              At <strong>Crodyto</strong>, we build digital products that drive growth and operational efficiency. From bespoke enterprise software to intelligent AI agents, we merge technical expertise with modern design principles.
            </p>
            <p>
              Our collaborative engineering culture ensures that every solution we deploy is secure, scalable, and completely tailored to your business roadmap.
            </p>
            <div className="about-features">
              <div className="about-feature-item">
                <FaCheckCircle className="about-check" /> <span>Cutting-edge AI & Custom Solutions</span>
              </div>
              <div className="about-feature-item">
                <FaCheckCircle className="about-check" /> <span>Elite Engineering & Design Team</span>
              </div>
              <div className="about-feature-item">
                <FaCheckCircle className="about-check" /> <span>Unmatched Performance & Security</span>
              </div>
            </div>
          </div>
          <div className="about-image-box">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Crodyto Team Working Together" 
              className="about-img"
            />
          </div>
        </div>
      </section>

      {/* IT Services Section */}
      <section id="services" className="section">
        <h2 className="section-title">Our Premium IT Services</h2>
        <div className="grid-container">
          {servicesData.map((service, index) => (
            <div className="card service-card" key={index} id={`service-${index}`}>
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="hover-msg">Hover to explore</div>
              <ul className="service-list">
                {service.items.map((item, i) => (
                  <li key={i}>
                    <FaCheckCircle className="check-icon" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="section tech-section">
        <h2 className="section-title" style={{ color: 'white' }}>Technologies We Master</h2>
        <div className="tech-grid">
          {technologiesData.map((tech, index) => (
            <div className="tech-card" key={index}>
              <div className="tech-icon">{tech.icon}</div>
              <h4>{tech.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Ready Products Section */}
      <section id="products" className="section">
        <h2 className="section-title">Ready Scripts & Applications</h2>
        <div className="grid-container">
          <div className="card product-card">
            <FaShoppingCart className="card-icon" />
            <h3>E-Commerce Web Template</h3>
            <div className="product-details">
              <p>A fully functional e-commerce React template ready for deployment.</p>
              <div className="price">$49.00</div>
              <button className="btn-buy"><FaCloudDownloadAlt /> Buy Now</button>
            </div>
          </div>
          <div className="card product-card">
            <FaMobileAlt className="card-icon" />
            <h3>Food Delivery App UI</h3>
            <div className="product-details">
              <p>Complete cross-platform Flutter UI kit for food delivery businesses.</p>
              <div className="price">$39.00</div>
              <button className="btn-buy"><FaCloudDownloadAlt /> Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-icon-wrapper">
            <FaRocket />
          </div>
          <h2>Ready to transform your ideas into reality?</h2>
          <p>Let's discuss how Crodyto can accelerate your business with cutting-edge technology.</p>
          <a href="#contact" className="btn-cta">Start Your Project Today</a>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="footer">
        <h2>Get in Touch with Crodyto</h2>
        <p>Let's build something amazing together!</p>
        
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope style={{ color: '#38bdf8' }} />
            <a href="mailto:crodyto@gmail.com">crodyto@gmail.com</a>
          </div>
          <div className="contact-item">
            <FaLinkedin style={{ color: '#38bdf8' }} />
            <a href="https://www.linkedin.com/company/crodyto" target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </div>
        </div>

        <p style={{ marginTop: '30px', fontSize: '0.9rem', color: '#64748b' }}>
          © {new Date().getFullYear()} Crodyto IT Services & Consulting. All rights reserved.
        </p>
      </footer>

      {/* Auth Modal (Sign In / Sign Up) */}
      {showModal && !user && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
            <h2>{isSignUp ? "Create an Account" : "Sign In to Crodyto"}</h2>
            
            {/* Error Message Display */}
            {errorMsg && <p style={{ color: '#e11d48', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>{errorMsg}</p>}

            <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Password (Min 6 chars)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '5px' }}>
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>

            <div className="divider">OR</div>

            {/* Google Authentication Button */}
            <button className="google-btn" onClick={handleGoogleAuth}>
              <FcGoogle className="google-icon" />
              {isSignUp ? "Sign up with Google" : "Sign in with Google"}
            </button>

            {/* Toggle between Login and Register */}
            <div className="auth-switch">
              {isSignUp ? (
                <p>Already have an account? <span onClick={() => {setIsSignUp(false); setErrorMsg('');}}>Sign In</span></p>
              ) : (
                <p>Don't have an account? <span onClick={() => {setIsSignUp(true); setErrorMsg('');}}>Sign Up</span></p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;