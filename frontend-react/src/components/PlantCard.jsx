import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import PlantArt from './PlantArt.jsx';
import Tilt from './Tilt.jsx';

// Photo if there is one (admin upload, link, or /public/plants/<id>.jpg), otherwise an illustration
export function PlantImage({ plant }) {
  const sources = [plant.image, `/plants/${plant.id}.jpg`].filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [plant.image, plant.id]);
  if (i >= sources.length) return <PlantArt category={plant.category} seed={plant.id} />;
  return <img src={sources[i]} alt={plant.name} loading="lazy" onError={() => setI(i + 1)} />;
}

export default function PlantCard({ plant }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const notify = useToast();
  const out = plant.stock < 1;
  const wished = has(plant.id);

  return (
    <Tilt className="h-100">
      <article className="plant-card h-100">
        <Link to={`/plant/${plant.id}`} className="plant-card-img" aria-label={plant.name}>
          <PlantImage plant={plant} />
          {out && <span className="badge-stock">Sold out</span>}
        </Link>
        <button className={'heart-btn' + (wished ? ' on' : '')} aria-pressed={wished}
          aria-label={wished ? `Remove ${plant.name} from wishlist` : `Save ${plant.name} to wishlist`}
          onClick={() => { toggle(plant); notify(wished ? 'Removed from wishlist' : 'Saved to your wishlist'); }}>
          {wished ? '♥' : '♡'}
        </button>
        <div className="plant-card-body">
          <div className="small text-muted">{plant.category}</div>
          <h3 className="plant-name"><Link to={`/plant/${plant.id}`} className="plain-link">{plant.name}</Link></h3>
          <div className="small text-muted mb-3">{plant.light} light · {plant.water} water</div>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <strong className="price">{money(plant.price)}</strong>
            <button className="btn btn-leaf btn-sm" disabled={out} onClick={() => { add(plant); notify(`${plant.name} added to cart`); }}>Add to cart</button>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
