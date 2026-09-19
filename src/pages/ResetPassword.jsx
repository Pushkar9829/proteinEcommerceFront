import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const initial = useMemo(() => params.get('token') || '', [params]);
  const [form, setForm] = useState({ token: initial, password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await resetPassword(form);
      nav('/login');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Account</p>
      <h1 className="display mt-3 text-5xl">New password</h1>
      <form onSubmit={submit} className="mt-10 space-y-6">
        <input className="input" placeholder="Reset token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required />
        <input className="input" type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {err && <p className="alert-error">{err}</p>}
        <button className="btn-primary w-full" type="submit">
          Update password
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-ink/65">
        <Link to="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
