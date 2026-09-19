import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useHome } from '../context/HomeContext';
import { cmsHref } from '../lib/format';
import Logo from './Logo.jsx';

export default function Header() {
  const { home } = useHome();
  const { count, setOpen } = useCart();
  const { isAuthed, isStaff } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState('');
  const loc = useLocation();
  const nav = useNavigate();
  const isHome = loc.pathname === '/';
  const solid = scrolled || !isHome || mobile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
  }, [loc.pathname]);

  const items = home?.menus?.header || [
    { label: 'Shop', url: '/products' },
    { label: 'Whey', url: '/c/whey-protein' },
    { label: 'Offers', url: '/sale' },
  ];

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  return (
    <header className={`transition duration-500 ${solid ? 'bg-paper/90 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-store items-center justify-between gap-4 px-6 py-4 md:px-10">
        <button type="button" className="md:hidden" onClick={() => setMobile((v) => !v)}>
          {mobile ? <X size={20} className={solid ? 'text-ink' : 'text-paper'} /> : <Menu size={20} className={solid ? 'text-ink' : 'text-paper'} />}
        </button>
        <Logo light={!solid} />
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={cmsHref(item.url)}
              className={({ isActive }) =>
                `text-[11px] tracking-[0.12em] uppercase transition ${
                  solid ? 'text-ink/70 hover:text-ink' : 'text-paper/80 hover:text-paper'
                } ${isActive ? (solid ? 'text-chargeDeep' : 'text-chargeLight') : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={`flex items-center gap-4 ${solid ? 'text-ink' : 'text-paper'}`}>
          <form onSubmit={onSearch} className="hidden lg:block">
            <label className="flex items-center gap-2 border-b border-current/30 pb-1">
              <Search size={14} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-28 bg-transparent text-xs outline-none placeholder:text-current/40"
              />
            </label>
          </form>
          <Link to={isAuthed ? (isStaff ? '/admin' : '/account') : '/login'} aria-label="Account">
            <User size={18} />
          </Link>
          {!isStaff && (
            <button type="button" className="relative" onClick={() => setOpen(true)} aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-chargeLight text-[9px] text-ink">
                  {count}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {mobile && (
        <div className="border-t border-ink/10 bg-paper px-6 py-6 md:hidden">
          <form onSubmit={onSearch} className="mb-6 flex items-center gap-2 border-b border-ink/20 pb-2">
            <Search size={14} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="flex-1 bg-transparent text-sm outline-none" />
          </form>
          <div className="flex flex-col gap-4">
            {(home?.menus?.mobile || items).map((item) => (
              <Link key={item.label} to={cmsHref(item.url)} className="text-sm tracking-[0.1em] uppercase">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
