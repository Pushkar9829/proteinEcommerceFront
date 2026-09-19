import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cmsHref, imgSrc } from '../lib/format';

const ease = [0.22, 1, 0.36, 1];

export default function HeroSlider({ banners = [] }) {
  const [i, setI] = useState(0);
  const slides = banners.length ? banners : [];

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <HeroCopy title="Protein built for progress" cta="/products" slideKey="fallback" />
      </section>
    );
  }

  const slide = slides[i];

  return (
    <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide._id || i}
          src={imgSrc(slide.desktopImage)}
          alt={slide.title}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <HeroCopy title={slide.title} cta={cmsHref(slide.link) || '/products'} slideKey={slide._id || i} />
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10 flex gap-2">
          {slides.map((s, idx) => (
            <button
              key={s._id || idx}
              type="button"
              onClick={() => setI(idx)}
              className={`h-px transition-all duration-500 ${idx === i ? 'w-12 bg-chargeLight' : 'w-8 bg-paper/30'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HeroCopy({ title, cta, slideKey }) {
  return (
    <div className="relative z-10 mx-auto flex h-full max-w-store items-end px-6 pb-20 md:px-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={slideKey}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-chargeLight">Protein Island</p>
          <h1 className="display mt-4 text-5xl text-paper md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-paper/75">
            Lab-tested whey, gainers and creatine. Every gram on the label, no proprietary blends.
          </p>
          <Link to={cta || '/products'} className="btn-primary mt-8">
            Shop all products
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
