import { useEffect, useState } from 'react';
import { report, reportCsv } from '../../api/admin';
import { downloadText, inr } from '../../lib/format';

const TABS = ['sales', 'stock', 'products', 'offers', 'delivery', 'payments', 'customers', 'support'];

export default function AdminReports() {
  const [tab, setTab] = useState('sales');
  const [data, setData] = useState(null);
  const load = (name) => report(name).then((r) => setData(r.data)).catch(() => setData(null));
  useEffect(() => {
    load(tab);
  }, [tab]);

  const rows = data?.rows || data?.selling || [];

  return (
    <div>
      <h1 className="display text-4xl">Reports</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} type="button" className={`chip ${tab === t ? 'chip-on' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-ghost mt-4"
        onClick={async () => {
          const csv = await reportCsv(tab);
          downloadText(`${tab}.csv`, typeof csv === 'string' ? csv : csv.data || csv.csv || '');
        }}
      >
        Download CSV
      </button>
      {data?.summary && <p className="mt-4 text-sm text-paper/60">{JSON.stringify(data.summary)}</p>}
      {data?.busyDays && (
        <p className="mt-2 text-xs text-paper/50">Busy days: {(data.busyDays || []).map((d) => `${d.day} (${d.orders})`).join(', ')}</p>
      )}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-chargeLight">
            <tr>
              {(rows[0] ? Object.keys(rows[0]) : ['empty']).map((k) => (
                <th key={k} className="py-3 pr-4">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 80).map((row, i) => (
              <tr key={i} className="border-t border-paper/10">
                {Object.values(row).map((v, j) => (
                  <td key={j} className="py-2 pr-4">
                    {typeof v === 'number' && String(Object.keys(row)[j]).toLowerCase().includes('total') ? inr(v) : String(v ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
