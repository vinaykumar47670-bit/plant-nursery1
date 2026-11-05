import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext({ items: [], has: () => false, toggle: () => {}, count: 0 });
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
  });
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(items)), [items]);

  const has = (id) => items.some((p) => p.id === id);
  const toggle = (p) =>
    setItems((cur) =>
      cur.some((x) => x.id === p.id)
        ? cur.filter((x) => x.id !== p.id)
        : [...cur, { id: p.id, name: p.name, price: p.price, stock: p.stock, image: p.image, category: p.category, light: p.light, water: p.water }]
    );

  return <WishlistContext.Provider value={{ items, has, toggle, count: items.length }}>{children}</WishlistContext.Provider>;
}
