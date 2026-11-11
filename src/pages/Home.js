import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheck, FaArrowRight, FaWhatsapp, FaSolarPanel, FaHandshake, FaUserTie } from 'react-icons/fa';
import EnquiryForm from '../components/EnquiryForm';
import { IsoBadge } from '../components/Layout';
import { BRANDS, WHATSAPP_URL, PHONE_DISPLAY, PHONE_TEL } from '../config';
import useCatalog from '../lib/useCatalog';
import usePageTitle from '../lib/usePageTitle';

const goToEnquiry = () => {
  document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => document.querySelector('#enquiry-form input:not([name="website"])')?.focus({ preventScroll: true }), 700);
};

const Hero = ({ onChoose }) => (
  <header className="hero">
    <div className="container hero-container">
      <div className="hero-text">
        <div className="hero-pills">
          <div className="badge-glow"><span className="dot" /> Authorised distributor</div>
          <IsoBadge className="iso-on-dark" />
        </div>
        <h1>All your solar needs, fulfilled here</h1>
        <p className="hero-subtext">
          Kaki Industries Private Limited supplies genuine solar inverters, panels and batteries, and installs
          complete systems for homes, shops and factories in Nagpur.
          <strong> Original products, clear prices and service you can call.</strong>
        </p>
        <ul className="usp-row">
          <li className="usp-item"><FaCheck className="usp-icon" /> GST registered</li>
          <li className="usp-item"><FaCheck className="usp-icon" /> Original products</li>
          <li className="usp-item"><FaCheck className="usp-icon" /> Nagpur based</li>
        </ul>
      </div>

      <div className="hero-choices">
        <h2>What brings you here?</h2>
        <button type="button" onClick={() => onChoose('install')}>
          <span className="choice-icon"><FaSolarPanel /></span>
          <span><strong>Install solar at my place</strong><small>Home, shop or factory</small></span>
          <FaArrowRight />
        </button>
        <button type="button" onClick={() => onChoose('dealer')}>
          <span className="choice-icon"><FaHandshake /></span>
          <span><strong>Become a dealer</strong><small>Buy at distributor rates</small></span>
          <FaArrowRight />
        </button>
        <button type="button" onClick={() => onChoose('job')}>
          <span className="choice-icon"><FaUserTie /></span>
          <span><strong>Work with us</strong><small>Ask about openings</small></span>
          <FaArrowRight />
        </button>
        <Link to="/calculator" className="choices-link">Not sure about size or cost? Try the solar calculator <FaArrowRight /></Link>
      </div>
    </div>
  </header>
);

const BrandStrip = () => (
  <section className="brand-strip" aria-label="Associated brands">
    <div className="container brand-strip-inner">
      <p>Associated brands</p>
      <ul className="brand-list">
        {BRANDS.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  </section>
);

const Enquiry = ({ preset, onClearProduct }) => (
  <section id="enquiry" className="enquiry-section">
    <div className="container enquiry-grid">
      <div className="enquiry-intro">
        <h2 className="section-title">Tell us what you need</h2>
        <p className="section-desc">
          Choose an option, share a few details and the owner will call you back.
          Prefer to talk now? Call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> or message us on WhatsApp.
        </p>
        <a className="btn btn-outline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> Chat on WhatsApp</a>
      </div>
      <EnquiryForm preset={preset} onClearProduct={onClearProduct} />
    </div>
  </section>
);

const Products = ({ onQuote }) => {
  const { status, data } = useCatalog();
  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title">Best-sellers from India's top solar brands</h2>
        <p className="section-desc">
          We are authorised distributors for UTL, Fujiyama, Tata Power and Luminous.
          Pick a product and we will send you a quote.
        </p>

        {status === 'loading' && <div className="products-loading" role="status">Loading the latest prices</div>}

        {data.map((category) => (
          <div key={category.category} className="category-block">
            <h3 className="category-title">
              {category.category}
              <span className="category-count">{category.items.length} {category.items.length === 1 ? 'product' : 'products'}</span>
            </h3>
            <div className="products-grid">
              {category.items.map((item) => (
                <article key={item.id} className="product-card">
                  <div className="product-image">
                    {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <FaSolarPanel className="product-image-empty" aria-hidden="true" />}
                    {item.brand && <span className="brand-badge">{item.brand}</span>}
                  </div>
                  <div className="product-info">
                    <h4>{item.name}</h4>
                    <p className="product-desc">{item.desc}</p>
                    <div className={`price-tag ${item.price.startsWith('₹') ? '' : 'price-soft'}`}>{item.price}</div>
                    <button type="button" className="btn btn-outline btn-small" onClick={() => onQuote(item.name)}>Get quote</button>
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
          <a className="btn btn-sun" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> Ask for price list</a>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  usePageTitle('');
  const location = useLocation();
  const [preset, setPreset] = useState(null); // { type, product, nonce }

  // Arriving from the calculator with an estimate to quote.
  useEffect(() => {
    if (location.state?.product) setPreset({ type: 'install', product: location.state.product, nonce: Date.now() });
  }, [location.state]);

  const choose = (type) => { setPreset({ type, product: '', nonce: Date.now() }); goToEnquiry(); };
  const quote = (name) => { setPreset({ type: 'install', product: name, nonce: Date.now() }); goToEnquiry(); };

  return (
    <>
      <Hero onChoose={choose} />
      <BrandStrip />
      <Enquiry preset={preset} onClearProduct={() => setPreset((p) => ({ ...p, product: '', nonce: Date.now() }))} />
      <Products onQuote={quote} />
    </>
  );
}
