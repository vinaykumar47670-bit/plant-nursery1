import { Link } from 'react-router-dom';
import PlantCard from '../components/PlantCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Wishlist() {
  const { items } = useWishlist();
  return (
    <div className="container py-4">
      <h1 className="page-title">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p className="mb-2">You have not saved any plants yet. Tap the heart on a plant to keep it here.</p>
          <Link to="/shop" className="btn btn-marigold">Browse plants</Link>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((p) => <div className="col-6 col-md-4 col-lg-3" key={p.id}><PlantCard plant={p} /></div>)}
        </div>
      )}
    </div>
  );
}
