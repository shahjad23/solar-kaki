import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { IsoBadge } from '../components/Layout';
import { BRANDS, PHONE_DISPLAY, PHONE_TEL } from '../config';
import usePageTitle from '../lib/usePageTitle';

export default function About() {
  usePageTitle('About us');
  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>About Kaki Industries</h1>
          <p>A Nagpur company that supplies and installs solar equipment, from single inverters to full commercial systems.</p>
        </div>
      </header>

      <section className="page-section">
        <div className="container about-grid">
          <div className="about-text">
            <h2 className="section-title">Who we are</h2>
            <p>
              Kaki Industries Private Limited is a trader, wholesaler and distributor of solar inverters, panels and batteries
              based in Nagpur. We are GST registered and sell original products from the brands below, to homes, shops,
              factories and other dealers.
            </p>
            <p>
              Enquiries go straight to the owner, Mr. Aslam Siddiqui, who calls customers back.
            </p>
            <h3 className="about-sub">What we do</h3>
            <ul className="about-list">
              <li>Solar material supply to businesses and dealers (B2B)</li>
              <li>Solar installation for homes, shops and factories</li>
              <li>Engineering and technical consultancy</li>
              <li>Surveying, drafting and project support</li>
              <li>Industrial and piping projects</li>
              <li>Training and skill development</li>
            </ul>
            <IsoBadge className="about-iso" />
            <div className="about-actions">
              <Link to="/#enquiry" className="btn btn-sun">Send an enquiry <FaArrowRight /></Link>
              <Link to="/epc" className="btn btn-outline">How we install</Link>
            </div>
          </div>

          <aside className="about-side">
            <div className="about-brands">
              <h3>Company details</h3>
              <dl className="about-facts">
                <div><dt>Registered name</dt><dd>Kaki Industries Private Limited</dd></div>
                <div><dt>Address</dt><dd>54, Babulkheda, Shivam Hair Salon, Welekar Nagar, Nagpur, Maharashtra 440027</dd></div>
                <div><dt>Phone</dt><dd><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></dd></div>
              </dl>
            </div>
            <div className="about-brands">
              <h3>Brands we work with</h3>
              <ul>{BRANDS.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
