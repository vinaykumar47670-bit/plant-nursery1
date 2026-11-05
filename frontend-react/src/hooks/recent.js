// Remembers the last plants a visitor opened (stored in the browser)
const KEY = 'recent';
export function getRecent() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
export function pushRecent(p) {
  try {
    const next = [{ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }, ...getRecent().filter((x) => x.id !== p.id)].slice(0, 6);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* storage unavailable */ }
}
