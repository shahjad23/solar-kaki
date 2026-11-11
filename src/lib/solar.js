// Rooftop solar estimate. Every number here is an assumption the visitor can change
// (see DEFAULTS), except the subsidy rules, which follow PM Surya Ghar for households.

export const ROOF_SQFT_PER_KW = 100;      // shadow-free roof needed per kW
export const SQFT_TO_SQM = 0.0929;
export const CO2_KG_PER_KWH = 0.82;       // approximate Indian grid emission factor
export const CO2_KG_PER_TREE_YEAR = 21;   // CO2 one tree absorbs in a year, approximate
export const YEARS = 25;

export const DEFAULTS = {
  customer: 'home',      // 'home' | 'business'
  bill: 3000,            // monthly electricity bill, Rs
  tariff: 8,             // Rs per unit
  roof: '',              // available roof area, sq ft (optional)
  costPerKw: 60000,      // installed system cost, Rs per kW
  genPerKwDay: 4,        // units generated per kW per day
  tariffEsc: 3,          // yearly rise in tariff, %
  degradation: 0.5,      // yearly drop in panel output, %
  subsidyOn: true,
  loan: false,
  downPct: 20,
  rate: 9,               // loan interest, % per year
  loanYears: 5,
};

// PM Surya Ghar central subsidy: Rs 30,000/kW for the first 2 kW, Rs 18,000 for the 3rd kW, max Rs 78,000.
export function subsidyFor(kw) {
  const first = Math.min(kw, 2) * 30000;
  const third = Math.max(0, Math.min(kw, 3) - 2) * 18000;
  return Math.min(78000, first + third);
}

export function emi(principal, annualRatePct, years) {
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 1200;
  if (r === 0) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

export function calculate(raw) {
  const i = { ...DEFAULTS, ...raw };
  const bill = Number(i.bill), tariff = Number(i.tariff);
  if (!(bill > 0) || !(tariff > 0)) return null;

  const unitsYear = (bill / tariff) * 12;
  const genPerKwYear = Number(i.genPerKwDay) * 365;
  if (!(genPerKwYear > 0)) return null;

  let kw = Math.max(1, Math.ceil((unitsYear / genPerKwYear) * 2) / 2); // round up to the next 0.5 kW
  const roof = Number(i.roof);
  let roofLimited = false;
  if (roof > 0) {
    const cap = Math.floor((roof / ROOF_SQFT_PER_KW) * 2) / 2;
    if (cap < kw) { kw = cap; roofLimited = true; }
  }
  if (kw <= 0) return { tooSmallRoof: true };

  const genYear1 = kw * genPerKwYear;
  const cost = kw * Number(i.costPerKw);
  const subsidy = i.subsidyOn && i.customer === 'home' ? subsidyFor(kw) : 0;
  const net = cost - subsidy;

  // Year-by-year savings: units used from solar x tariff, with tariff rising and panels ageing.
  const esc = Number(i.tariffEsc) / 100, deg = Number(i.degradation) / 100;
  let cum = 0, payback = null;
  const series = [];
  for (let y = 1; y <= YEARS; y++) {
    const gen = genYear1 * Math.pow(1 - deg, y - 1);
    const saved = Math.min(gen, unitsYear) * tariff * Math.pow(1 + esc, y - 1);
    const before = cum;
    cum += saved;
    series.push({ year: y, saved, cum });
    if (payback === null && cum >= net) payback = y - 1 + (net - before) / saved;
  }

  const solarUnits = Math.min(genYear1, unitsYear);
  const loanAmount = i.loan ? net * (1 - Number(i.downPct) / 100) : 0;
  const monthlyEmi = i.loan ? emi(loanAmount, Number(i.rate), Number(i.loanYears)) : 0;
  const co2Tonnes = (genYear1 * CO2_KG_PER_KWH) / 1000;

  return {
    kw, roofLimited,
    roofSqft: kw * ROOF_SQFT_PER_KW,
    roofSqm: kw * ROOF_SQFT_PER_KW * SQFT_TO_SQM,
    unitsMonth: unitsYear / 12,
    genYear1, cost, subsidy, net,
    billAfter: Math.max(0, ((unitsYear - solarUnits) / 12) * tariff),
    savingsYear1: series[0].saved,
    payback,
    lifetimeGain: cum - net,
    co2Tonnes,
    trees: Math.round((co2Tonnes * 1000) / CO2_KG_PER_TREE_YEAR),
    loanAmount, monthlyEmi,
    subsidyApplies: i.subsidyOn && i.customer === 'home',
  };
}
