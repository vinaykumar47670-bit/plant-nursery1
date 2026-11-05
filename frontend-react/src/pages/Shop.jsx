import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import PlantCard from '../components/PlantCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('q') || '');

  useEffect(() => { api.get('/api/plants.php?action=categories').then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/api/plants.php?' + params.toString()).then(setPlants).catch(() => setPlants([])).finally(() => setLoading(false));
  }, [params]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <div className="container py-4">
      <h1 className="page-title">Shop plants</h1>

      <form className="filters" onSubmit={(e) => { e.preventDefault(); setParam('q', search.trim()); }}>
        <input className="form-control" placeholder="Search by name, e.g. snake plant" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" value={params.get('category') || ''} onChange={(e) => setParam('category', e.target.value)}>
          <option value="">All types</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-select" value={params.get('light') || ''} onChange={(e) => setParam('light', e.target.value)}>
          <option value="">Any light</option>
          <option value="Low">Low light</option>
          <option value="Medium">Medium light</option>
          <option value="Bright">Bright light</option>
        </select>
        <select className="form-select" value={params.get('max') || ''} onChange={(e) => setParam('max', e.target.value)}>
          <option value="">Any price</option>
          <option value="250">Up to ₹250</option>
          <option value="500">Up to ₹500</option>
          <option value="1000">Up to ₹1,000</option>
        </select>
        <select className="form-select" value={params.get('sort') || ''} onChange={(e) => setParam('sort', e.target.value)}>
          <option value="">Name A to Z</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="new">Newest first</option>
        </select>
        <button className="btn btn-leaf">Search</button>
      </form>

      {loading ? (
        <div className="row g-4" aria-busy="true" aria-label="Loading plants">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={i}><div className="skeleton-card"><div className="skeleton-img" /><div className="skeleton-line" /><div className="skeleton-line short" /></div></div>
          ))}
        </div>
      ) : plants.length === 0 ? (
        <div className="empty">
          <p className="mb-2">No plants match these filters.</p>
          <button className="btn btn-leaf-outline" onClick={() => { setSearch(''); setParams({}); }}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="text-muted small mb-3">{plants.length} plant{plants.length > 1 ? 's' : ''} found</div>
          <div className="row g-4">
            {plants.map((p) => <div className="col-6 col-md-4 col-lg-3" key={p.id}><PlantCard plant={p} /></div>)}
          </div>
        </>
      )}
    </div>
  );
}
