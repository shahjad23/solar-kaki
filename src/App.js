import React, { useState, useRef } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';
import { 
  FaPhone, FaBolt, FaWind, FaTools, 
  FaFileSignature, FaArrowRight, FaMapMarkerAlt, FaUserTie, FaCheckCircle, FaSpinner
} from 'react-icons/fa';

// --- 1. IMPORT LOCAL IMAGES ---
import imgInv25 from './assets/images/inverter-25kw.jpg';
import imgInv8 from './assets/images/inverter-8kw.jpg';
import imgInv20 from './assets/images/inverter-20kw.jpg';
import imgHyb3000 from './assets/images/hybrid-3000.jpg';
import imgPanelBi from './assets/images/panel-bifacial.jpg';
import imgPanelMono from './assets/images/panel-mono.jpg';
import imgBattery from './assets/images/battery-165ah.jpg';


// --- 2. MULTI-BRAND CATALOG DATA ---
const productsData = [
  {
    category: "Solar Inverters (Authorised Dealer)",
    items: [
      { 
        id: 1, 
        name: "UTL Gamma+ rMPPT Solar PCU", 
        brand: "UTL Solar",
        desc: "Best for home backup",
        price: "₹ 14,500 approx", 
        image: imgHyb3000 // Using your hybrid image
      },
      { 
        id: 2, 
        name: "Fujiyama 10kW On-Grid Inverter", 
        brand: "Fujiyama",
        desc: "High efficiency for Net Metering",
        price: "Contact for Price", 
        image: imgInv8 
      },
      { 
        id: 3, 
        name: "Luminous NXi Grid Tie (20kW)", 
        brand: "Luminous",
        desc: "3-Phase Commercial Inverter",
        price: "Best Market Rate", 
        image: imgInv20 
      },
    ]
  },
  {
    category: "Solar Panels (Wholesale Rates)",
    items: [
      { 
        id: 4, 
        name: "Tata Power 550W Bifacial", 
        brand: "Tata Power",
        desc: "Generates power from both sides",
        price: "₹ 16/Watt", 
        image: imgPanelBi 
      },
      { 
        id: 5, 
        name: "Waaree 540W Mono PERC", 
        brand: "Waaree",
        desc: "High efficiency half-cut cells",
        price: "₹ 15/Watt", 
        image: imgPanelMono 
      },
    ]
  },
  {
    category: "Solar Batteries & Accessories",
    items: [
      { 
        id: 6, 
        name: "UTL UST 1650 (165Ah) C10", 
        brand: "UTL Solar",
        desc: "5-Year Replacement Warranty",
        price: "₹ 12,500", 
        image: imgBattery 
      },
      { 
        id: 7, 
        name: "ACDB & DCDB Protection Box", 
        brand: "Kaki Custom",
        desc: "With SPD and MCB Protection",
        price: "₹ 3,500", 
        image: imgInv25 // Using generic tech image as placeholder
      },
    ]
  }
];

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="navbar">
    <div className="container nav-container">
      <div className="logo">
        <FaBolt className="logo-icon" /> Kaki<span className="brand-highlight">Industries</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#about">Contact</a></li>
      </ul>
      <a href="tel:+9195959995626" className="btn-glass">
        <FaPhone className="icon-gap" /> Call Now
      </a>
    </div>
  </nav>
);

const Hero = () => {
  const [focused, setFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors
  const form = useRef();

  // --- KEYS POOL ---
  const KEYS_POOL = [
    { 
      service: process.env.REACT_APP_SERVICE_ID_1, 
      template: process.env.REACT_APP_TEMPLATE_ID_1, 
      key: process.env.REACT_APP_PUBLIC_KEY_1 
    },
    { 
      service: process.env.REACT_APP_SERVICE_ID_2, 
      template: process.env.REACT_APP_TEMPLATE_ID_2, 
      key: process.env.REACT_APP_PUBLIC_KEY_2 
    },
    { 
      service: process.env.REACT_APP_SERVICE_ID_3, 
      template: process.env.REACT_APP_TEMPLATE_ID_3, 
      key: process.env.REACT_APP_PUBLIC_KEY_3 
    }
  ];

  // --- STRICT VALIDATION LOGIC ---
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    
    // Get values directly from the form reference
    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    // const email = formData.get('user_email');
    const phone = formData.get('user_phone');

    // 1. Name Validation
    if (!name || name.trim().length < 2) {
      newErrors.user_name = "Name is required (min 2 chars)";
      isValid = false;
    }

    // 2. Mobile Validation (Indian Format: Starts with 6-9, 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.user_phone = "Enter valid 10-digit mobile number";
      isValid = false;
    }

    // // 3. Email Validation (Standard Regex)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email || !emailRegex.test(email)) {
    //   newErrors.user_email = "Enter a valid email address";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // STOP if validation fails
    if (!validateForm()) {
      return; 
    }

    setIsSending(true);

    // Pick random account
    const account = KEYS_POOL[Math.floor(Math.random() * KEYS_POOL.length)];
    
    if (!account.service || !account.key) {
        alert("API Keys missing. Check .env file.");
        setIsSending(false);
        return;
    }

    emailjs.sendForm(account.service, account.template, form.current, account.key)
      .then((result) => {
          alert("Message Sent! Mr. Aslam Siddiqui will contact you shortly.");
          setIsSending(false);
          e.target.reset();
          setErrors({}); // Clear errors on success
      }, (error) => {
          console.error("Email Error:", error);
          alert("Network Busy. Please call +91 95959995626 directly.");
          setIsSending(false);
      });
  };

  return (
    <header id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-container">
        
        {/* Left Content */}
        <div className="hero-text">
          <div className="badge-glow">
            <span className="dot"></span> Authorized Distributor
          </div>
          <h1>Powering Nagpur with <span className="text-gradient">Sustainable Energy</span></h1>
          <p className="hero-subtext">
            Kaki Industries Private Limited is your trusted partner for Solar Inverters, Panels, and Batteries. 
            <strong> Premium Quality. Best Prices. Expert Service.</strong>
          </p>
          
          <div className="usp-row">
            <div className="usp-item">
              <FaCheckCircle className="usp-icon" />
              <span>GST Registered</span>
            </div>
            <div className="usp-item">
              <FaCheckCircle className="usp-icon" />
              <span>Original Products</span>
            </div>
            <div className="usp-item">
              <FaCheckCircle className="usp-icon" />
              <span>Nagpur Based</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className={`hero-form-card ${focused ? 'card-active' : ''}`}>
          <div className="form-header">
            <h3>Get Best Price Quote</h3>
            <p>Fill details to get a callback from owner</p>
          </div>
          
          <form ref={form} onSubmit={sendEmail} noValidate>
            
            {/* NAME INPUT */}
            <div className={`input-group ${errors.user_name ? 'input-error' : ''}`}>
              <input 
                type="text" name="user_name" placeholder=" " 
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                // Removing 'required' attribute to let JS handle validation
              />
              <label>Full Name</label>
              {errors.user_name && <span className="error-msg">{errors.user_name}</span>}
            </div>
            
            {/* EMAIL INPUT (NEW)
            <div className={`input-group ${errors.user_email ? 'input-error' : ''}`}>
              <input 
                type="email" name="user_email" placeholder=" " 
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              />
              <label>Email Address</label>
              {errors.user_email && <span className="error-msg">{errors.user_email}</span>}
            </div> */}

            {/* PHONE INPUT */}
            <div className={`input-group ${errors.user_phone ? 'input-error' : ''}`}>
              <div className="prefix">+91</div>
              <input 
                type="tel" name="user_phone" placeholder=" " className="has-prefix"
                maxLength="10"
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Only allow numbers
              />
              <label className="label-with-prefix">Mobile Number</label>
              {errors.user_phone && <span className="error-msg" style={{marginLeft: '55px'}}>{errors.user_phone}</span>}
            </div>

            {/* INTEREST SELECT */}
            <div className="select-group">
              <label>Interested In?</label>
              <select name="user_interest">
                <option value="FullSystem">Complete System</option>
                <option value="Inverter">Solar Inverter</option>
                <option value="Panel">Solar Panels</option>
                <option value="Battery">Inverter Battery</option>
              </select>
            </div>

            <button type="submit" className="btn-gradient" disabled={isSending}>
              {isSending ? (
                 <span><FaSpinner className="spinner" /> Sending...</span>
              ) : (
                 <span>Request Callback <FaArrowRight className="icon-gap" /></span>
              )}
            </button>
            <small className="secure-text"><FaFileSignature /> Direct contact with Kaki Industries</small>
          </form>
        </div>
      </div>
    </header>
  );
};

const Products = () => {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title text-center">India's Top <span className="text-blue">Solar Brands</span></h2>
        <p className="section-desc text-center">
          We are authorized distributors for UTL, Fujiyama, Tata Power, and Luminous.
          <br/>Below are our trending best-sellers.
        </p>
        
        {productsData.map((category, index) => (
          <div key={index} className="category-block">
            <h3 className="category-title">{category.category}</h3>
            <div className="products-grid">
              {category.items.map((item) => (
                <div key={item.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url(${item.image})`}}>
                    <span className="brand-badge">{item.brand}</span>
                  </div>
                  <div className="product-info">
                    <h4>{item.name}</h4>
                    <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '5px'}}>{item.desc}</p>
                    <div className="price-tag">{item.price}</div>
                    <button className="btn-sm" onClick={() => window.location.href='#home'}>Get Quote</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* NEW: Button for "More Products" */}
        <div style={{textAlign: 'center', marginTop: '50px'}}>
           <p style={{marginBottom: '15px', color: '#64748b'}}>Looking for cables, structures, or industrial inverters?</p>
           <button className="btn-gradient" style={{maxWidth: '300px', margin: '0 auto'}} onClick={() => window.location.href='#home'}>
             Download Full Price List <FaArrowRight className="icon-gap" />
           </button>
        </div>

      </div>
    </section>
  );
};


const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-box">
            <div className="icon-circle gradient-1"><FaBolt /></div>
            <h4>Wide Range</h4>
            <p>Distributor of UTL Inverters, Panels, and ACDB Boxes.</p>
          </div>
          <div className="feature-box">
            <div className="icon-circle gradient-2"><FaWind /></div>
            <h4>Govt Subsidy</h4>
            <p>We handle all paperwork. Up to ₹78,000 subsidy is assured.</p>
          </div>
          <div className="feature-box">
            <div className="icon-circle gradient-3"><FaTools /></div>
            <h4>5-Year Maintenance</h4>
            <p>Includes quarterly deep cleaning, health checks & repairs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="about" className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <h3>Kaki Industries Pvt Ltd</h3>
        <p>Your partner for a greener, sustainable future. <br/>Trader, Wholesaler & Distributor.</p>
      </div>
      
      <div className="footer-contact">
        <h4>Contact Information</h4>
        <div className="contact-item">
          <FaUserTie className="c-icon" /> 
          <div>
            <strong>Mr. Aslam Siddiqui</strong> (Owner)
          </div>
        </div>
        <div className="contact-item">
          <FaPhone className="c-icon" /> 
          <div>
            <a href="tel:95959995626" className="phone-link">+91 95959995626</a>
          </div>
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="c-icon" />
          <address>
            54, Babulkheda, Welekar Nagar,<br/>
            Shivam Hair Salon,<br/>
            Nagpur-440027, Maharashtra, India
          </address>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2026 Kaki Industries Private Limited. All rights reserved.</p>
    </div>
  </footer>
);

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Footer />
    </div>
  );
}

export default App;