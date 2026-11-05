import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import PlantCard from '../components/PlantCard.jsx';
import Reveal from '../components/Reveal.jsx';
import GrowingPlant from '../components/GrowingPlant.jsx';
import CountUp from '../components/CountUp.jsx';
import useScrollProgress from '../hooks/useScrollProgress.js';

const STEPS = [
  { n: '01', title: 'It starts as a seed', text: 'Every plant begins as a seed or a cutting in our own beds, never in a factory.' },
  { n: '02', title: 'Roots first', text: 'We hold each plant back until its roots are strong, so it keeps growing after it leaves us.' },
  { n: '03', title: 'Only the best leaves', text: 'Firm, deep green growth passes. Anything weak stays behind to recover.' },
  { n: '04', title: 'Then it comes home', text: 'Wrapped, boxed and sent with a care card that tells you exactly what to do on day one.' },
];

const LIGHTS = [
  { key: 'Low', label: 'Dim corner', hint: 'No direct sun' },
  { key: 'Medium', label: 'Bright room', hint: 'Soft window light' },
  { key: 'Bright', label: 'Sunny spot', hint: 'Balcony or south window' },
];

function FloatingLeaves() {
  const leaves = [
    { l: '8%', s: 46, d: 0, t: 14 }, { l: '22%', s: 28, d: 3, t: 18 }, { l: '47%', s: 36, d: 6, t: 16 },
    { l: '68%', s: 52, d: 2, t: 20 }, { l: '84%', s: 30, d: 8, t: 15 }, { l: '93%', s: 40, d: 4, t: 19 },
  ];
  return (
    <div className="floating-leaves" aria-hidden="true">
      {leaves.map((x, i) => (
        <svg key={i} viewBox="0 0 40 40" style={{ left: x.l, width: x.s, animationDelay: `${x.d}s`, animationDuration: `${x.t}s` }}>
          <path d="M4 36 C 4 14, 18 4, 36 4 C 36 22, 24 36, 4 36 Z" fill="#6fbf7d" />
        </svg>
      ))}
    </div>
  );
}

function Story() {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const active = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
  return (
    <section ref={ref} className="story" id="story">
      <div className="story-sticky">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6 order-2 order-md-1">
              <div className="eyebrow">How we grow</div>
              <div className="story-steps">
                {STEPS.map((s, i) => (
                  <div key={s.n} className={'story-step' + (i === active ? ' active' : '')}>
                    <div className="story-num">{s.n}</div>
                    <h2 className="story-title">{s.title.split(' ').slice(0, -1).join(' ')} <em>{s.title.split(' ').slice(-1)}</em></h2>
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="story-dots" aria-hidden="true">
                {STEPS.map((s, i) => <span key={s.n} className={i <= active ? 'on' : ''} />)}
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 text-center">
              <GrowingPlant p={p} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [light, setLight] = useState('Low');

  useEffect(() => {
    api.get('/api/plants.php').then(setPlants).catch(() => {});
    api.get('/api/plants.php?action=categories').then(setCategories).catch(() => {});
  }, []);

  const matches = plants.filter((p) => p.light === light).slice(0, 3);

  return (
    <>
      {/* 1. HERO */}
      <section className="cine-hero">
        <div className="hero-bg" />
        <FloatingLeaves />
        <div className="container hero-inner">
          <div className="eyebrow hero-in" style={{ '--d': '.1s' }}>Fernwood Nursery</div>
          <h1 className="cine-title hero-in" style={{ '--d': '.25s' }}>Grown slowly.<br /><em>Delivered alive.</em></h1>
          <p className="hero-sub hero-in" style={{ '--d': '.45s' }}>Hand-raised plants for balconies, bookshelves and bright windows.</p>
          <div className="d-flex flex-wrap gap-3 hero-in" style={{ '--d': '.65s' }}>
            <Link to="/shop" className="btn btn-marigold btn-lg">Shop the collection</Link>
            <a href="#story" className="btn btn-ghost btn-lg">See how we grow</a>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </section>

      {/* 2. SCROLL STORY: plant grows as you scroll */}
      <Story />

      {/* 3. LIGHT PICKER */}
      <section className="scene container">
        <Reveal>
          <div className="eyebrow">Find your plant</div>
          <h2 className="scene-title">Where will it <em>live?</em></h2>
        </Reveal>
        <div className="row g-4 align-items-start mt-2">
          <div className="col-lg-4">
            <div className="light-picker" role="radiogroup" aria-label="Light at your place">
              {LIGHTS.map((l) => (
                <button key={l.key} role="radio" aria-checked={light === l.key}
                  className={'light-opt light-' + l.key + (light === l.key ? ' active' : '')}
                  onClick={() => setLight(l.key)}>
                  <span className="light-dot" />
                  <span className="fw-semibold">{l.label}</span>
                  <span className="small text-muted">{l.hint}</span>
                </button>
              ))}
            </div>
            <Link to={`/shop?light=${light}`} className="btn btn-marigold mt-3">See all {light.toLowerCase()}-light plants</Link>
          </div>
          <div className="col-lg-8">
            <div className="row g-3">
              {matches.map((p) => <div className="col-6 col-md-4" key={p.id}><PlantCard plant={p} /></div>)}
              {matches.length === 0 && <p className="text-muted">Loading plants for this spot…</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 4. COLLECTION: horizontal scroll */}
      <section className="scene">
        <div className="container">
          <Reveal className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <div className="eyebrow">The collection</div>
              <h2 className="scene-title mb-0">Fresh from the <em>beds</em></h2>
            </div>
            <Link to="/shop" className="link-amber">View all plants →</Link>
          </Reveal>
        </div>
        <div className="h-scroll">
          {plants.slice(0, 8).map((p) => <div className="h-item" key={p.id}><PlantCard plant={p} /></div>)}
        </div>
      </section>

      {/* 5. CATEGORIES */}
      <section className="scene container">
        <Reveal><div className="eyebrow">Browse by type</div></Reveal>
        <div className="cat-list">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link to={`/shop?category=${c.id}`} className="cat-row">
                <span>{c.name}</span><span className="cat-arrow">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5b. NUMBERS (real counts from the database) */}
      <section className="container scene">
        <div className="row g-3 text-center">
          {[
            [plants.length, '', 'plant varieties'],
            [categories.length, '', 'plant types'],
            [plants.reduce((s, p) => s + Number(p.stock), 0), '', 'plants ready to ship'],
            [7, ' days', 'replacement promise'],
          ].map(([v, suffix, label]) => (
            <div className="col-6 col-md-3" key={label}>
              <div className="stat-big"><CountUp value={v} suffix={suffix} /></div>
              <div className="text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5c. CARE CORNER */}
      <section className="container scene">
        <Reveal><div className="eyebrow">Care corner</div><h2 className="scene-title">Keep it <em>thriving</em></h2></Reveal>
        <div className="row g-4 mt-1">
          {[
            ['Water the right way', 'Push a finger into the soil. If the top two inches are dry, water. If it is still damp, wait.'],
            ['Match the light', 'Low-light plants burn in strong sun, and sun lovers stretch and weaken in a dim corner.'],
            ['Give it room', 'When roots peek out of the pot, move to one size bigger and use fresh soil.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="col-md-4"><div className="care-card h-100"><h3 className="h4">{t}</h3><p className="text-muted mb-0">{d}</p></div></Reveal>
          ))}
        </div>
      </section>

      {/* 6. PROMISE + CTA */}
      <section className="closing">
        <div className="container">
          <Reveal>
            <h2 className="cine-title closing-title">Bring something <em>alive</em> home.</h2>
          </Reveal>
          <div className="row g-4 my-4">
            {[['Packed to arrive healthy', 'Every plant is wrapped and boxed so leaves and roots stay safe.'],
              ['A care card in every box', 'Light, water and feeding tips for your exact plant.'],
              ['Replacement in 7 days', 'If a plant arrives damaged, tell us and we send a new one.']].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.1} className="col-md-4"><h3 className="h5">{t}</h3><p className="text-muted mb-0">{d}</p></Reveal>
            ))}
          </div>
          <Link to="/shop" className="btn btn-marigold btn-lg">Start shopping</Link>
        </div>
      </section>
    </>
  );
}
