import React, { useState, useRef } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';
import {
  FaPhoneAlt, FaBolt, FaTools, FaSolarPanel, FaRupeeSign, FaWhatsapp,
  FaArrowRight, FaMapMarkerAlt, FaUserTie, FaCheck, FaSpinner, FaLock
} from 'react-icons/fa';

// --- LOCAL IMAGES ---
import imgInv25 from './assets/images/inverter-25kw.jpg';
import imgInv8 from './assets/images/inverter-8kw.jpg';
import imgInv20 from './assets/images/inverter-20kw.jpg';
import imgHyb3000 from './assets/images/hybrid-3000.jpg';
import imgPanelBi from './assets/images/panel-bifacial.jpg';
import imgPanelMono from './assets/images/panel-mono.jpg';
import imgBattery from './assets/images/battery-165ah.jpg';
import { Contact } from 'lucide-react';

// --- CONTACT (change the number here and it updates everywhere) ---
const PHONE_DIGITS = '9595995626';
const PHONE_DISPLAY = `+91 ${PHONE_DIGITS}`;
const PHONE_TEL = `tel:+91${PHONE_DIGITS}`;
const WHATSAPP_URL = `https://wa.me/91${PHONE_DIGITS}?text=${encodeURIComponent('Hello Kaki Industries, please share your latest price list.')}`;
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Welekar Nagar, Babulkheda, Nagpur 440027');

// --- CATALOG ---
const productsData = [
  {
    category: 'Solar Inverters (Authorised Dealer)',
    interest: 'Inverter',
    items: [
      { id: 1, name: 'UTL Gamma+ rMPPT Solar PCU', brand: 'UTL Solar', desc: 'Best for home backup', price: 'Contact for Price', image: imgHyb3000 },
      { id: 2, name: 'Fujiyama 10kW On-Grid Inverter', brand: 'Fujiyama', desc: 'High efficiency for Net Metering', price: 'Contact for Price', image: imgInv8 },
      { id: 3, name: 'Luminous NXi Grid Tie (20kW)', brand: 'Luminous', desc: '3-Phase Commercial Inverter', price: 'Best Market Rate', image: imgInv20 },
    ],
  },
  {
    category: 'Solar Panels (Wholesale Rates)',
    interest: 'Panel',
    items: [
      { id: 4, name: 'Tata Power 550W Bifacial', brand: 'Tata Power', desc: 'Generates power from both sides', price: 'Contact for Price', image: imgPanelBi },
      { id: 5, name: 'Waaree 540W Mono PERC', brand: 'Waaree', desc: 'High efficiency half-cut cells', price: 'Best Market Rate', image: imgPanelMono },
    ],
  },
  {
    category: 'Solar Batteries & Accessories',
    interest: 'Battery',
    items: [
      { id: 6, name: 'UTL UST 1650 (165Ah) C10', brand: 'UTL Solar', desc: '5-Year Replacement Warranty', price: 'Contact for Price', image: imgBattery },
      { id: 7, name: 'ACDB & DCDB Protection Box', brand: 'Kaki Custom', desc: 'With SPD and MCB Protection', price: 'Best Market Rate', image: imgInv25 },
    ],
  },
];

const BRANDS = ['UTL Solar', 'Fujiyama', 'Tata Power', 'Luminous', 'Waaree'];

// Jump to the quote form with the right product pre-selected
const requestQuote = (interest) => {
  const select = document.querySelector('select[name="user_interest"]');
  if (select && interest) select.value = interest;
  document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => document.querySelector('input[name="user_name"]')?.focus({ preventScroll: true }), 600);
};

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="navbar" aria-label="Main">
    <div className="container nav-container">
      <a href="#home" className="logo">
        <span className="logo-mark"><FaBolt /></span> Kaki Industries
      </a>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#about">Contact</a></li>
      </ul>
      <a href={PHONE_TEL} className="btn btn-outline btn-small">
        <FaPhoneAlt /> Call now
      </a>
    </div>
  </nav>
);

const Hero = () => {
  const [focused, setFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'ok' | 'fail', text }
  const form = useRef();

  // Up to 3 EmailJS accounts, picked at random to spread the free quota
  const KEYS_POOL = [
    { service: process.env.REACT_APP_SERVICE_ID_1, template: process.env.REACT_APP_TEMPLATE_ID_1, key: process.env.REACT_APP_PUBLIC_KEY_1 },
    { service: process.env.REACT_APP_SERVICE_ID_2, template: process.env.REACT_APP_TEMPLATE_ID_2, key: process.env.REACT_APP_PUBLIC_KEY_2 },
    { service: process.env.REACT_APP_SERVICE_ID_3, template: process.env.REACT_APP_TEMPLATE_ID_3, key: process.env.REACT_APP_PUBLIC_KEY_3 },
  ].filter((a) => a.service && a.template && a.key);

  const validateForm = () => {
    const newErrors = {};
    const data = new FormData(form.current);
    const name = data.get('user_name');
    const phone = data.get('user_phone');

    if (!name || name.trim().length < 2) newErrors.user_name = 'Enter your name (at least 2 letters)';
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) newErrors.user_phone = 'Enter a valid 10-digit mobile number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validateForm()) return;

    if (KEYS_POOL.length === 0) {
      setStatus({ type: 'fail', text: `The form is not set up yet. Please call ${PHONE_DISPLAY}.` });
      return;
    }

    setIsSending(true);
    const account = KEYS_POOL[Math.floor(Math.random() * KEYS_POOL.length)];
    const formEl = e.target;

    emailjs.sendForm(account.service, account.template, form.current, account.key).then(
      () => {
        setStatus({ type: 'ok', text: 'Request sent. Mr. Aslam Siddiqui will call you shortly.' });
        setIsSending(false);
        formEl.reset();
        setErrors({});
      },
      (error) => {
        console.error('Email Error:', error);
        setStatus({ type: 'fail', text: `Could not send your request. Please call ${PHONE_DISPLAY}.` });
        setIsSending(false);
      }
    );
  };

  return (
    <header id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-text">
          <div className="badge-glow"><span className="dot" /> Authorised distributor</div>
          <h1>Solar inverters, panels and batteries for Nagpur, at distributor rates</h1>
          <p className="hero-subtext">
            Kaki Industries Private Limited supplies genuine solar equipment to homes, shops and factories.
            <strong> Original products, clear prices and service you can call.</strong>
          </p>
          <ul className="usp-row">
            <li className="usp-item"><FaCheck className="usp-icon" /> GST registered</li>
            <li className="usp-item"><FaCheck className="usp-icon" /> Original products</li>
            <li className="usp-item"><FaCheck className="usp-icon" /> Nagpur based</li>
          </ul>
        </div>

        <div id="quote" className={`hero-form-card ${focused ? 'card-active' : ''}`}>
          <div className="form-header">
            <h3>Get a price quote</h3>
            <p>Leave your number and the owner will call you back.</p>
          </div>

          <form ref={form} onSubmit={sendEmail} noValidate>
            <div className={`input-group ${errors.user_name ? 'input-error' : ''}`}>
              <input id="f-name" type="text" name="user_name" placeholder=" " autoComplete="name"
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
              <label htmlFor="f-name">Full name</label>
              {errors.user_name && <span className="error-msg">{errors.user_name}</span>}
            </div>

            <div className={`input-group ${errors.user_phone ? 'input-error' : ''}`}>
              <div className="prefix">+91</div>
              <input id="f-phone" type="tel" name="user_phone" placeholder=" " className="has-prefix"
                maxLength="10" inputMode="numeric" autoComplete="tel-national"
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
              <label htmlFor="f-phone" className="label-with-prefix">Mobile number</label>
              {errors.user_phone && <span className="error-msg">{errors.user_phone}</span>}
            </div>

            <div className="select-group">
              <label htmlFor="f-interest">I want to buy</label>
              <select id="f-interest" name="user_interest" defaultValue="FullSystem">
                <option value="FullSystem">Complete solar system</option>
                <option value="Inverter">Solar inverter</option>
                <option value="Panel">Solar panels</option>
                <option value="Battery">Inverter battery</option>
              </select>
            </div>

            <button type="submit" className="btn btn-sun btn-block" disabled={isSending}>
              {isSending ? (<><FaSpinner className="spinner" /> Sending</>) : (<>Request callback <FaArrowRight /></>)}
            </button>
            <small className="secure-text"><FaLock /> Goes straight to Kaki Industries</small>
            {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
          </form>
        </div>
      </div>
    </header>
  );
};

const BrandStrip = () => (
  <section className="brand-strip" aria-label="Brands we supply">
    <div className="container brand-strip-inner">
      <p>Brands we supply</p>
      <ul className="brand-list">
        {BRANDS.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  </section>
);

const Features = () => (
  <section className="features-section">
    <div className="container">
      <h2 className="features-heading">Support from the first quote to the fifth year</h2>
      <div className="features-grid">
        <div className="feature-box">
          <div className="icon-circle"><FaSolarPanel /></div>
          <h4>Wide range</h4>
          <p>Distributor of UTL inverters, panels and ACDB boxes.</p>
        </div>
        <div className="feature-box">
          <div className="icon-circle"><FaRupeeSign /></div>
          <h4>Govt subsidy</h4>
          <p>We handle all paperwork. Up to ₹78,000 subsidy is assured.</p>
        </div>
        <div className="feature-box">
          <div className="icon-circle"><FaTools /></div>
          <h4>5-year maintenance</h4>
          <p>Includes quarterly deep cleaning, health checks and repairs.</p>
        </div>
      </div>
    </div>
  </section>
);

const Products = () => (
  <section id="products" className="products-section">
    <div className="container">
      <h2 className="section-title">Best-sellers from India's top solar brands</h2>
      <p className="section-desc">
        We are authorised distributors for UTL, Fujiyama, Tata Power and Luminous.
        Pick a product and we will send you a quote.
      </p>

      {productsData.map((category) => (
        <div key={category.category} className="category-block">
          <h3 className="category-title">
            {category.category}
            <span className="category-count">{category.items.length} products</span>
          </h3>
          <div className="products-grid">
            {category.items.map((item) => (
              <article key={item.id} className="product-card">
                <div className="product-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <span className="brand-badge">{item.brand}</span>
                </div>
                <div className="product-info">
                  <h4>{item.name}</h4>
                  <p className="product-desc">{item.desc}</p>
                  <div className={`price-tag ${item.price.startsWith('₹') ? '' : 'price-soft'}`}>{item.price}</div>
                  <button type="button" className="btn btn-outline btn-small" onClick={() => requestQuote(category.interest)}>
                    Get quote
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      <div className="pricelist">
        <div>
          <h4>Need cables, structures or industrial inverters?</h4>
          <p>Message us on WhatsApp and we will send the full price list.</p>
        </div>
        <a className="btn btn-sun" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp /> Ask for price list
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="about" className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <h3>Kaki Industries Pvt Ltd</h3>
        <p>Trader, wholesaler and distributor of solar equipment in Nagpur.</p>
        <div className="footer-actions">
          <a href={PHONE_TEL} className="btn btn-sun"><FaPhoneAlt /> Call now</a>
          <a href={WHATSAPP_URL} className="btn btn-light" target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>
        </div>
      </div>

      <div className="footer-contact">
        <h4>Contact us</h4>
        <div className="contact-item">
          <FaUserTie className="c-icon" />
          <div><strong>Mr. Aslam Siddiqui</strong> (Owner)</div>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="c-icon" />
          <a href={PHONE_TEL} className="phone-link">{PHONE_DISPLAY}</a>
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="c-icon" />
          <address>
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              54, Babulkheda, Welekar Nagar,<br />
              Shivam Hair Salon,<br />
              Nagpur-440027, Maharashtra, India
            </a>
          </address>
        </div>
      </div>
    </div>
    <div className="container footer-bottom">
      <p>&copy; 2026 Kaki Industries Private Limited. All rights reserved.</p>
    </div>
  </footer>
);

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <BrandStrip />
      <Features />
      <Products />
      <Footer />
    </div>
  );
}

export default App;
