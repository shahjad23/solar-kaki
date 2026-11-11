import { useMemo } from 'react';
import { SETTINGS_URL } from '../config';
import { useCsv, num } from './sheets';

// "Settings" tab: two columns, key and value. Keys the site understands:
//   Calculator: cost_per_kw, tariff, units_per_kw_day, tariff_rise_pct, panel_drop_pct,
//               loan_rate_pct, loan_years, down_payment_pct, default_bill
//   Dashboard:  systems_installed, capacity_kw, indiamart_url
const CALC_KEYS = {
  cost_per_kw: 'costPerKw',
  tariff: 'tariff',
  units_per_kw_day: 'genPerKwDay',
  tariff_rise_pct: 'tariffEsc',
  panel_drop_pct: 'degradation',
  loan_rate_pct: 'rate',
  loan_years: 'loanYears',
  down_payment_pct: 'downPct',
  default_bill: 'bill',
};

export function settingsFromRows(rows) {
  const out = { calc: {}, stats: {}, indiaMartUrl: '' };
  if (!rows) return out;
  rows.forEach((r) => {
    const key = (r[0] || '').trim().toLowerCase();
    const value = (r[1] || '').trim();
    if (!key || !value) return;
    if (CALC_KEYS[key]) {
      const n = num(value);
      if (n !== null && n >= 0) out.calc[CALC_KEYS[key]] = n;
    } else if (key === 'systems_installed' || key === 'capacity_kw') {
      const n = num(value);
      if (n !== null && n > 0) out.stats[key] = n;
    } else if (key === 'indiamart_url' && /^https:\/\//.test(value)) {
      out.indiaMartUrl = value;
    }
  });
  return out;
}

export default function useSettings() {
  const { status, rows } = useCsv(SETTINGS_URL);
  const values = useMemo(() => settingsFromRows(rows), [rows]);
  return { status, ...values };
}
