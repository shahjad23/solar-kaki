import React, { useEffect, useRef, useState } from 'react';
import { FaArrowRight, FaSpinner, FaLock, FaTimes } from 'react-icons/fa';
import { LEAD_URL, PHONE_DISPLAY } from '../config';

export const TYPES = {
  install: 'I want to install a solar system',
  dealer: 'I want to become a dealer',
  job: 'I want a job',
};

// Which fields each enquiry type asks for, in order.
const FIELDS = {
  install: ['name', 'phone', 'location'],
  job: ['name', 'phone', 'location'],
  dealer: ['company', 'name', 'gst', 'phone', 'location'],
};

// Keep digits only, drop a pasted +91 / 91 prefix, cap at 10 digits.
const phoneText = (v) => {
  let d = v.replace(/\D/g, '');
  if (d.length > 10 && d.startsWith('91')) d = d.slice(2);
  return d.slice(0, 10);
};
const gstText = (v) => v.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const fieldDef = (key, type) => ({
  company: { label: 'Company name', autoComplete: 'organization' },
  name: { label: type === 'dealer' ? 'Your name' : 'Full name', autoComplete: 'name' },
  gst: { label: 'GST number', transform: gstText, autoComplete: 'off' },
  phone: { label: type === 'dealer' ? 'Contact number' : 'Mobile number', prefix: '+91', inputType: 'tel', transform: phoneText, autoComplete: 'tel-national', inputMode: 'numeric' },
  location: { label: 'Location (area and city)', autoComplete: 'address-level2' },
}[key]);

function validate(type, v) {
  const e = {};
  if (!v.name || v.name.trim().length < 2) e.name = 'Enter a name (at least 2 letters)';
  if (!/^[6-9]\d{9}$/.test(v.phone || '')) e.phone = 'Enter a valid 10-digit mobile number';
  if (!v.location || v.location.trim().length < 2) e.location = 'Enter your area and city';
  if (type === 'dealer') {
    if (!v.company || v.company.trim().length < 2) e.company = 'Enter your company name';
    if (!GST_REGEX.test(v.gst || '')) e.gst = 'Enter the 15-character GST number, like 27ABCDE1234F1Z5';
  }
  return e;
}

export default function EnquiryForm({ preset, onClearProduct }) {
  const [type, setType] = useState('install');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const form = useRef();

  // A product's "Get quote" button or a hero shortcut can choose the enquiry type.
  useEffect(() => {
    if (preset?.type && TYPES[preset.type]) {
      setType(preset.type);
      setErrors({});
      setStatus(null);
    }
  }, [preset]);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const data = new FormData(form.current);
    const values = Object.fromEntries(data.entries());
    const found = validate(type, values);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (!LEAD_URL) {
      setStatus({ type: 'fail', text: `The form is not set up yet. Please call ${PHONE_DISPLAY}.` });
      return;
    }

    setIsSending(true);
    const formEl = e.target;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      // Plain-text body, so the browser needs no special permission (CORS preflight).
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        body: JSON.stringify({
          type,
          name: values.name,
          company: values.company || '',
          gst: values.gst || '',
          phone: values.phone,
          location: values.location,
          product: preset?.product || '',
          website: values.website, // hidden trap field for bots, people leave it empty
        }),
        signal: controller.signal,
      });
      const result = await res.json();
      if (result.ok) {
        setStatus({ type: 'ok', text: 'Request sent. Mr. Aslam Siddiqui will call you shortly.' });
        formEl.reset();
        setErrors({});
      } else if (result.error === 'rate_limited') {
        setStatus({ type: 'fail', text: `Too many requests from this number. Please call ${PHONE_DISPLAY}.` });
      } else {
        throw new Error(result.error || 'failed');
      }
    } catch (err) {
      console.error('Enquiry error:', err);
      setStatus({ type: 'fail', text: `Could not send your request. Please call ${PHONE_DISPLAY}.` });
    } finally {
      clearTimeout(timer);
      setIsSending(false);
    }
  };

  return (
    <div id="enquiry-form" className="enquiry-card">
      <form ref={form} onSubmit={submit} noValidate>
        {/* Bot trap: hidden from people, bots fill it in */}
        <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
          <label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div className="select-group">
          <label htmlFor="f-type">What do you need?</label>
          <select id="f-type" value={type} onChange={(e) => { setType(e.target.value); setErrors({}); setStatus(null); }}>
            {Object.entries(TYPES).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>

        {preset?.product && type === 'install' && (
          <div className="product-chip">
            <span>Quote for: <strong>{preset.product}</strong></span>
            <button type="button" aria-label="Remove product" onClick={onClearProduct}><FaTimes /></button>
          </div>
        )}

        {FIELDS[type].map((key) => {
          const d = fieldDef(key, type);
          const id = `f-${key}`;
          return (
            <div key={`${type}-${key}`} className={`input-group ${errors[key] ? 'input-error' : ''}`}>
              {d.prefix && <div className="prefix">{d.prefix}</div>}
              <input
                id={id} name={key} type={d.inputType || 'text'} placeholder=" "
                className={d.prefix ? 'has-prefix' : undefined}
                maxLength={d.maxLength} autoComplete={d.autoComplete} inputMode={d.inputMode}
                onInput={d.transform ? (ev) => { ev.target.value = d.transform(ev.target.value); } : undefined}
                aria-invalid={errors[key] ? 'true' : undefined}
              />
              <label htmlFor={id} className={d.prefix ? 'label-with-prefix' : undefined}>{d.label}</label>
              {errors[key] && <span className="error-msg">{errors[key]}</span>}
            </div>
          );
        })}

        <button type="submit" className="btn btn-sun btn-block" disabled={isSending}>
          {isSending ? (<><FaSpinner className="spinner" /> Sending</>) : (<>{type === 'dealer' ? 'Send dealer enquiry' : type === 'job' ? 'Send my details' : 'Request callback'} <FaArrowRight /></>)}
        </button>
        <small className="secure-text"><FaLock /> Goes straight to Kaki Industries</small>
        {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
      </form>
    </div>
  );
}
