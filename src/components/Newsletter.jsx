import { motion } from 'framer-motion';
import { useState } from 'react';
import { contactSupport } from '../api/cms';

export default function Newsletter({ block }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  if (!block) return null;

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      await contactSupport({ email, subject: 'Newsletter', message: `Subscribe: ${email}`, name: email });
      setMsg('You are subscribed.');
      setEmail('');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-ink/10 px-6 py-24 md:px-10"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">{block.ctaLabel || 'Subscribe'}</p>
        <h2 className="display mt-3 text-4xl">{block.title}</h2>
        <p className="mt-4 text-sm text-ink/65">{block.body}</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <input
            required
            type="email"
            className="input flex-1"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-primary" type="submit">
            {block.ctaLabel || 'Subscribe'}
          </button>
        </form>
        {err && <p className="alert-error mt-4">{err}</p>}
        {msg && <p className="alert-success mt-4">{msg}</p>}
      </div>
    </motion.section>
  );
}
