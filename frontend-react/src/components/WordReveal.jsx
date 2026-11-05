import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Words light up one by one as you scroll
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }} className="word">{children}{' '}</motion.span>;
}

export default function WordReveal({ text, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  );
}
