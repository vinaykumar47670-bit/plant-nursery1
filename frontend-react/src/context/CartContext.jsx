import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (plant, qty = 1) =>
    setItems((cur) => {
      const found = cur.find((i) => i.id === plant.id);
      if (found) return cur.map((i) => (i.id === plant.id ? { ...i, quantity: Math.min(i.quantity + qty, plant.stock) } : i));
      return [...cur, { id: plant.id, name: plant.name, category: plant.category, price: Number(plant.price), image: plant.image, stock: plant.stock, quantity: qty }];
    });
  const setQty = (id, quantity) =>
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</CartContext.Provider>;
}
