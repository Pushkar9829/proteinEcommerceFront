import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Stars from './Stars.jsx';

export default function Testimonials({ items = [] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const t = items[i];

  return (
    <section className="bg-ink px-6 py-24 text-paper md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-chargeLight">Reviews</p>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={t._id || i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-8 text-3xl leading-snug md:text-4xl"
          >
            “{t.quote}”
          </motion.blockquote>
        </AnimatePresence>
        <Stars value={t.rating || 5} size={16} tone="dark" className="mt-8 justify-center" />
        <p className="mt-3 text-sm text-paper/70">
          {t.name}
          {t.role ? ` · ${t.role}` : ''}
          {t.location ? ` · ${t.location}` : ''}
        </p>
        <div className="mt-10 flex justify-center gap-2">
          {items.map((item, idx) => (
            <button
              key={item._id || idx}
              type="button"
              onClick={() => setI(idx)}
              className={`h-px transition-all duration-500 ${idx === i ? 'w-10 bg-chargeLight' : 'w-6 bg-paper/25'}`}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
