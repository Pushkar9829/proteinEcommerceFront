import { Star } from 'lucide-react';

export default function Stars({ value = 0, count, size = 14, className = '', tone = 'light' }) {
  const rounded = Math.round(Number(value) || 0);
  const emptyStar = tone === 'dark' ? 'text-paper/30' : 'text-ink/25';
  const meta = tone === 'dark' ? 'text-paper/70' : 'text-ink/65';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= rounded ? 'fill-flame text-flame' : emptyStar}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="sr-only">{`Rated ${Number(value || 0).toFixed(1)} out of 5`}</span>
      {count != null && (
        <span className={`text-xs ${meta}`}>
          {count > 0 ? `${Number(value || 0).toFixed(1)} (${count})` : 'No reviews yet'}
        </span>
      )}
    </div>
  );
}
