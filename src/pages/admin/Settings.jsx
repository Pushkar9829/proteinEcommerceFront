import { useEffect, useState } from 'react';
import { backupSettings, getSettings, saveSettings } from '../../api/admin';

export default function AdminSettings() {
  const [form, setForm] = useState({
    name: '',
    gstin: '',
    taxPercent: 18,
    freeShippingOver: 999,
    ads: { google: 'AW-DEMO', facebook: 'FB-DEMO', instagram: 'IG-DEMO' },
  });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    getSettings().then((r) => setForm((prev) => ({ ...prev, ...(r.data || {}), ads: { google: '', facebook: '', instagram: '', ...(r.data?.ads || {}) } })));
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Settings</h1>
      <form
        className="mt-8 max-w-lg space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await saveSettings({
              name: form.name,
              gstin: form.gstin,
              taxPercent: Number(form.taxPercent),
              freeShippingOver: Number(form.freeShippingOver),
              ads: form.ads,
            });
            setMsg('Saved');
          } catch (err) {
            setMsg(err.message);
          }
        }}
      >
        {[
          ['name', 'Store name'],
          ['gstin', 'GSTIN'],
          ['taxPercent', 'Tax %'],
          ['freeShippingOver', 'Free shipping over'],
        ].map(([k, label]) => (
          <label key={k} className="block text-[10px] uppercase tracking-widest text-chargeLight">
            {label}
            <input
              className="input mt-2 border-paper/20 text-paper"
              value={form[k] ?? ''}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </label>
        ))}
        <p className="pt-4 text-[10px] uppercase tracking-widest text-chargeLight">Demo ad pixels</p>
        {['google', 'facebook', 'instagram'].map((k) => (
          <label key={k} className="block text-[10px] uppercase tracking-widest text-chargeLight">
            {k}
            <input
              className="input mt-2 border-paper/20 text-paper"
              value={form.ads?.[k] || ''}
              onChange={(e) => setForm({ ...form, ads: { ...form.ads, [k]: e.target.value } })}
            />
          </label>
        ))}
        <button className="btn-primary" type="submit">
          Save
        </button>
        <button
          type="button"
          className="btn-ghost ml-3"
          onClick={async () => {
            const res = await backupSettings();
            setMsg(res.data?.note || 'Demo backup recorded');
          }}
        >
          Demo backup
        </button>
        {msg && <p className="text-chargeLight">{msg}</p>}
      </form>
    </div>
  );
}
