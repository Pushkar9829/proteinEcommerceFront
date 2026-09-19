import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/account', label: 'Profile' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/wishlist', label: 'Wishlist' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/tickets', label: 'Tickets' },
  { to: '/account/inbox', label: 'Inbox' },
  { to: '/account/returns', label: 'Returns' },
];

export default function AccountNav() {
  const { isAuthed, isStaff, ready, logout, user } = useAuth();
  const nav = useNavigate();
  if (!ready) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (isStaff) return <Navigate to="/admin" replace />;
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-6">
      <div>
        <p className="eyebrow">Member</p>
        <h1 className="display mt-2 text-4xl">{user?.name}</h1>
      </div>
      <div className="flex flex-wrap gap-6">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/account'}
            className={({ isActive }) => `text-[11px] tracking-[0.12em] uppercase ${isActive ? 'text-chargeDeep' : 'text-ink/65'}`}
          >
            {l.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={async () => {
            await logout();
            nav('/');
          }}
          className="text-[11px] tracking-[0.12em] uppercase text-ink/65"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
