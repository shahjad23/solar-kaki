import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaSolarPanel, FaRupeeSign, FaTools } from 'react-icons/fa';
import usePageTitle from '../lib/usePageTitle';

const STEPS = [
  { title: 'Site visit and load study', text: 'We check your roof, shade and electricity bills to decide the right system size.' },
  { title: 'Design and quote', text: 'You get a clear layout and a price before any work starts.' },
  { title: 'Equipment supply', text: 'Panels, inverters and cables come from our authorised brands.' },
  { title: 'Installation', text: 'Our team mounts the structure, wires the system and fits protection boxes (ACDB and DCDB).' },
  { title: 'Subsidy and net metering', text: 'We handle the paperwork for the government subsidy and the net meter connection.' },
  { title: 'Commissioning and upkeep', text: 'We switch the system on, walk you through how it works and look after it with scheduled maintenance.' },
];

export default function Epc() {
  usePageTitle('EPC solar installation');
  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>Complete solar installation, handled by one team</h1>
          <p>EPC means engineering, procurement and construction. We design the system, supply the equipment and build it, so you deal with one company from the first visit to the last service.</p>
        </div>
      </header>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">How an installation works</h2>
          <ol className="steps">
            {STEPS.map((s, n) => (
              <li key={s.title}>
                <span className="step-no">{n + 1}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section alt">
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

      <section className="page-section">
        <div className="container">
          <div className="pricelist">
            <div>
              <h4>Planning a solar system?</h4>
              <p>Work out the size and savings first, then ask us for an exact quote.</p>
            </div>
            <div className="cta-pair">
              <Link to="/calculator" className="btn btn-light">Try the calculator</Link>
              <Link to="/#enquiry" className="btn btn-sun">Get a quote <FaArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
