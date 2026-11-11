import React, { useState } from 'react';

const W = 640, H = 300, M = { t: 26, r: 12, b: 36, l: 48 };

function niceStep(max) {
  const raw = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const f = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return f * pow;
}

const fmt = (n, decimals) => Number(n.toFixed(decimals)).toLocaleString('en-IN');

// data: [{ label, value, partial? }]. One series, so no legend; the title names it.
export default function BarChart({ title, subtitle, unit, data, decimals = 2, partialNote = 'month so far' }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.value), 0.0001);
  const step = niceStep(max);
  const top = Math.ceil(max / step - 1e-9) * step;
  const ticks = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(t);

  const plotW = W - M.l - M.r, plotH = H - M.t - M.b;
  const band = plotW / data.length;
  const barW = Math.min(band * 0.62, 38);
  const y = (v) => M.t + plotH - (v / top) * plotH;
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const last = data.length - 1;
  const labelled = new Set([peak, last]);
  if (Math.abs(peak - last) < 2) labelled.delete(peak === last ? -1 : peak);

  const barPath = (x, h, yy) => {
    const r = Math.min(4, barW / 2, h);
    return `M${x},${yy + h} V${yy + r} Q${x},${yy} ${x + r},${yy} H${x + barW - r} Q${x + barW},${yy} ${x + barW},${yy + r} V${yy + h} Z`;
  };

  const summary = `${title}. ${data.map((d) => `${d.label} ${fmt(d.value, decimals)}`).join(', ')}.`;

  return (
    <figure className="chart-card">
      <figcaption>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </figcaption>

      <div className="chart-wrap">
        <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className={t === 0 ? 'chart-axis' : 'chart-grid'} />
              <text x={M.l - 8} y={y(t) + 4} textAnchor="end" className="chart-tick">{Number(t.toFixed(2))}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = M.l + band * i + (band - barW) / 2;
            const h = Math.max(0, plotH - (y(d.value) - M.t));
            const yy = y(d.value);
            return (
              <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                 onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
                 aria-label={`${d.label}: ${fmt(d.value, decimals)} ${unit}${d.partial ? `, ${partialNote}` : ''}`}>
                <rect x={M.l + band * i} y={M.t} width={band} height={plotH + 1} fill="transparent" />
                <path d={barPath(x, h, yy)} className={`chart-bar ${d.partial ? 'is-partial' : ''} ${hover === i ? 'is-hover' : ''}`} />
                {labelled.has(i) && (
                  <text x={x + barW / 2} y={yy - 7} textAnchor="middle" className="chart-value">{fmt(d.value, decimals)}</text>
                )}
                <text x={x + barW / 2} y={H - 14} textAnchor="middle" className="chart-tick">{d.label}</text>
              </g>
            );
          })}
        </svg>

        {hover !== null && (
          <div className="chart-tip" style={{
            left: `${((M.l + band * hover + band / 2) / W) * 100}%`,
            top: `${(y(data[hover].value) / H) * 100}%`,
          }}>
            <strong>{data[hover].label}</strong>
            <span>{fmt(data[hover].value, decimals)} {unit}</span>
            {data[hover].partial && <em>{partialNote}</em>}
          </div>
        )}
      </div>

      <details className="chart-table">
        <summary>View as table</summary>
        <table>
          <thead><tr><th scope="col">Month</th><th scope="col">{unit}</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}><th scope="row">{d.label}</th><td>{fmt(d.value, decimals)}{d.partial ? ` (${partialNote})` : ''}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
