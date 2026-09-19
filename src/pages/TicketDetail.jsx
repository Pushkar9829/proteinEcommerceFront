import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicket, replyTicket } from '../api/support';
import AccountNav from '../components/AccountNav.jsx';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [body, setBody] = useState('');
  const load = () => getTicket(id).then((r) => setTicket(r.data));
  useEffect(() => {
    load();
  }, [id]);

  if (!ticket) return <div className="px-10 py-24 text-sm text-ink/65">Opening ticket…</div>;

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <p className="eyebrow">{ticket.queue} · {ticket.status}</p>
      <h1 className="display mt-2 text-4xl">{ticket.subject}</h1>
      <div className="mt-10 space-y-6">
        {(ticket.messages || []).map((m, i) => (
          <div key={i} className="border-b border-ink/10 pb-4">
            <p className="text-[10px] uppercase tracking-widest text-chargeDeep">{m.authorType}</p>
            <p className="mt-2 text-sm">{m.body}</p>
          </div>
        ))}
      </div>
      <form
        className="mt-10 max-w-lg space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await replyTicket(id, body);
          setBody('');
          load();
        }}
      >
        <textarea className="input min-h-[80px]" placeholder="Reply" value={body} onChange={(e) => setBody(e.target.value)} required />
        <button className="btn-primary" type="submit">
          Send reply
        </button>
      </form>
    </div>
  );
}
