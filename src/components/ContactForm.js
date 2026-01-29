import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle } from 'lucide-react';

const ContactForm = () => {
  const form = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');

    // REPLACE KEYS WITH YOUR OWN
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
      .then(() => {
          setStatus('success');
          e.target.reset();
          setTimeout(() => setStatus('idle'), 5000);
      }, () => {
          setStatus('error');
      });
  };

  return (
    <div className="lead-form-card">
      <div className="text-center" style={{marginBottom: '24px'}}>
        <h3 style={{fontSize: '1.5rem', color: '#0f766e'}}>Get Your Free Solar Quote</h3>
        <p style={{color: '#64748b'}}>Expert consultation within 24 hours.</p>
      </div>

      {status === 'success' ? (
        <div className="success-message text-center" style={{padding: '40px 0'}}>
            <CheckCircle size={48} color="#0f766e" style={{margin:'0 auto 10px'}}/>
            <h4 style={{color: '#0f766e'}}>Request Sent!</h4>
            <p>Mr. Aslam Siddiqui will contact you shortly.</p>
        </div>
      ) : (
        <form ref={form} onSubmit={sendEmail}>
            <input className="modern-input" type="text" name="user_name" placeholder="Full Name" required />
            <input className="modern-input" type="tel" name="user_mobile" placeholder="Mobile Number (10 digits)" pattern="[0-9]{10}" required />
            <input className="modern-input" type="text" name="user_address" placeholder="Area / Pincode" required />
            
            <button type="submit" className="submit-btn">
                {status === 'sending' ? 'Sending...' : 'Calculate My Savings'} <Send size={18} style={{marginLeft: 8, verticalAlign: 'middle'}}/>
            </button>
            {status === 'error' && <p style={{color:'red', textAlign:'center', marginTop:10}}>Something went wrong. Call +91-7620872628</p>}
        </form>
      )}
    </div>
  );
};

export default ContactForm;