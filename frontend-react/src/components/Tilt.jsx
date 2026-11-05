import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Cards lean toward the mouse for a soft 3D feel
export default function Tilt({ children, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 18 });

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} className={className} onMouseMove={move} onMouseLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}>
      {children}
    </motion.div>
  );
}
