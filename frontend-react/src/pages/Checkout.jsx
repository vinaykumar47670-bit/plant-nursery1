import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, money, NODE_URL } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) return <div className="container py-5">Your cart is empty. <Link to="/shop">Browse plants</Link></div>;

  const placeOrder = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await api.post('/api/orders.php', {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        address, payment_method: payment,
      });
      // Tell the Node service (it logs the order; swap in email later)
      fetch(NODE_URL + '/notify-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: res.order_id, name: user.name, total: res.total }),
      }).catch(() => {});
      clear();
      navigate('/orders', { state: { placed: res.order_id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="page-title">Checkout</h1>
      <div className="row g-4">
        <form className="col-lg-7" onSubmit={placeOrder}>
          <label className="form-label fw-semibold">Delivery address</label>
          <textarea className="form-control mb-3" rows="4" required placeholder="House number, street, city, PIN code" value={address} onChange={(e) => setAddress(e.target.value)} />
          <label className="form-label fw-semibold">Payment</label>
          <select className="form-select mb-3" value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option>Cash on Delivery</option>
            <option>UPI on Delivery</option>
          </select>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-marigold btn-lg" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(total)}`}</button>
        </form>
        <div className="col-lg-5">
          <div className="care-card">
            <h2 className="h6">Your plants</h2>
            {items.map((i) => (
              <div className="d-flex justify-content-between" key={i.id}><span>{i.name} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
