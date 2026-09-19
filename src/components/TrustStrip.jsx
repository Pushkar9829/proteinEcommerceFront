import { motion } from 'framer-motion';

export default function TrustStrip({ badges = [] }) {
  if (!badges.length) return null;
  return (
    <section className="border-y border-ink/10 bg-haze">
      <div className="mx-auto grid max-w-store grid-cols-1 divide-y divide-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {badges.map((b, i) => (
          <motion.div
            key={b._id || b.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="px-8 py-12 text-center"
          >
            <p className="eyebrow">{b.title}</p>
            <p className="mt-3 font-display text-2xl">{b.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
