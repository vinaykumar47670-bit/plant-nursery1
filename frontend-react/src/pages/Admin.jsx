import { useEffect, useState } from 'react';
import { api, money, NODE_URL } from '../api.js';

const STATUSES = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const EMPTY = { name: '', scientific_name: '', category_id: 1, description: '', price: '', stock: '', light: 'Medium', water: 'Medium', care_tips: '', image: '' };

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="container py-4">
      <h1 className="page-title">Admin panel</h1>
      <div className="admin-tabs mb-4">
        {[['dashboard', 'Dashboard'], ['plants', 'Plants'], ['orders', 'Orders']].map(([k, label]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'plants' && <PlantsAdmin />}
      {tab === 'orders' && <OrdersAdmin />}
    </div>
  );
}

function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/api/admin.php?action=stats').then(setS); }, []);
  if (!s) return <p className="text-muted">Loading…</p>;
  const cards = [['Revenue', money(s.revenue)], ['Orders', s.orders], ['Plants', s.plants], ['Customers', s.customers]];
  return (
    <>
      <div className="row g-3 mb-4">
        {cards.map(([label, value]) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="stat"><div className="stat-value">{value}</div><div className="text-muted">{label}</div></div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="care-card">
            <h2 className="h6">Running low on stock</h2>
            {s.low_stock.length === 0 && <p className="mb-0 text-muted">All plants are well stocked.</p>}
            {s.low_stock.map((p) => <div key={p.id} className="d-flex justify-content-between"><span>{p.name}</span><strong className={p.stock === 0 ? 'text-danger' : ''}>{p.stock} left</strong></div>)}
          </div>
        </div>
        <div className="col-md-6">
          <div className="care-card">
            <h2 className="h6">Latest orders</h2>
            {s.recent.length === 0 && <p className="mb-0 text-muted">No orders yet.</p>}
            {s.recent.map((o) => <div key={o.id} className="d-flex justify-content-between"><span>#{o.id} · {o.name}</span><span>{money(o.total)} · {o.status}</span></div>)}
          </div>
        </div>
      </div>
    </>
  );
}

function PlantsAdmin() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/api/plants.php').then(setPlants);
  useEffect(() => { load(); api.get('/api/plants.php?action=categories').then(setCategories); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await api.post('/api/admin.php?action=plant_save', form);
      setForm(null); load();
    } catch (err) { setMsg(err.message); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try { await api.get('/api/admin.php?action=plant_delete&id=' + p.id); load(); }
    catch (err) { alert(err.message); }
  };

  const upload = async (file) => {
    if (!file) return;
    setUploading(true); setMsg('');
    try {
      const data = new FormData(); data.append('image', file);
      const res = await fetch(NODE_URL + '/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setForm((f) => ({ ...f, image: json.url }));
    } catch (err) { setMsg('Upload failed: ' + err.message + '. Is the Node service running?'); }
    finally { setUploading(false); }
  };

  if (form)
    return (
      <form onSubmit={save} className="care-card">
        <h2 className="h5">{form.id ? 'Edit plant' : 'Add a plant'}</h2>
        <div className="row g-2">
          <div className="col-md-6"><label className="form-label">Name</label><input className="form-control" required value={form.name} onChange={set('name')} /></div>
          <div className="col-md-6"><label className="form-label">Scientific name</label><input className="form-control" value={form.scientific_name} onChange={set('scientific_name')} /></div>
          <div className="col-md-4"><label className="form-label">Type</label>
            <select className="form-select" value={form.category_id} onChange={set('category_id')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="col-md-4"><label className="form-label">Price (₹)</label><input type="number" min="1" className="form-control" required value={form.price} onChange={set('price')} /></div>
          <div className="col-md-4"><label className="form-label">Stock</label><input type="number" min="0" className="form-control" required value={form.stock} onChange={set('stock')} /></div>
          <div className="col-md-6"><label className="form-label">Light</label>
            <select className="form-select" value={form.light} onChange={set('light')}><option>Low</option><option>Medium</option><option>Bright</option></select></div>
          <div className="col-md-6"><label className="form-label">Water</label>
            <select className="form-select" value={form.water} onChange={set('water')}><option>Low</option><option>Medium</option><option>High</option></select></div>
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={form.description} onChange={set('description')} /></div>
          <div className="col-12"><label className="form-label">Care tips</label><textarea className="form-control" rows="2" value={form.care_tips} onChange={set('care_tips')} /></div>
          <div className="col-12">
            <label className="form-label">Photo</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" className="form-control mb-2" onChange={(e) => upload(e.target.files[0])} />
            <input className="form-control" placeholder="or paste an image link" value={form.image} onChange={set('image')} />
            {uploading && <div className="small text-muted mt-1">Uploading…</div>}
            {form.image && <img src={form.image} alt="" className="mt-2 rounded" style={{ height: 90 }} />}
          </div>
        </div>
        {msg && <div className="alert alert-danger mt-3 mb-0">{msg}</div>}
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-leaf">Save plant</button>
          <button type="button" className="btn btn-leaf-outline" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </form>
    );

  return (
    <>
      <button className="btn btn-leaf mb-3" onClick={() => setForm({ ...EMPTY })}>Add a plant</button>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Type</th><th>Price</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {plants.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td>
                <td className={p.stock <= 10 ? 'text-danger fw-semibold' : ''}>{p.stock}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-leaf-outline me-1" onClick={() => setForm({ ...p })}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState(null);
  const load = () => api.get('/api/admin.php?action=orders').then(setOrders);
  useEffect(() => { load(); }, []);

  const change = async (id, status) => { await api.post('/api/admin.php?action=order_status', { id, status }); load(); };

  if (!orders) return <p className="text-muted">Loading…</p>;
  if (orders.length === 0) return <p className="text-muted">No orders yet. They will show up here as customers check out.</p>;
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead><tr><th>#</th><th>Customer</th><th>Address</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.name}<div className="small text-muted">{o.email}</div></td>
              <td style={{ maxWidth: 260 }} className="small">{o.address}</td>
              <td>{money(o.total)}<div className="small text-muted">{o.payment_method}</div></td>
              <td>
                <select className="form-select form-select-sm" value={o.status} onChange={(e) => change(o.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
