import { useState } from 'react';
import { inviteStaff } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['manager', 'product', 'orders', 'warehouse', 'support', 'marketing', 'accounts', 'view-only'];

export default function AdminStaff() {
  const { user } = useAuth();
  const [form, setForm] = useState({ email: '', name: '', password: '', staffRole: 'product' });
  const [msg, setMsg] = useState('');
  if (user?.staffRole !== 'owner') return <p className="text-paper/60">Only the owner may invite staff.</p>;
  return (
    <div>
      <h1 className="display text-4xl">Staff</h1>
      <form
        className="mt-8 max-w-lg space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg('');
          try {
            await inviteStaff(form);
            setMsg('Invite created');
            setForm({ email: '', name: '', password: '', staffRole: 'product' });
          } catch (err) {
            setMsg(err.message);
          }
        }}
      >
        <input className="input border-paper/20 text-paper" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input border-paper/20 text-paper" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input border-paper/20 text-paper" type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="input border-paper/20 bg-ink text-paper" value={form.staffRole} onChange={(e) => setForm({ ...form, staffRole: e.target.value })}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button className="btn-primary" type="submit">
          Invite
        </button>
        {msg && <p className="text-chargeLight">{msg}</p>}
      </form>
    </div>
  );
}
