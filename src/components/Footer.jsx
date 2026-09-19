import { Link } from 'react-router-dom';
import { useHome } from '../context/HomeContext';
import { cmsHref } from '../lib/format';
import Logo from './Logo.jsx';

export default function Footer() {
  const { home } = useHome();
  const items = home?.menus?.footer || [
    { label: 'About', url: '/pages/about' },
    { label: 'Shipping', url: '/pages/shipping' },
    { label: 'Returns', url: '/pages/returns' },
    { label: 'Privacy', url: '/pages/privacy' },
    { label: 'Terms', url: '/pages/terms' },
    { label: 'FAQ', url: '/pages/faq' },
  ];
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="rule opacity-40" />
      <div className="mx-auto grid max-w-store gap-12 px-6 py-20 md:grid-cols-3 md:px-10">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-paper/70">
            Protein Island publishes the full label on every product — protein per serving, servings per tub and price per
            serving. Third-party tested, no proprietary blends.
          </p>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          <div className="mt-5 flex flex-col gap-3">
            {items.map((i) => (
              <Link key={i.label} to={cmsHref(i.url)} className="text-sm text-paper/70 hover:text-chargeLight">
                {i.label}
              </Link>
            ))}
            <Link to="/blog" className="text-sm text-paper/70 hover:text-chargeLight">
              Journal
            </Link>
            <Link to="/contact" className="text-sm text-paper/70 hover:text-chargeLight">
              Contact
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Train</p>
          <p className="mt-5 font-display text-3xl text-paper/90">Train hard. Recover harder.</p>
          <p className="mt-4 text-xs tracking-[0.1em] uppercase text-chargeLight">Demo store · payments are simulated</p>
        </div>
      </div>
      <div className="border-t border-paper/10 px-6 py-6 text-center text-[11px] tracking-[0.1em] uppercase text-paper/70">
        © {new Date().getFullYear()} Protein Island
      </div>
    </footer>
  );
}
