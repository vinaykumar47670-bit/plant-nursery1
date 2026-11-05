import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import PlantDetail from './pages/PlantDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';
import Wishlist from './pages/Wishlist.jsx';
import { ScrollProgress, BackToTop, ScrollToTop } from './components/PageExtras.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children, admin }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main className={pathname === '/' || pathname === '/login' ? '' : 'page-offset'}>
        <div key={pathname} className="page-fade">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
