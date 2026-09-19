import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navForRole } from '../lib/adminNav';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const role = user?.staffRole || 'view-only';
  const items = navForRole(role);

  return (
    <div className="admin-ui min-h-screen bg-ink text-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-paper/10 bg-moss p-6 md:flex md:flex-col">
        <p className="font-display text-2xl">Studio</p>
        <p className="mt-1 text-[10px] tracking-[0.12em] uppercase text-chargeLight">Protein Island</p>
        <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto text-[11px] tracking-[0.1em] uppercase">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.to === '/admin'}
              className={({ isActive }) => `rounded-sm px-3 py-2 ${isActive ? 'bg-paper/10 text-chargeLight' : 'text-paper/60 hover:text-paper'}`}
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="mt-6 flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-paper/70"
          onClick={async () => {
            await logout();
            nav('/');
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </aside>
      <div className="md:pl-60">
        <header className="flex items-center justify-between border-b border-paper/10 px-6 py-4">
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-chargeLight">{role}</p>
            <p className="font-display text-xl">{user?.name}</p>
          </div>
          <NavLink to="/" className="text-[11px] tracking-[0.1em] uppercase text-paper/70">
            View shop
          </NavLink>
        </header>
        <nav className="flex gap-3 overflow-x-auto border-b border-paper/10 px-6 py-3 text-[10px] tracking-[0.1em] uppercase md:hidden">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.to === '/admin'} className={({ isActive }) => (isActive ? 'text-chargeLight' : 'text-paper/70')}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
