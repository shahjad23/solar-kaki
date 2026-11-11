import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaBolt, FaPhoneAlt, FaWhatsapp, FaUserTie, FaMapMarkerAlt, FaBars, FaTimes, FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL, MAP_URL, SHOW_ISO_BADGE } from '../config';
import { indiaMartUrl as fileIndiaMartUrl } from '../data/dashboard';
import useSettings from '../lib/useSettings';

const PUBLIC = process.env.PUBLIC_URL || '';

// Drop your logo at public/logo.png and it replaces the bolt icon automatically.
export const Logo = () => {
  const [hasImage, setHasImage] = useState(true);
  return (
    <Link to="/" className="logo" aria-label="Kaki Solar home">
      {hasImage ? (
        <img className="logo-wide" src={`${PUBLIC}/logo.png`} alt="Kaki Solar" onError={() => setHasImage(false)} />
      ) : (
        <><span className="logo-mark"><FaBolt /></span> Kaki Industries</>
      )}
    </Link>
  );
};

// Drop your certificate badge at public/iso-9001.png and it replaces the text badge.
export const IsoBadge = ({ className = '' }) => {
  const [hasImage, setHasImage] = useState(true);
  if (!SHOW_ISO_BADGE) return null;
  return hasImage ? (
    <img className={`iso-img ${className}`} src={`${PUBLIC}/iso-9001.png`} alt="ISO 9001 certified" onError={() => setHasImage(false)} />
  ) : (
    <span className={`iso-badge ${className}`}><FaCertificate /> ISO 9001 certified</span>
  );
};

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/epc', label: 'EPC' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/about', label: 'About us' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="navbar" aria-label="Main">
      <div className="container nav-container">
        <Logo />
        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href={PHONE_TEL} className="btn btn-outline btn-small nav-call"><FaPhoneAlt /> <span>Call now</span></a>
          <button type="button" className="nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const settings = useSettings();
  const indiaMartUrl = settings.indiaMartUrl || fileIndiaMartUrl;
  return (
  <footer id="contact" className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <h3>Kaki Industries Pvt Ltd</h3>
        <p>Trader, wholesaler and distributor of solar equipment in Nagpur.</p>
        <div className="footer-actions">
          <a href={PHONE_TEL} className="btn btn-sun"><FaPhoneAlt /> Call now</a>
          <a href={WHATSAPP_URL} className="btn btn-light" target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>
          {indiaMartUrl && <a href={indiaMartUrl} className="btn btn-light" target="_blank" rel="noopener noreferrer">IndiaMART <FaExternalLinkAlt /></a>}
        </div>
      </div>

      <div className="footer-links">
        <h4>Pages</h4>
        <ul>
          {LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
        </ul>
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
};

// Scroll to the top on a new page, or to #section when the link has one.
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

export default function Layout() {
  return (
    <div className="App">
      <ScrollManager />
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
