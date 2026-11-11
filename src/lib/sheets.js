import { useEffect, useState } from 'react';

// Minimal CSV reader: handles quotes, commas inside quotes, line breaks and a leading BOM.
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') { if (src[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = ''; rows.push(row); row = [];
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// One download per address per visit, shared by every page that needs it.
const cache = new Map();
export function loadCsv(url) {
  if (!cache.has(url)) {
    const job = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return parseCsv(await res.text());
      } finally {
        clearTimeout(timer);
      }
    })();
    job.catch(() => cache.delete(url)); // allow a retry on the next visit
    cache.set(url, job);
  }
  return cache.get(url);
}

// status: 'off' (no address set) | 'loading' | 'live' | 'error'
export function useCsv(url) {
  const [state, setState] = useState(url ? { status: 'loading', rows: null } : { status: 'off', rows: null });
  useEffect(() => {
    if (!url) return undefined;
    let dead = false;
    loadCsv(url)
      .then((rows) => { if (!dead) setState({ status: 'live', rows }); })
      .catch((err) => {
        console.error('Sheet unavailable, using built-in values:', err);
        if (!dead) setState({ status: 'error', rows: null });
      });
    return () => { dead = true; };
  }, [url]);
  return state;
}

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[,₹\s%]/g, ''));
  return Number.isFinite(n) ? n : null;
};
export { num };
