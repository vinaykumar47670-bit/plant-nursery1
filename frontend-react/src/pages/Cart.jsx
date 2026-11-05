import { Link, useNavigate } from 'react-router-dom';
import { money } from '../api.js';
import { PlantImage } from '../components/PlantCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="container py-5 text-center">
        <h1 className="page-title">Your cart is empty</h1>
        <p className="text-muted">Pick a few plants and they will show up here.</p>
        <Link to="/shop" className="btn btn-leaf">Browse plants</Link>
      </div>
    );

  return (
    <div className="container py-4">
      <h1 className="page-title">Your cart</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((i) => (
            <div className="cart-row" key={i.id}>
              <div className="cart-img"><PlantImage plant={i} /></div>
              <div className="flex-grow-1">
                <Link to={`/plant/${i.id}`} className="plain-link fw-semibold">{i.name}</Link>
                <div className="text-muted small">{money(i.price)} each</div>
                <button className="btn btn-link p-0 small text-danger" onClick={() => remove(i.id)}>Remove</button>
              </div>
              <div className="stepper" role="group" aria-label={`Quantity of ${i.name}`}>
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty(i.id, i.quantity - 1)} disabled={i.quantity <= 1}>−</button>
                <span aria-live="polite">{i.quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty(i.id, i.quantity + 1)} disabled={i.quantity >= i.stock}>+</button>
              </div>
              <strong className="line-total">{money(i.price * i.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="care-card">
            <h2 className="h5">Order summary</h2>
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="d-flex justify-content-between"><span>Delivery</span><span>Free</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3"><span>Total</span><span>{money(total)}</span></div>
            <button className="btn btn-leaf w-100" onClick={() => navigate('/checkout')}>Go to checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
