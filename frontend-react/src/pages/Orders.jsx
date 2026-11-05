import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, money } from '../api.js';

const STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const { state } = useLocation();

  useEffect(() => { api.get('/api/orders.php').then(setOrders).catch(() => setOrders([])); }, []);

  return (
    <div className="container py-4">
      <h1 className="page-title">My orders</h1>
      {state?.placed && <div className="alert alert-success">Order #{state.placed} is placed. We will pack it soon.</div>}
      {orders === null && <p className="text-muted">Loading…</p>}
      {orders?.length === 0 && <p>You have no orders yet. <Link to="/shop">Browse plants</Link></p>}
      {orders?.map((o) => {
        const step = STEPS.indexOf(o.status);
        return (
          <div className="order-card" key={o.id}>
            <div className="d-flex justify-content-between flex-wrap">
              <strong>Order #{o.id}</strong>
              <span className="text-muted">{new Date(o.created_at).toLocaleDateString()}</span>
            </div>
            {o.status === 'Cancelled' ? (
              <div className="text-danger my-2">Cancelled</div>
            ) : (
              <div className="tracker my-3">
                {STEPS.map((s, i) => (
                  <div key={s} className={'track-step' + (i <= step ? ' done' : '')}><span className="track-dot" />{s}</div>
                ))}
              </div>
            )}
            {o.items.map((it, i) => (
              <div className="d-flex justify-content-between small" key={i}><span>{it.name} × {it.quantity}</span><span>{money(it.price * it.quantity)}</span></div>
            ))}
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-semibold"><span>{o.payment_method}</span><span>{money(o.total)}</span></div>
          </div>
        );
      })}
    </div>
  );
}
