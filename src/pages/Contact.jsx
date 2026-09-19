import { useState } from 'react';
import { callback, contact } from '../api/support';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto max-w-lg px-6 py-24 md:px-10">
      <p className="eyebrow">Support</p>
      <h1 className="display mt-3 text-5xl">Write to us</h1>
      <p className="mt-3 text-sm text-ink/65">Messages become support tickets. Callbacks use the demo SMS adapter.</p>
      <form
        className="mt-10 space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr('');
          setMsg('');
          try {
            await contact(form);
            setMsg('Message received.');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
          } catch (ex) {
            setErr(ex.message);
          }
        }}
      >
        {['name', 'email', 'phone', 'subject'].map((k) => (
          <input key={k} className="input" placeholder={k} value={form[k]} onChange={set(k)} />
        ))}
        <textarea className="input min-h-[120px]" placeholder="Message" value={form.message} onChange={set('message')} required />
        {err && <p className="alert-error">{err}</p>}
        {msg && <p className="alert-success">{msg}</p>}
        <button className="btn-primary w-full" type="submit">
          Send
        </button>
      </form>
      <button
        type="button"
        className="btn-ghost mt-4 w-full"
        onClick={async () => {
          setErr('');
          setMsg('');
          try {
            await callback({ name: form.name, phone: form.phone, message: form.message });
            setMsg('Callback requested — demo SMS queued.');
          } catch (ex) {
            setErr(ex.message);
          }
        }}
      >
        Request callback
      </button>
    </div>
  );
}
