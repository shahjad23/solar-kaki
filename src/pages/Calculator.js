import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaHome, FaIndustry } from 'react-icons/fa';
import usePageTitle from '../lib/usePageTitle';
import { calculate, DEFAULTS, ROOF_SQFT_PER_KW } from '../lib/solar';
import useSettings from '../lib/useSettings';

const inr = (n) => '₹ ' + Math.round(n).toLocaleString('en-IN');
const money = (n) => (n >= 100000 ? `₹ ${(n / 100000).toFixed(2)} lakh` : inr(n));
const num = (n, d = 0) => Number(n.toFixed(d)).toLocaleString('en-IN');

const NumberField = ({ id, label, value, onChange, suffix, prefix, hint, step = 'any', min = 0 }) => (
  <div className="calc-field">
    <label htmlFor={id}>{label}</label>
    <div className="calc-input">
      {prefix && <span>{prefix}</span>}
      <input id={id} type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(e) => onChange(e.target.value)} />
      {suffix && <span>{suffix}</span>}
    </div>
    {hint && <small>{hint}</small>}
  </div>
);

// Rates (cost per kW, tariff and so on) come from the price sheet when it is set up.
export default function Calculator() {
  usePageTitle('Solar calculator');
  const settings = useSettings();
  if (settings.status === 'loading') {
    return (
      <header className="page-header">
        <div className="container">
          <h1>Solar calculator</h1>
          <div className="products-loading" role="status" style={{ textAlign: 'left', padding: '24px 0 0', color: '#C9D8F2' }}>Loading the latest rates</div>
        </div>
      </header>
    );
  }
  return <CalculatorForm initial={{ ...DEFAULTS, ...settings.calc }} />;
}

function CalculatorForm({ initial }) {
  const [i, setI] = useState(initial);
  const [advanced, setAdvanced] = useState(false);
  const set = (k) => (v) => setI((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => calculate(i), [i]);
  const home = i.customer === 'home';

  const quoteText = r && !r.tooSmallRoof ? `Calculator estimate: ${r.kw} kW system, about ${money(r.net)} after subsidy` : '';

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>Solar calculator</h1>
          <p>Find the right system size, what it costs after subsidy, how much you save and when it pays for itself.</p>
        </div>
      </header>

      <section className="page-section">
        <div className="container calc-grid">
          <form className="calc-card" onSubmit={(e) => e.preventDefault()} aria-label="Calculator inputs">
            <h2>Your electricity use</h2>

            <fieldset className="calc-choice">
              <legend>I am installing at</legend>
              <label className={home ? 'on' : ''}><input type="radio" name="customer" checked={home} onChange={() => set('customer')('home')} /><FaHome /> My home</label>
              <label className={!home ? 'on' : ''}><input type="radio" name="customer" checked={!home} onChange={() => set('customer')('business')} /><FaIndustry /> A shop, office or factory</label>
            </fieldset>

            <div className="calc-field">
              <label htmlFor="bill">Monthly electricity bill</label>
              <div className="calc-input"><span>₹</span>
                <input id="bill" type="number" inputMode="numeric" min="0" step="100" value={i.bill} onChange={(e) => set('bill')(e.target.value)} />
              </div>
              <input className="calc-range" type="range" min="500" max="50000" step="100" value={Math.min(50000, Math.max(500, Number(i.bill) || 500))}
                onChange={(e) => set('bill')(e.target.value)} aria-label="Monthly bill slider" />
              <div className="range-ends"><span>₹ 500</span><span>₹ 50,000</span></div>
            </div>

            <NumberField id="tariff" label="What you pay per unit" prefix="₹" suffix="per unit" value={i.tariff} onChange={set('tariff')} step="0.1"
              hint="Total bill divided by units used. Find both on your bill." />
            <NumberField id="roof" label="Shadow-free roof area (optional)" suffix="sq ft" value={i.roof} onChange={set('roof')} step="10"
              hint={`Each kW needs about ${ROOF_SQFT_PER_KW} sq ft. We will not suggest more than fits.`} />

            <button type="button" className="calc-toggle" aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}>
              {advanced ? 'Hide' : 'Show'} advanced assumptions
            </button>

            {advanced && (
              <div className="calc-advanced">
                <div className="calc-two">
                  <NumberField id="cost" label="System cost per kW" prefix="₹" value={i.costPerKw} onChange={set('costPerKw')} step="1000" />
                  <NumberField id="gen" label="Units from 1 kW per day" value={i.genPerKwDay} onChange={set('genPerKwDay')} step="0.1" />
                  <NumberField id="esc" label="Yearly rise in tariff" suffix="%" value={i.tariffEsc} onChange={set('tariffEsc')} step="0.5" />
                  <NumberField id="deg" label="Yearly drop in panel output" suffix="%" value={i.degradation} onChange={set('degradation')} step="0.1" />
                </div>
                {home && (
                  <label className="calc-check">
                    <input type="checkbox" checked={i.subsidyOn} onChange={(e) => set('subsidyOn')(e.target.checked)} />
                    Include the PM Surya Ghar subsidy
                  </label>
                )}
              </div>
            )}

            <label className="calc-check loan-check">
              <input type="checkbox" checked={i.loan} onChange={(e) => set('loan')(e.target.checked)} />
              Show monthly instalment if I take a loan
            </label>
            {i.loan && (
              <div className="calc-two">
                <NumberField id="down" label="Down payment" suffix="%" value={i.downPct} onChange={set('downPct')} step="5" />
                <NumberField id="rate" label="Interest per year" suffix="%" value={i.rate} onChange={set('rate')} step="0.25" hint="Example rate. Check with your bank." />
                <NumberField id="years" label="Loan period" suffix="years" value={i.loanYears} onChange={set('loanYears')} step="1" min={1} />
              </div>
            )}
          </form>

          <div className="calc-results" aria-live="polite">
            {!r && <div className="calc-card"><h2>Enter your bill</h2><p>Add your monthly bill and the rate you pay per unit to see your estimate.</p></div>}
            {r?.tooSmallRoof && <div className="calc-card"><h2>Roof area is too small</h2><p>A system needs at least about {ROOF_SQFT_PER_KW / 2} sq ft of shadow-free roof. Clear the roof area box or call us to discuss options.</p></div>}

            {r && !r.tooSmallRoof && (
              <>
                <div className="calc-card calc-hero">
                  <p>Recommended system</p>
                  <div className="calc-big">{r.kw} kW</div>
                  <p>
                    needs about {num(r.roofSqft)} sq ft ({num(r.roofSqm)} sq m) of shadow-free roof and makes about {num(r.genYear1)} units a year.
                    {r.roofLimited && ' Size is limited by the roof area you entered.'}
                  </p>
                </div>

                <dl className="calc-metrics">
                  <div><dt>System cost</dt><dd>{money(r.cost)}</dd></div>
                  <div><dt>Subsidy{r.subsidyApplies ? '' : ' (not applicable)'}</dt><dd>{r.subsidyApplies ? `− ${money(r.subsidy)}` : '₹ 0'}</dd></div>
                  <div className="strong"><dt>You pay</dt><dd>{money(r.net)}</dd></div>
                  <div><dt>Saved in year 1</dt><dd>{money(r.savingsYear1)}</dd></div>
                  <div><dt>Pays for itself in</dt><dd>{r.payback ? `${num(r.payback, 1)} years` : 'over 25 years'}</dd></div>
                  <div><dt>Bill after solar</dt><dd>{r.billAfter < 100 ? 'Fixed charges only' : `about ${money(r.billAfter)} a month`}</dd></div>
                  <div className="wide"><dt>Net gain over 25 years</dt><dd>{money(Math.max(0, r.lifetimeGain))}</dd></div>
                </dl>

                {i.loan && (
                  <div className="calc-card calc-loan">
                    <h2>With a loan</h2>
                    <p>Down payment {money(r.net * (Number(i.downPct) / 100))}, then</p>
                    <div className="calc-big small">{inr(r.monthlyEmi)} <span>a month for {i.loanYears} years</span></div>
                    <p>
                      {r.monthlyEmi < r.unitsMonth * Number(i.tariff) - r.billAfter
                        ? `That is less than the ${money(r.unitsMonth * Number(i.tariff) - r.billAfter)} a month you save on bills.`
                        : `Your bill savings are about ${money(r.unitsMonth * Number(i.tariff) - r.billAfter)} a month, so the instalment is higher until the loan ends.`}
                    </p>
                  </div>
                )}

                <p className="calc-leaf"><FaLeaf /> About {num(r.co2Tonnes, 1)} tonnes of CO₂ avoided a year, like {num(r.trees)} trees.</p>

                <div className="calc-cta">
                  <Link to="/#enquiry" state={{ product: quoteText }} className="btn btn-sun">Get an exact quote <FaArrowRight /></Link>
                  <p>
                    This is an estimate, not a quote. Real figures depend on your roof, shade, load and the rates on the day.
                    {home && ' Subsidy follows PM Surya Ghar rules for households: ₹30,000 per kW for the first 2 kW and ₹18,000 for the 3rd kW, up to ₹78,000.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
