import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', gstin: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(form);
      nav('/account');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Create account</p>
      <h1 className="display mt-3 text-5xl">Create account</h1>
      <form onSubmit={submit} className="mt-10 space-y-6">
        <input required className="input" placeholder="Name" value={form.name} onChange={set('name')} />
        <input className="input" placeholder="Email" value={form.email} onChange={set('email')} />
        <input className="input" placeholder="Mobile" value={form.phone} onChange={set('phone')} />
        <input required className="input" type="password" placeholder="Password" value={form.password} onChange={set('password')} />
        <input className="input" placeholder="GSTIN (optional)" value={form.gstin} onChange={set('gstin')} />
        {err && <p className="alert-error">{err}</p>}
        <button className="btn-primary w-full" type="submit">
          Register
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-ink/65">
        Already a member? <Link to="/login" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
