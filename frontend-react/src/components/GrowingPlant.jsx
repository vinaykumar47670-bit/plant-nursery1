// A plant drawn in SVG that grows as `p` goes from 0 to 1
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => 1 - Math.pow(1 - v, 3);

const LEAF = 'M0 0 C 30 -42, 92 -42, 124 0 C 92 32, 30 32, 0 0 Z';
const LEAVES = [
  { x: 200, y: 450, dir: 1, t: 0.16, rot: -12, size: 1 },
  { x: 198, y: 392, dir: -1, t: 0.3, rot: -10, size: 1 },
  { x: 202, y: 325, dir: 1, t: 0.44, rot: -20, size: 0.9 },
  { x: 199, y: 262, dir: -1, t: 0.58, rot: -14, size: 0.85 },
  { x: 201, y: 200, dir: 1, t: 0.7, rot: -26, size: 0.75 },
  { x: 200, y: 150, dir: -1, t: 0.78, rot: -22, size: 0.65 },
];

export default function GrowingPlant({ p }) {
  const stem = ease(clamp(p / 0.85));
  const bloom = ease(clamp((p - 0.86) / 0.14));

  return (
    <svg viewBox="0 0 400 620" role="img" aria-label="A plant growing from a pot" className="growing-plant">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd49a" />
          <stop offset="1" stopColor="#2f7d46" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e9a53b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e9a53b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="260" r={150 + bloom * 60} fill="url(#glow)" opacity={0.3 + bloom * 0.7} />

      {/* stem draws upward */}
      <path d="M200 540 C 200 490, 192 440, 198 390 S 206 310, 200 260 S 196 190, 200 130"
        pathLength="1" fill="none" stroke="#6fbf7d" strokeWidth="6" strokeLinecap="round"
        strokeDasharray="1" strokeDashoffset={1 - stem} />

      {LEAVES.map((l, i) => {
        const s = ease(clamp((p - l.t) / 0.14)) * l.size;
        return (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot * l.dir}) scale(${l.dir * s} ${s})`}>
            <path d={LEAF} fill="url(#leafGrad)" />
            <path d="M0 0 C 40 -4, 80 -4, 112 0" stroke="#1b4a2b" strokeWidth="2" fill="none" opacity="0.5" />
          </g>
        );
      })}

      {/* flower at the top */}
      <g transform={`translate(200 126) scale(${bloom})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx="0" cy="-22" rx="11" ry="22" fill="#f4c45d" transform={`rotate(${a})`} />
        ))}
        <circle r="10" fill="#c97a1a" />
      </g>

      {/* pot and soil */}
      <path d="M130 540 L270 540 L254 610 L146 610 Z" fill="#b7673a" />
      <rect x="122" y="528" width="156" height="20" rx="6" fill="#c97a45" />
      <ellipse cx="200" cy="534" rx="70" ry="6" fill="#2a1a10" />
    </svg>
  );
}
