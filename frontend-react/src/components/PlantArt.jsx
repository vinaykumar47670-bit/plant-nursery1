// Hand-built plant illustrations (SVG). Used whenever a plant has no photo.
const LEAF = ['#3f9a62', '#2b7a4b', '#56ad6a', '#1f6a45', '#6bb36a'];
const POT = ['#c4673f', '#b08a63', '#d8d0bd', '#3f5560', '#8a5a44'];
const BLOOM = ['#ef5b83', '#f6c453', '#f28c4b', '#c77dd0', '#f3efe2'];
const FRUIT = ['#f4d03f', '#a5d64a', '#f28c4b'];

const leafPath = 'M0 0 C -16 -22 -14 -52 0 -76 C 14 -52 16 -22 0 0 Z';
const frondPath = 'M0 0 C -8 -30 -6 -72 0 -108 C 6 -72 8 -30 0 0 Z';
const thickPath = 'M0 0 C -14 -14 -12 -34 0 -46 C 12 -34 14 -14 0 0 Z';

function Leaves({ path, angles, scale = 1, colors, base = [100, 148], rib = true }) {
  return angles.map((a, i) => (
    <g key={i} transform={`translate(${base[0]} ${base[1]}) rotate(${a}) scale(${Array.isArray(scale) ? scale[i % scale.length] : scale})`}>
      <path d={path} fill={colors[i % colors.length]} />
      {rib && <path d="M0 0 L0 -66" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" fill="none" />}
    </g>
  ));
}

function Flower({ x, y, color, r = 9 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.sin((a * Math.PI) / 180) * r} cy={-Math.cos((a * Math.PI) / 180) * r} r={r * 0.78} fill={color} />
      ))}
      <circle r={r * 0.55} fill="#f6c453" />
    </g>
  );
}

export default function PlantArt({ category = 'Indoor', seed = 1, className }) {
  const s = Math.abs(Number(seed) || 1);
  const leaf = [LEAF[s % 5], LEAF[(s + 1) % 5], LEAF[(s + 2) % 5]];
  const pot = POT[s % 5];
  const bloom = BLOOM[s % 5];
  const gid = 'bg' + (s % 7) + category.replace(/\W/g, '');
  const low = category === 'Succulents' || category === 'Herbs';
  const potTop = low ? 158 : 148;

  let plant;
  if (category === 'Outdoor') {
    plant = <Leaves path={frondPath} angles={[-72, -46, -22, 0, 22, 46, 72]} scale={[0.85, 0.95, 1.05, 1.15]} colors={leaf} />;
  } else if (category === 'Succulents') {
    plant = (
      <>
        <Leaves path={thickPath} angles={[-80, -55, -30, -5, 20, 45, 70]} scale={1.05} colors={['#7fb59a', '#5f9d84']} base={[100, 158]} rib={false} />
        <Leaves path={thickPath} angles={[-65, -38, -12, 14, 40, 66]} scale={0.8} colors={['#9ccbb3', '#79b59a']} base={[100, 158]} rib={false} />
      </>
    );
  } else if (category === 'Flowering') {
    plant = (
      <>
        <Leaves path={leafPath} angles={[-60, -30, 30, 60]} scale={0.6} colors={leaf} />
        <path d="M100 148 Q 96 112 74 86 M100 148 Q 102 100 104 70 M100 148 Q 108 116 132 92" stroke="#2b7a4b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Flower x={74} y={80} color={bloom} /><Flower x={104} y={62} color={bloom} r={10} /><Flower x={134} y={86} color={bloom} />
      </>
    );
  } else if (category === 'Herbs') {
    const dots = [[78, 120, -30], [88, 104, 20], [70, 98, -50], [112, 112, 30], [124, 96, -20], [132, 118, 50], [100, 90, 0], [100, 120, 15], [90, 78, -10]];
    plant = (
      <>
        <path d="M100 158 Q 92 120 78 100 M100 158 Q 102 112 100 84 M100 158 Q 110 124 128 100" stroke="#2b7a4b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {dots.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="16" transform={`rotate(${r} ${x} ${y})`} fill={leaf[i % 3]} />)}
      </>
    );
  } else if (category === 'Fruit Plants') {
    plant = (
      <>
        <Leaves path={leafPath} angles={[-66, -40, -14, 14, 40, 66]} scale={[0.75, 0.9, 0.8]} colors={leaf} />
        {[[76, 96], [126, 88], [104, 110], [90, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={FRUIT[s % 3]} />)}
      </>
    );
  } else {
    plant = <Leaves path={leafPath} angles={[-64, -40, -15, 12, 38, 62]} scale={[0.95, 1.15, 1.3, 1.25, 1.05, 0.9]} colors={leaf} />;
  }

  return (
    <svg className={className} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label={category + ' plant illustration'}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2d6b4a" /><stop offset="100%" stopColor="#0f241a" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      <circle cx="100" cy="86" r="62" fill="#f6c453" opacity=".07" />
      <ellipse cx="100" cy="193" rx="56" ry="5" fill="#000" opacity=".25" />
      {plant}
      <path d={`M64 ${potTop} h72 l-9 ${192 - potTop - 4} h-54 z`} fill={pot} />
      <rect x="58" y={potTop - 6} width="84" height="11" rx="4" fill={pot} />
      <rect x="58" y={potTop - 6} width="84" height="4" rx="2" fill="#fff" opacity=".18" />
    </svg>
  );
}
