import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { searchProducts } from '../api/products';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [items, setItems] = useState([]);

  useEffect(() => {
    searchProducts({ q, limit: 24 }).then((r) => setItems(r.data.items || []));
  }, [q]);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <p className="eyebrow">Search</p>
      <h1 className="display mt-3 text-5xl">“{q}”</h1>
      <div className="mt-12">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
