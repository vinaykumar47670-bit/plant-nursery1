import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { PlantImage } from '../components/PlantCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import RecentlyViewed from '../components/RecentlyViewed.jsx';
import { pushRecent } from '../hooks/recent.js';

export default function PlantDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const { has, toggle } = useWishlist();
  const notify = useToast();
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  const load = () => api.get('/api/plants.php?action=detail&id=' + id).then(setPlant).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id]);
  useEffect(() => { if (plant) pushRecent(plant); }, [plant?.id]);

  if (error) return <div className="container py-5"><p>{error}</p><Link to="/shop">Back to shop</Link></div>;
  if (!plant) return <div className="container py-5 text-muted">Loading…</div>;

  const out = plant.stock < 1;
  const wished = has(plant.id);
  const avg = plant.reviews.length ? (plant.reviews.reduce((s, r) => s + r.rating, 0) / plant.reviews.length).toFixed(1) : null;

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/plants.php?action=review', { plant_id: plant.id, ...review });
      setReview({ rating: 5, comment: '' }); setReviewMsg(''); load();
    } catch (err) { setReviewMsg(err.message); }
  };

  return (
    <div className="container py-4">
      <Link to="/shop" className="plain-link small">← All plants</Link>
      <div className="row g-5 mt-1">
        <div className="col-md-6"><div className="detail-media"><PlantImage plant={plant} /></div></div>
        <div className="col-md-6">
          <div className="text-muted">{plant.category}</div>
          <h1 className="page-title mb-0">{plant.name}</h1>
          <div className="fst-italic text-muted mb-3">{plant.scientific_name}</div>
          <div className="price-big">{money(plant.price)}</div>
          {avg && <div className="mb-2">★ {avg} from {plant.reviews.length} review{plant.reviews.length > 1 ? 's' : ''}</div>}
          <p>{plant.description}</p>

          <div className="d-flex gap-2 mb-3">
            <span className="chip">{plant.light} light</span>
            <span className="chip">{plant.water} water</span>
            <span className="chip">{out ? 'Sold out' : `${plant.stock} in stock`}</span>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <input type="number" min="1" max={plant.stock} value={qty} className="form-control qty-input"
              onChange={(e) => setQty(Math.max(1, Math.min(plant.stock, Number(e.target.value) || 1)))} />
            <button className="btn btn-leaf btn-lg" disabled={out} onClick={() => { add(plant, qty); notify(`${plant.name} added to cart`); setAdded(true); setTimeout(() => setAdded(false), 1800); }}>
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
            <button className="btn btn-ghost btn-lg" aria-pressed={wished}
              onClick={() => { toggle(plant); notify(wished ? 'Removed from wishlist' : 'Saved to your wishlist'); }}>
              {wished ? '♥ Saved' : '♡ Save'}
            </button>
          </div>

          <div className="care-card mt-4">
            <h2 className="h6">How to care for it</h2>
            <p className="mb-0">{plant.care_tips}</p>
          </div>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="section-title">Reviews</h2>
        <div className="row g-4">
          <div className="col-md-7">
            {plant.reviews.length === 0 && <p className="text-muted">No reviews yet. Be the first to review this plant.</p>}
            {plant.reviews.map((r, i) => (
              <div className="review" key={i}>
                <div><strong>{r.name}</strong> <span className="text-muted small">{new Date(r.created_at).toLocaleDateString()}</span></div>
                <div>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className="mb-0">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="col-md-5">
            {user ? (
              <form onSubmit={submitReview} className="care-card">
                <h3 className="h6">Write a review</h3>
                <select className="form-select mb-2" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                </select>
                <textarea className="form-control mb-2" rows="3" placeholder="How is the plant doing?" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                {reviewMsg && <div className="text-danger small mb-2">{reviewMsg}</div>}
                <button className="btn btn-leaf">Post review</button>
              </form>
            ) : (
              <p><Link to="/login">Log in</Link> to write a review.</p>
            )}
          </div>
        </div>
      </section>

      <RecentlyViewed excludeId={plant.id} />
    </div>
  );
}
