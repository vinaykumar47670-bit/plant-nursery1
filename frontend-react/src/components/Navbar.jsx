import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || pathname !== '/';

  return (
    <nav className={'navbar navbar-expand-md nursery-nav fixed-top' + (solid ? ' solid' : '')}>
      <div className="container">
        <Link className="navbar-brand brand" to="/">Fern<em>wood</em></Link>
        <button className="navbar-toggler border-0" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Open menu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/shop">Shop plants</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/wishlist">Wishlist{wishCount > 0 && <span className="nav-badge">{wishCount}</span>}</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/orders">My orders</NavLink></li>}
            {user?.role === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="btn btn-ghost btn-sm position-relative">
              Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            {user ? (
              <button className="btn btn-link nav-link p-0" onClick={async () => { await logout(); navigate('/'); }}>
                Log out ({user.name.split(' ')[0]})
              </button>
            ) : (
              <Link to="/login" className="btn btn-marigold btn-sm">Log in</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
