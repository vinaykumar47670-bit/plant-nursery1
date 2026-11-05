import { useId } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BigLeaf({ from = '#3f9a62', to = '#0f3a28' }) {
  const id = useId().replace(/:/g, '');
  const ys = [250, 205, 160, 115, 70];
  return (
    <svg className="leaf" viewBox="0 0 200 300" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} /><stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M100 296 C 14 232 4 108 100 4 C 196 108 186 232 100 296 Z" fill={`url(#${id})`} />
      <path d="M100 296 L100 24" stroke="#fff" strokeOpacity=".2" strokeWidth="3" fill="none" />
      {ys.map((y) => (
        <g key={y} stroke="#fff" strokeOpacity=".13" strokeWidth="2" fill="none">
          <path d={`M100 ${y} Q 66 ${y - 20} 38 ${y - 52}`} />
          <path d={`M100 ${y} Q 134 ${y - 20} 162 ${y - 52}`} />
        </g>
      ))}
    </svg>
  );
}

// Moves at its own speed while you scroll, which gives the hero its depth
export function ParallaxLeaf({ className, speed = 100, children }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, speed]);
  return <motion.div className={'plx ' + className} style={{ y }}>{children}</motion.div>;
}

const FALL = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 71) % 100,
  size: 14 + ((i * 7) % 16),
  delay: -((i * 3.1) % 18),
  dur: 12 + ((i * 5) % 9),
  dx: ((i % 2 ? 1 : -1) * (40 + ((i * 13) % 90))) + 'px',
  rot: (i % 2 ? 1 : -1) * (180 + i * 40) + 'deg',
  color: i % 3 === 0 ? '#f6c453' : i % 3 === 1 ? '#56ad6a' : '#8fd18a',
}));

export function FallingLeaves() {
  return (
    <div className="falling" aria-hidden="true">
      {FALL.map((l, i) => (
        <span key={i} className="fall" style={{ left: l.left + '%', width: l.size, height: l.size * 1.5, animationDelay: l.delay + 's', animationDuration: l.dur + 's', '--dx': l.dx, '--rot': l.rot }}>
          <svg viewBox="0 0 20 30"><path d="M10 29 C 1 22 0 10 10 1 C 20 10 19 22 10 29 Z" fill={l.color} /></svg>
        </span>
      ))}
    </div>
  );
}
