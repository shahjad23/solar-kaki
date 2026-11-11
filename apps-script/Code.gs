/**
 * Kaki Industries - enquiry capture (version 2)
 * Receives the website enquiry form, then:
 *   1. saves it in this Google Sheet (tab "Enquiries")
 *   2. emails the owner
 *   3. sends a WhatsApp message (CallMeBot)
 *
 * Secrets are NOT in this file. They live in
 * Project Settings > Script properties:
 *   OWNER_EMAIL      where enquiry emails go (optional, defaults to your own Gmail)
 *   WA_PHONE         WhatsApp number that receives alerts, e.g. 919876543210
 *   WA_APIKEY        key CallMeBot sent you
 */

var SHEET_NAME = 'Enquiries';
var MAX_PER_PHONE_PER_HOUR = 3;   // same mobile number
var MAX_TOTAL_PER_HOUR = 40;      // whole website
var TYPES = {
  install: 'Solar installation',
  dealer: 'Dealer enquiry',
  job: 'Job enquiry'
};
var GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > 3000) return reply_(false, 'too_large');
    var data = JSON.parse(raw);

    // Hidden "website" field: people leave it empty, simple bots fill it.
    if (data.website) return reply_(true); // pretend success, store nothing

    var type = TYPES[data.type] ? data.type : 'install';
    var lead = {
      type: type,
      name: clean_(data.name, 80),
      company: clean_(data.company, 100),
      gst: String(data.gst || '').toUpperCase().replace(/[^0-9A-Z]/g, ''),
      phone: String(data.phone || '').replace(/\D/g, ''),
      location: clean_(data.location, 100),
      product: clean_(data.product, 160)
    };

    if (lead.name.length < 2 || !/^[6-9]\d{9}$/.test(lead.phone) || lead.location.length < 2) {
      return reply_(false, 'invalid');
    }
    if (type === 'dealer' && (lead.company.length < 2 || !GST_REGEX.test(lead.gst))) {
      return reply_(false, 'invalid');
    }
    if (type !== 'dealer') { lead.company = ''; lead.gst = ''; }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (!allow_(lead.phone)) return reply_(false, 'rate_limited');
      saveLead_(lead);
    } finally {
      lock.releaseLock();
    }

    // Alerts: one failing must not block the other.
    try { sendEmail_(lead); } catch (err) { console.error('email failed: ' + err); }
    try { sendWhatsApp_(lead); } catch (err) { console.error('whatsapp failed: ' + err); }

    return reply_(true);
  } catch (err) {
    console.error(err);
    return reply_(false, 'error');
  }
}

// Opening the web address in a browser just says the service is alive.
function doGet() {
  return reply_(true);
}

// ---------- helpers ----------

function reply_(ok, error) {
  var body = ok ? { ok: true } : { ok: false, error: error };
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

// Remove control characters / newlines and cap the length.
function clean_(value, max) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// Stop spreadsheet formulas: a cell that starts with = + - @ gets a leading apostrophe.
function safeCell_(value) {
  var s = String(value || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Simple rate limit using one-hour time buckets.
function allow_(phone) {
  var cache = CacheService.getScriptCache();
  var hour = Math.floor(Date.now() / 3600000);
  var keys = ['all_' + hour, 'p_' + phone + '_' + hour];
  var limits = [MAX_TOTAL_PER_HOUR, MAX_PER_PHONE_PER_HOUR];
  var counts = keys.map(function (k) { return Number(cache.get(k) || 0); });
  for (var i = 0; i < keys.length; i++) {
    if (counts[i] >= limits[i]) return false;
  }
  for (var j = 0; j < keys.length; j++) cache.put(keys[j], String(counts[j] + 1), 3700);
  return true;
}

function saveLead_(lead) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Time', 'Type', 'Name', 'Company', 'GST number', 'Mobile', 'Location', 'Product or note']);
    sheet.setFrozenRows(1);
  }
  // Mobile saved as text so Sheets never turns it into a number.
  sheet.appendRow([
    new Date(), TYPES[lead.type], safeCell_(lead.name), safeCell_(lead.company), lead.gst,
    "'" + lead.phone, safeCell_(lead.location), safeCell_(lead.product)
  ]);
}

function prop_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function summary_(lead) {
  var lines = [TYPES[lead.type]];
  if (lead.company) lines.push('Company: ' + lead.company);
  lines.push('Name: ' + lead.name);
  if (lead.gst) lines.push('GST: ' + lead.gst);
  lines.push('Mobile: +91 ' + lead.phone);
  lines.push('Location: ' + lead.location);
  if (lead.product) lines.push('For: ' + lead.product);
  return lines.join('\n');
}

function sendEmail_(lead) {
  var to = prop_('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
  var who = lead.company || lead.name;
  MailApp.sendEmail(to, TYPES[lead.type] + ': ' + who, 'New enquiry from kakitech.org\n\n' + summary_(lead) + '\n');
}

function sendWhatsApp_(lead) {
  var waPhone = prop_('WA_PHONE');
  var apiKey = prop_('WA_APIKEY');
  if (!waPhone || !apiKey) return; // WhatsApp not set up yet, skip quietly
  var text = 'New enquiry - Kaki Industries\n' + summary_(lead);
  var url = 'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(waPhone) +
    '&text=' + encodeURIComponent(text) +
    '&apikey=' + encodeURIComponent(apiKey);
  UrlFetchApp.fetch(url, { muteHttpExceptions: true });
}

// Run this once from the editor to test email + WhatsApp without the website.
function testAlerts() {
  var lead = { type: 'dealer', name: 'Test Customer', company: 'Test Traders', gst: '27ABCDE1234F1Z5', phone: '9876543210', location: 'Nagpur', product: '' };
  sendEmail_(lead);
  sendWhatsApp_(lead);
}
