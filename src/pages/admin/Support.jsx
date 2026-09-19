import { useEffect, useState } from 'react';
import { assignTicket, canned, getTicket, replyTicket, saveCanned, tickets } from '../../api/admin';

export default function AdminSupport() {
  const [list, setList] = useState([]);
  const [replies, setReplies] = useState([]);
  const [open, setOpen] = useState(null);
  const [body, setBody] = useState('');
  const [cannedForm, setCannedForm] = useState({ title: '', body: '', queue: 'order' });

  const load = () => {
    tickets().then((r) => setList(r.data.items || r.data || []));
    canned().then((r) => setReplies(r.data || []));
  };
  useEffect(() => {
    load();
  }, []);

  const openTicket = async (id) => {
    const res = await getTicket(id);
    setOpen(res.data);
  };

  return (
    <div>
      <h1 className="display text-4xl">Support</h1>
      <ul className="mt-8 space-y-3">
        {list.map((t) => (
          <li key={t._id}>
            <button type="button" className="w-full border-b border-paper/10 py-3 text-left" onClick={() => openTicket(t._id)}>
              {t.subject} · {t.status} · {t.source}
              {t.slaOverdue ? ' · overdue' : ''}
            </button>
          </li>
        ))}
        {!list.length && <p className="text-paper/50">No tickets.</p>}
      </ul>
      {open && (
        <div className="mt-8 border border-paper/10 p-6">
          <p className="font-display text-2xl">{open.subject}</p>
          <p className="text-xs uppercase tracking-widest text-chargeLight">
            {open.queue} · {open.status}
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {(open.messages || []).map((m, i) => (
              <p key={i}>
                <span className="text-chargeLight">{m.authorType}:</span> {m.body}
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {replies.map((c) => (
              <button key={c._id} type="button" className="chip" onClick={() => setBody(c.body)}>
                {c.title}
              </button>
            ))}
          </div>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await replyTicket(open._id, { body });
              setBody('');
              openTicket(open._id);
              load();
            }}
          >
            <textarea className="input min-h-[80px]" value={body} onChange={(e) => setBody(e.target.value)} required />
            <div className="flex gap-3">
              <button className="btn-primary" type="submit">
                Reply
              </button>
              <button type="button" className="btn-ghost" onClick={() => assignTicket(open._id, {}).then(() => openTicket(open._id))}>
                Assign me
              </button>
            </div>
          </form>
        </div>
      )}
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Canned replies</h2>
      <form
        className="mt-4 max-w-lg space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveCanned(cannedForm);
          setCannedForm({ title: '', body: '', queue: 'order' });
          load();
        }}
      >
        <input className="input" placeholder="Title" value={cannedForm.title} onChange={(e) => setCannedForm({ ...cannedForm, title: e.target.value })} />
        <textarea className="input min-h-[70px]" placeholder="Body" value={cannedForm.body} onChange={(e) => setCannedForm({ ...cannedForm, body: e.target.value })} />
        <button className="btn-primary" type="submit">
          Save canned
        </button>
      </form>
    </div>
  );
}
