import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWishlist, removeWishlist } from '../api/user';
import AccountNav from '../components/AccountNav.jsx';
import { imgSrc } from '../lib/format';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const load = () => listWishlist().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {!items.length && <p className="text-sm text-ink/65">Nothing saved yet.</p>}
        {items.map((w) => (
          <div key={w._id}>
            <Link to={`/product/${w.productId?.slug}`}>
              <img src={imgSrc(w.productId?.photos?.[0])} alt="" className="aspect-[4/5] w-full object-cover" />
              <p className="mt-3 font-display text-xl">{w.productId?.name}</p>
            </Link>
            <button type="button" className="mt-2 text-[10px] uppercase tracking-widest" onClick={() => removeWishlist(w.productId?._id).then(load)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
