export default function Marquee({ text }) {
  if (!text) return null;
  const line = `${text}  ·  `;
  return (
    <div className="overflow-hidden bg-ink text-paper">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-[11px] tracking-[0.12em] uppercase">
        <span className="px-4">{line.repeat(12)}</span>
        <span className="px-4">{line.repeat(12)}</span>
      </div>
    </div>
  );
}
