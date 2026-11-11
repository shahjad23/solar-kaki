import { useMemo } from 'react';
import { PRICES_URL } from '../config';
import { useCsv } from './sheets';
import { productsData, imageMap } from '../data/catalog';

const HIDDEN = ['no', 'n', 'false', '0', 'hide', 'hidden'];

// Rows from the sheet -> the same shape as src/data/catalog.js.
// Columns: category, name, brand, description, price, image, show
export function rowsToCatalog(rows) {
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name) => head.indexOf(name);
  const idx = { category: col('category'), name: col('name'), brand: col('brand'), description: col('description'), price: col('price'), image: col('image'), show: col('show') };
  if (idx.name < 0 || idx.category < 0) return [];
  const get = (r, k) => (idx[k] >= 0 ? (r[idx[k]] || '').trim() : '');

  const groups = new Map();
  rows.slice(1).forEach((r, n) => {
    const name = get(r, 'name');
    if (!name || HIDDEN.includes(get(r, 'show').toLowerCase())) return;
    const category = get(r, 'category') || 'Products';
    const imageKey = get(r, 'image');
    const item = {
      id: `${n}-${name}`,
      name,
      brand: get(r, 'brand'),
      desc: get(r, 'description'),
      price: get(r, 'price') || 'Contact for Price',
      image: imageMap[imageKey] || (/^https:\/\//.test(imageKey) ? imageKey : null),
    };
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
  });
  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

// status: 'loading' | 'live' (from the sheet) | 'fallback' (from src/data/catalog.js)
export default function useCatalog() {
  const { status, rows } = useCsv(PRICES_URL);
  return useMemo(() => {
    if (status === 'loading') return { status: 'loading', data: [] };
    if (status === 'live') {
      const data = rowsToCatalog(rows);
      if (data.length) return { status: 'live', data };
    }
    return { status: 'fallback', data: productsData };
  }, [status, rows]);
}
