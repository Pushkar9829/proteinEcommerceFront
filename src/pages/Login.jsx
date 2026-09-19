import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function afterLogin(user, nav) {
  nav(user?.role === 'staff' ? '/admin' : '/account');
}

export default function Login() {
  const { login, requestOtp, verifyOtp, ready, isAuthed, isStaff } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState('password');
  const [form, setForm] = useState({ email: '', phone: '', password: '', code: '' });
  const [err, setErr] = useState('');
  if (ready && isAuthed) return <Navigate to={isStaff ? '/admin' : '/account'} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const user =
        mode === 'password'
          ? await login({ email: form.email, password: form.password })
          : await verifyOtp({ email: form.email, phone: form.phone, code: form.code, purpose: 'login' });
      afterLogin(user, nav);
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Sign in</p>
      <h1 className="display mt-3 text-5xl">Sign in</h1>
      <p className="mt-3 text-sm text-ink/65">One login for the store and the admin desk.</p>
      <div className="mt-8 flex gap-4">
        <button type="button" className={`chip ${mode === 'password' ? 'chip-on' : ''}`} onClick={() => setMode('password')}>
          Email
        </button>
        <button type="button" className={`chip ${mode === 'otp' ? 'chip-on' : ''}`} onClick={() => setMode('otp')}>
          OTP
        </button>
      </div>
      <form onSubmit={submit} className="mt-10 space-y-6">
        {mode === 'password' ? (
          <>
            <input className="input" placeholder="Email" value={form.email} onChange={set('email')} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={set('password')} />
          </>
        ) : (
          <>
            <input className="input" placeholder="Email or leave blank" value={form.email} onChange={set('email')} />
            <input className="input" placeholder="Mobile" value={form.phone} onChange={set('phone')} />
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => requestOtp({ email: form.email, phone: form.phone, purpose: 'login' })}
            >
              Send demo OTP
            </button>
            <input className="input" placeholder="OTP (123456)" value={form.code} onChange={set('code')} />
          </>
        )}
        {err && <p className="alert-error">{err}</p>}
        <button className="btn-primary w-full" type="submit">
          Enter
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-ink/65">
        <Link to="/forgot-password" className="underline">
          Forgot password
        </Link>
        {' · '}
        <Link to="/register" className="text-ink underline">
          Create account
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-ink/65">
        Customer: customer@protein.store / Customer@123
        <br />
        Studio: owner@protein.store / Owner@123
        <br />
        Demo OTP: 123456
      </p>
    </div>
  );
}
