import { useEffect, useState } from 'react';

export default function Countdown({ endsAt }) {
  const [left, setLeft] = useState(diff(endsAt));
  useEffect(() => {
    const t = setInterval(() => setLeft(diff(endsAt)), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  if (!endsAt) return null;
  return (
    <div className="flex gap-5 font-display text-3xl text-paper">
      <Unit n={left.d} l="days" />
      <Unit n={left.h} l="hrs" />
      <Unit n={left.m} l="min" />
      <Unit n={left.s} l="sec" />
    </div>
  );
}

function Unit({ n, l }) {
  return (
    <div>
      <span className="animate-pulseSoft tabular-nums">{String(n).padStart(2, '0')}</span>
      <span className="ml-1 font-sans text-[10px] tracking-[0.12em] uppercase text-chargeLight">{l}</span>
    </div>
  );
}

function diff(endsAt) {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}
