import { useEffect, useState } from 'react';
import { dashboard } from '../../api/admin';

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    dashboard().then((r) => setData(r.data)).catch(() => {});
  }, []);
  if (!data) return <p className="text-paper/50">Gathering the day…</p>;
  const cards = [
    ['Orders today', data.today?.orders],
    ['Payments today', data.today?.payments],
    ['Packing', data.packing],
    ['Low stock', data.lowStock],
    ['Tickets', data.tickets],
    ['Returns', data.returns],
  ];
  return (
    <div>
      <p className="text-[10px] tracking-[0.12em] uppercase text-chargeLight">Studio</p>
      <h1 className="display mt-2 text-4xl">Today on the island</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([l, v]) => (
          <div key={l} className="border border-paper/10 bg-paper/5 p-6">
            <p className="text-[10px] tracking-[0.12em] uppercase text-chargeLight">{l}</p>
            <p className="mt-3 font-display text-4xl">{v ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
