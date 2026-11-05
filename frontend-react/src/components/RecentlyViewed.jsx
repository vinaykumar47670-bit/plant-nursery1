import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { getRecent } from '../hooks/recent.js';
import { PlantImage } from './PlantCard.jsx';

export default function RecentlyViewed({ excludeId }) {
  const list = getRecent().filter((p) => p.id !== excludeId);
  if (list.length === 0) return null;
  return (
    <section className="mt-5">
      <h2 className="section-title">Recently viewed</h2>
      <div className="recent-row">
        {list.map((p) => (
          <Link to={`/plant/${p.id}`} className="recent-item" key={p.id}>
            <div className="recent-img"><PlantImage plant={p} /></div>
            <div><div className="fw-semibold">{p.name}</div><div className="small text-muted">{money(p.price)}</div></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
