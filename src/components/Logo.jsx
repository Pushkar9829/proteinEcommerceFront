import { Link } from 'react-router-dom';

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-3 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center">
        <span className={`absolute inset-0 rounded-full ${light ? 'bg-paper/15' : 'bg-ink'}`} />
        <svg viewBox="0 0 32 32" className="relative h-6 w-6">
          <circle cx="16" cy="19" r="7" className={light ? 'fill-chargeDeep' : 'fill-chargeDeep'} />
          <path d="M8 19c3-7 13-7 16 0" className="fill-chargeLight" />
          <circle cx="22" cy="10" r="2" className={light ? 'fill-paper' : 'fill-frame'} />
        </svg>
      </span>
      <span>
        <span className={`block font-display text-xl leading-none tracking-tight ${light ? 'text-paper' : 'text-ink'}`}>
          Protein Island
        </span>
        <span className={`mt-1 block text-[9px] tracking-[0.14em] uppercase ${light ? 'text-chargeLight' : 'text-chargeDeep'}`}>
          Lab-tested protein
        </span>
      </span>
    </Link>
  );
}
