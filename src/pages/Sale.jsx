import { useEffect, useState } from 'react';
import Countdown from '../components/Countdown.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useHome } from '../context/HomeContext';
import { searchProducts } from '../api/products';

export default function Sale() {
  const { home } = useHome();
  const [items, setItems] = useState([]);
  const sale = home?.flashSale;

  useEffect(() => {
    searchProducts({ limit: 24 }).then((r) => {
      const all = r.data.items || [];
      setItems(all.filter((p) => p.saleBadge || (sale?.productIds || []).some((id) => String(id) === String(p._id))));
    });
  }, [sale]);

  return (
    <div>
      <section className="bg-ink px-6 py-24 text-paper md:px-10">
        <div className="mx-auto max-w-store">
          <p className="eyebrow text-chargeLight">Limited time</p>
          <h1 className="display mt-3 text-6xl">{sale?.title || 'Season sale'}</h1>
          {sale?.endsAt && (
            <div className="mt-8">
              <Countdown endsAt={sale.endsAt} />
            </div>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-store px-6 py-16 md:px-10">
        <ProductGrid products={items.length ? items : sale?.products || []} />
      </div>
    </div>
  );
}
