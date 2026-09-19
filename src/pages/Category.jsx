import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { getCategory, searchProducts } from '../api/products';
import { imgSrc } from '../lib/format';

export default function Category() {
  const { slug } = useParams();
  const [cat, setCat] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getCategory(slug).then((r) => {
      setCat(r.data);
      return searchProducts({ categoryId: r.data._id, limit: 24 });
    }).then((r) => setItems(r.data.items || [])).catch(() => setCat(null));
  }, [slug]);

  if (!cat) return <div className="px-10 py-32 text-sm text-ink/65">Loading…</div>;

  return (
    <div>
      <section className="relative h-[42vh] min-h-[280px] overflow-hidden bg-ink">
        <img src={imgSrc(cat.image)} alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80" />
        <div className="absolute bottom-10 left-6 md:left-10">
          <p className="eyebrow text-chargeLight">Collection</p>
          <h1 className="display mt-2 text-5xl text-paper">{cat.name}</h1>
        </div>
      </section>
      <div className="mx-auto max-w-store px-6 py-16 md:px-10">
        {cat.description && <p className="mb-12 max-w-xl text-sm text-ink/65">{cat.description}</p>}
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
