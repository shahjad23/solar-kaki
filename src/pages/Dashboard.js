import React from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import BarChart from '../components/BarChart';
import usePageTitle from '../lib/usePageTitle';
import useSettings from '../lib/useSettings';
import { useCsv, num } from '../lib/sheets';
import { MONTHLY_URL } from '../config';
import { MONTHS, panelsSold, panelsPurchased, lastMonthIsPartial, installed, enquiriesByMonth, reviews, indiaMartUrl } from '../data/dashboard';

const toSeries = (values) => values.map((value, i) => ({
  label: MONTHS[i], value, partial: lastMonthIsPartial && i === values.length - 1,
}));

// "Monthly" tab columns: month, panels_sold_mw, panels_purchased_mw, enquiries, partial
function monthlyFromRows(rows) {
  if (!rows || rows.length < 2) return null;
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const at = (n) => head.indexOf(n);
  const im = at('month');
  if (im < 0) return null;
  const list = rows.slice(1)
    .map((r) => ({
      label: (r[im] || '').trim(),
      sold: at('panels_sold_mw') >= 0 ? num(r[at('panels_sold_mw')]) : null,
      bought: at('panels_purchased_mw') >= 0 ? num(r[at('panels_purchased_mw')]) : null,
      enq: at('enquiries') >= 0 ? num(r[at('enquiries')]) : null,
      partial: at('partial') >= 0 && /^(yes|y|true|1)$/i.test((r[at('partial')] || '').trim()),
    }))
    .filter((r) => r.label);
  const series = (k) => list.filter((r) => r[k] !== null && r[k] >= 0).map((r) => ({ label: r.label, value: r[k], partial: r.partial }));
  return { sold: series('sold'), bought: series('bought'), enq: series('enq') };
}
const mw = (n) => `${Number(n.toFixed(2)).toLocaleString('en-IN')} MW`;

const Stat = ({ value, label }) => (
  <div className="stat-tile">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default function Dashboard() {
  usePageTitle('Dashboard');
  const settings = useSettings();
  const monthly = useCsv(MONTHLY_URL);

  if (settings.status === 'loading' || monthly.status === 'loading') {
    return (
      <header className="page-header">
        <div className="container">
          <h1>Dashboard</h1>
          <div className="products-loading" role="status" style={{ textAlign: 'left', padding: '24px 0 0', color: '#C9D8F2' }}>Loading the latest numbers</div>
        </div>
      </header>
    );
  }

  // Sheet first; if the sheet is not set up or unreachable, use src/data/dashboard.js.
  const fromSheet = monthly.status === 'live' ? monthlyFromRows(monthly.rows) : null;
  const sold = fromSheet ? fromSheet.sold : toSeries(panelsSold);
  const bought = fromSheet ? fromSheet.bought : toSeries(panelsPurchased);
  const enquiries = fromSheet ? fromSheet.enq : enquiriesByMonth;
  const hasPartial = [...sold, ...bought, ...enquiries].some((d) => d.partial) || (!fromSheet && lastMonthIsPartial);
  const systems = settings.stats.systems_installed || installed?.systems;
  const capacityKw = settings.stats.capacity_kw || installed?.capacityKw;
  const indiaMart = settings.indiaMartUrl || indiaMartUrl;

  const hasSold = sold.length > 0;
  const hasBought = bought.length > 0;
  const stats = [];
  if (systems) stats.push(<Stat key="s" value={systems.toLocaleString('en-IN')} label="Systems installed" />);
  if (capacityKw) stats.push(<Stat key="c" value={`${capacityKw.toLocaleString('en-IN')} kW`} label="Capacity installed" />);
  if (hasSold) stats.push(<Stat key="m" value={mw(sold.reduce((x, d) => x + d.value, 0))} label="Panels sold so far this year" />);
  if (reviews.length) stats.push(<Stat key="r" value={reviews.length} label="Customer reviews" />);

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>Dashboard</h1>
          <p>Our work in numbers: panels supplied, systems installed and what customers say.</p>
        </div>
      </header>

      <section className="page-section">
        <div className="container">
          {stats.length > 0 && <div className="stat-row">{stats}</div>}


          {(hasSold || hasBought) && (
            <div className="chart-grid-2">
              {hasSold && (
                <BarChart title="Panels sold" subtitle="B2B supply, DCR panels, MW per month" unit="MW" data={sold} />
              )}
              {hasBought && (
                <BarChart title="Panels purchased" subtitle="DCR panels, MW per month" unit="MW" data={bought} />
              )}
            </div>
          )}
          {hasPartial && (hasSold || hasBought) && (
            <p className="chart-note">The lighter bar is the current month so far.</p>
          )}

          {enquiries.length > 0 && (
            <div className="chart-grid-2">
              <BarChart title="Enquiries" subtitle="Enquiries received per month" unit="enquiries" decimals={0}
                data={enquiries} />
            </div>
          )}

          {reviews.length > 0 && (
            <div className="reviews">
              <h2 className="section-title">Happy customers</h2>
              <div className="review-grid">
                {reviews.map((r) => (
                  <blockquote key={r.name + r.text} className="review-card">
                    <div className="review-stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((n) => <FaStar key={n} />)}</div>
                    <p>{r.text}</p>
                    <footer><strong>{r.name}</strong>{r.location ? `, ${r.location}` : ''}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {indiaMart && (
            <div className="pricelist">
              <div>
                <h4>Find us on IndiaMART</h4>
                <p>See our catalogue, ratings and buyer reviews.</p>
              </div>
              <a className="btn btn-sun" href={indiaMart} target="_blank" rel="noopener noreferrer">Open IndiaMART <FaExternalLinkAlt /></a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
