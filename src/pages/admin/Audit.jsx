import { useEffect, useState } from 'react';
import { audit } from '../../api/admin';

export default function AdminAudit() {
  const [data, setData] = useState({ items: [] });
  useEffect(() => {
    audit({ limit: 80 }).then((r) => setData(r.data)).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Audit</h1>
      <ul className="mt-8 space-y-3 text-sm">
        {(data.items || []).map((a) => (
          <li key={a._id} className="border-b border-paper/10 py-3">
            <p className="text-chargeLight">
              {a.action} · {a.entity}
            </p>
            <p className="text-paper/60">
              {a.actorId?.name || a.actorId} · {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
            </p>
          </li>
        ))}
        {!data.items?.length && <p className="text-paper/50">No audit rows yet.</p>}
      </ul>
    </div>
  );
}
