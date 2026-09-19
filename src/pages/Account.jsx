import { useState } from 'react';
import { updateMe } from '../api/auth';
import AccountNav from '../components/AccountNav.jsx';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, refresh } = useAuth();
  const prefs = user?.messagePreferences || {};
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gstin: user?.gstin || '',
  });
  const [channels, setChannels] = useState({
    email: prefs.email !== false,
    sms: prefs.sms !== false,
    whatsapp: Boolean(prefs.whatsapp),
    inAccount: prefs.inAccount !== false,
  });
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    await updateMe({ ...form, messagePreferences: channels });
    await refresh();
    setMsg('Saved');
  };

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <form onSubmit={save} className="max-w-md space-y-6">
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <input className="input" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} placeholder="GSTIN" />
        <div>
          <p className="eyebrow mb-3">Message preferences</p>
          <div className="space-y-2 text-sm">
            {[
              ['email', 'Email (demo)'],
              ['sms', 'SMS (demo)'],
              ['whatsapp', 'WhatsApp (demo)'],
              ['inAccount', 'In-account inbox'],
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-3">
                <input type="checkbox" checked={Boolean(channels[k])} onChange={(e) => setChannels({ ...channels, [k]: e.target.checked })} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <button className="btn-primary" type="submit">
          Save profile
        </button>
        {msg && <p className="alert-success">{msg}</p>}
      </form>
    </div>
  );
}
