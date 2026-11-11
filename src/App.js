import React from 'react';
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
