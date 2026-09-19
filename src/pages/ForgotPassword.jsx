import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const res = await forgotPassword({ email });
      setMsg(res.message || 'If the account exists, reset instructions were sent.');
      setToken(res.data?.demoResetToken || '');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Account</p>
      <h1 className="display mt-3 text-5xl">Reset password</h1>
      <p className="mt-3 text-sm text-ink/65">Demo mailer — a reset token is shown here instead of a live inbox.</p>
      <form onSubmit={submit} className="mt-10 space-y-6">
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {err && <p className="alert-error">{err}</p>}
        {msg && <p className="alert-success">{msg}</p>}
        <button className="btn-primary w-full" type="submit">
          Send demo reset
        </button>
      </form>
      {token && (
        <p className="mt-8 break-all text-xs text-ink/65">
          Demo token:{' '}
          <Link className="underline" to={`/reset-password?token=${encodeURIComponent(token)}`}>
            continue to reset
          </Link>
        </p>
      )}
      <p className="mt-8 text-center text-sm text-ink/65">
        <Link to="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
