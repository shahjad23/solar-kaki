// Contact details: change here and every page updates.
export const PHONE_DIGITS = '9595995626';
export const PHONE_DISPLAY = `+91 ${PHONE_DIGITS}`;
export const PHONE_TEL = `tel:+91${PHONE_DIGITS}`;
export const WHATSAPP_URL = `https://wa.me/91${PHONE_DIGITS}?text=${encodeURIComponent('Hello Kaki Industries, please share your latest price list.')}`;
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Welekar Nagar, Babulkheda, Nagpur 440027');

// Web address of the Google Apps Script that saves enquiries and sends alerts.
// Set as REACT_APP_LEAD_URL (in .env locally, in Netlify's environment variables online).
export const LEAD_URL = process.env.REACT_APP_LEAD_URL;

// Web address of your published price sheet (CSV). Optional: without it the site shows the prices in src/data/catalog.js.
// Set as REACT_APP_PRICES_URL.
export const PRICES_URL = process.env.REACT_APP_PRICES_URL;

// Optional published sheet tabs (CSV links). Without them the site uses the values in the code.
// REACT_APP_SETTINGS_URL: calculator rates and dashboard numbers. REACT_APP_MONTHLY_URL: monthly panels sold/purchased.
export const SETTINGS_URL = process.env.REACT_APP_SETTINGS_URL;
export const MONTHLY_URL = process.env.REACT_APP_MONTHLY_URL;

// Set to false to hide the "ISO 9001 certified" badge everywhere.
export const SHOW_ISO_BADGE = true;

export const BRANDS = ['Waaree', 'Adani', 'Polycab', 'Fujiyama', 'Tata Power', 'Luminous', 'Havells'];
