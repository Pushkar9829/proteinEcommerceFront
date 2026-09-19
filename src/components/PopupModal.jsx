import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cmsHref } from '../lib/format';

export default function PopupModal({ popup }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return undefined;
    if (sessionStorage.getItem('pi_popup')) return undefined;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [popup]);

  const close = () => {
    sessionStorage.setItem('pi_popup', '1');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && popup && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md bg-paper p-10 text-center shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow">Welcome</p>
            <h3 className="display mt-3 text-4xl">{popup.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">{popup.body}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to={cmsHref(popup.ctaUrl) || '/products'} onClick={close} className="btn-primary">
                {popup.ctaLabel || 'Shop'}
              </Link>
              <button type="button" onClick={close} className="text-xs tracking-[0.12em] uppercase text-ink/65">
                Continue browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
