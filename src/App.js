import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Epc from './pages/Epc';
import Calculator from './pages/Calculator';
import About from './pages/About';

const NotFound = () => (
  <header className="page-header">
    <div className="container">
      <h1>Page not found</h1>
      <p>That page does not exist. <Link to="/" style={{ color: '#FFB000' }}>Go to the home page</Link>.</p>
    </div>
  </header>
);

export default function App() {
  useEffect(() => {
    // Function to find and remove the Netlify badge iframe or container
    const removeNetlifyBadge = () => {
      const badges = document.querySelectorAll('iframe[src*="netlify"], #netlify-badge, .netlify-badge');
      badges.forEach((el) => el.remove());

      const allDivs = document.querySelectorAll('div');
      allDivs.forEach((div) => {
        if (div.innerText && div.innerText.includes('Powered by Netlify')) {
          div.remove();
        }
      });
    };

    // Run immediately and also set a short interval to catch it if it loads late
    removeNetlifyBadge();
    const interval = setInterval(removeNetlifyBadge, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/epc" element={<Epc />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}