import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return <p className="py-20 text-center text-sm text-ink/65">No products match these filters.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p._id || p.slug} product={p} index={i} />
      ))}
    </div>
  );
}
