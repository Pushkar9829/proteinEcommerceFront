export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-ink/15">
      <button type="button" className="px-4 py-2 text-lg" onClick={() => onChange(Math.max(min, value - 1))}>
        –
      </button>
      <span className="min-w-[2.5rem] text-center text-sm tabular-nums">{value}</span>
      <button type="button" className="px-4 py-2 text-lg" onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}
