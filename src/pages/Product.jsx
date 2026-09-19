import { Check, Heart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addWishlist } from '../api/user';
import { contactSupport } from '../api/cms';
import { createReview, getProduct, productReviews } from '../api/products';
import ProductGrid from '../components/ProductGrid.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import Stars from '../components/Stars.jsx';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { availableQty, imgSrc, inr } from '../lib/format';
import { dietTagLabel, pricePerServing, proteinTypeLabel, variantFlavour } from '../lib/catalog';

const NUTRITION_ROWS = [
  { key: 'servingSizeG', label: 'Serving size', unit: 'g' },
  { key: 'proteinPerServingG', label: 'Protein', unit: 'g' },
  { key: 'calories', label: 'Energy', unit: 'kcal' },
  { key: 'carbsG', label: 'Carbohydrate', unit: 'g' },
  { key: 'sugarG', label: 'of which sugars', unit: 'g' },
  { key: 'fatG', label: 'Fat', unit: 'g' },
  { key: 'bcaaG', label: 'BCAA', unit: 'g' },
  { key: 'eaaG', label: 'EAA', unit: 'g' },
];

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [flavour, setFlavour] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const [reviews, setReviews] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const { add } = useCart();
  const { isAuthed, isCustomer } = useAuth();

  const loadReviews = (id) => productReviews(id).then((rev) => setReviews(rev.data || [])).catch(() => {});

  useEffect(() => {
    getProduct(slug)
      .then((r) => {
        const data = r.data;
        setProduct(data);
        const first = data.variants?.[0];
        setSize(first?.size || '');
        setFlavour(variantFlavour(first));
        setActivePhoto(0);
        loadReviews(data._id);
      })
      .catch(() => setProduct(null));
  }, [slug]);

  const variants = useMemo(() => product?.variants || [], [product]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size).filter(Boolean))], [variants]);
  const flavours = useMemo(() => [...new Set(variants.map(variantFlavour).filter(Boolean))], [variants]);

  const variant = useMemo(
    () =>
      variants.find((v) => v.size === size && variantFlavour(v) === flavour) ||
      variants.find((v) => v.size === size) ||
      variants[0] ||
      null,
    [variants, size, flavour]
  );

  const max = availableQty(variant);
  const related = product?.related || [];

  if (!product) return <div className="px-10 py-32 text-sm text-ink/65">Loading…</div>;

  const chooseSize = (nextSize) => {
    setSize(nextSize);
    const forSize = variants.filter((v) => v.size === nextSize);
    if (!forSize.some((v) => variantFlavour(v) === flavour)) setFlavour(variantFlavour(forSize[0]));
  };

  const chooseFlavour = (nextFlavour) => {
    setFlavour(nextFlavour);
    const forFlavour = variants.filter((v) => variantFlavour(v) === nextFlavour);
    if (!forFlavour.some((v) => v.size === size)) setSize(forFlavour[0]?.size || size);
  };

  const onAdd = async () => {
    setErr('');
    setNotice('');
    try {
      await add({ productId: product._id, variantId: variant._id, qty });
    } catch (e) {
      setErr(e.message);
    }
  };

  const wish = async () => {
    setErr('');
    setNotice('');
    if (!isAuthed) return setErr('Sign in to save favourites');
    try {
      await addWishlist(product._id);
      setNotice('Saved to wishlist');
    } catch (e) {
      setErr(e.message);
    }
  };

  const notifyMe = async (e) => {
    e.preventDefault();
    setErr('');
    setNotice('');
    try {
      await contactSupport({
        name: notifyEmail,
        email: notifyEmail,
        subject: 'Back in stock alert',
        message: `Notify me when ${product.name} (${size} ${flavour}) is back in stock.`,
      });
      setNotifyEmail('');
      setNotice('We will email you when this is back in stock.');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  const nutrition = product.nutrition || {};
  const nutritionRows = NUTRITION_ROWS.filter(({ key }) => typeof nutrition[key] === 'number');
  const perServing = pricePerServing(variant);
  const compare = variant?.compareAtPrice > variant?.price ? variant.compareAtPrice : null;
  const discount = compare ? Math.round((1 - variant.price / compare) * 100) : 0;
  const photos = product.photos?.length ? product.photos : [null];
  const lowStock = max > 0 && max <= (variant?.lowStockThreshold || 5);

  const stats = [
    nutrition.proteinPerServingG ? { value: `${nutrition.proteinPerServingG}g`, label: 'Protein / serving' } : null,
    variant?.servings ? { value: variant.servings, label: 'Servings' } : null,
    typeof nutrition.calories === 'number' ? { value: nutrition.calories, label: 'kcal / serving' } : null,
    perServing ? { value: inr(perServing), label: 'Per serving' } : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-store px-6 py-12 md:px-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="block w-full overflow-hidden bg-frame"
            onClick={() => setZoom(true)}
            aria-label="Zoom image"
          >
            <img src={imgSrc(photos[activePhoto])} alt={product.name} className="aspect-square w-full object-cover" />
          </button>
          {photos.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {photos.map((src, i) => (
                <button
                  key={src || i}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`h-20 w-20 overflow-hidden border-2 bg-frame transition ${
                    i === activePhoto ? 'border-charge' : 'border-transparent hover:border-ink/25'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={imgSrc(src)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-3">
            <p className="eyebrow">{product.brand}</p>
            {product.proteinType && (
              <span className="text-[11px] tracking-[0.1em] uppercase text-ink/65">{proteinTypeLabel(product.proteinType)}</span>
            )}
          </div>
          <h1 className="display mt-3 text-5xl">{product.name}</h1>

          <a href="#reviews" className="mt-4 inline-block">
            <Stars value={product.ratingAvg} count={product.ratingCount ?? reviews.length} />
          </a>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="font-sans text-3xl font-bold tracking-tight">{variant ? inr(variant.price) : ''}</p>
            {compare && <p className="text-sm text-ink/65 line-through">{inr(compare)}</p>}
            {discount > 0 && <span className="badge-sale">{discount}% off</span>}
          </div>
          {perServing && <p className="mt-1 text-xs text-ink/65">{inr(perServing)} per serving</p>}

          <p className="mt-6 text-sm leading-relaxed text-ink/70">{product.description}</p>

          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-6 border-y border-ink/10 py-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="stat">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} type="button" onClick={() => chooseSize(s)} className={`chip ${size === s ? 'chip-on' : ''}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {flavours.length > 0 && (
            <div className="mt-6">
              <p className="eyebrow mb-3">Flavour</p>
              <div className="flex flex-wrap gap-2">
                {flavours.map((f) => {
                  const match = variants.find((v) => variantFlavour(v) === f && v.size === size);
                  const soldOut = match ? availableQty(match) <= 0 : false;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => chooseFlavour(f)}
                      className={`chip ${flavour === f ? 'chip-on' : ''} ${soldOut ? 'line-through opacity-50' : ''}`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {max <= 0 && <p className="badge-stock-out">Out of stock</p>}
            {lowStock && <p className="badge-stock-low">{`Only ${max} left`}</p>}
            {max > 0 && !lowStock && <p className="badge-stock-in">In stock</p>}
            {variant?.sku && <span className="text-[11px] tracking-widest uppercase text-ink/65">{variant.sku}</span>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, max)} />
            <button type="button" className="btn-primary" disabled={max <= 0} onClick={onAdd}>
              Add to cart
            </button>
            <button type="button" onClick={wish} className="btn-ghost" aria-label="Add to wishlist">
              <Heart size={16} />
            </button>
          </div>

          {max <= 0 && (
            <form onSubmit={notifyMe} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="eyebrow">Email me when it is back</span>
                <input
                  required
                  type="email"
                  className="input mt-1"
                  placeholder="you@example.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                />
              </label>
              <button type="submit" className="btn-ghost">
                Notify me
              </button>
            </form>
          )}

          {err && <p className="alert-error mt-4">{err}</p>}
          {notice && <p className="alert-success mt-4">{notice}</p>}

          {(product.dietTags?.length > 0 || product.certifications?.length > 0) && (
            <div className="mt-8 flex flex-wrap gap-2">
              {(product.dietTags || []).map((tag) => (
                <span key={tag} className="rounded-full border border-success/40 px-3 py-1 text-[11px] tracking-[0.14em] uppercase text-success">
                  {dietTagLabel(tag)}
                </span>
              ))}
              {(product.certifications || []).map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 text-[11px] tracking-[0.14em] uppercase text-ink/70">
                  <Check size={12} />
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {nutritionRows.length > 0 && (
              <Panel title="Supplement facts" defaultOpen>
                <table className="w-full text-sm">
                  <tbody>
                    {nutritionRows.map((row) => (
                      <tr key={row.key} className="border-b border-ink/10 last:border-0">
                        <th scope="row" className="py-2 text-left font-normal text-ink/70">
                          {row.label}
                        </th>
                        <td className="py-2 text-right font-semibold tabular-nums">
                          {nutrition[row.key]}
                          {row.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}
            {product.ingredients && <Panel title="Ingredients">{product.ingredients}</Panel>}
            {product.allergens && <Panel title="Allergens">{product.allergens}</Panel>}
            {product.directions && <Panel title="How to use">{product.directions}</Panel>}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink/65">HSN {product.hsn || '—'} · GST {product.taxPercent}%</p>
        </div>
      </div>

      <section id="reviews" className="mt-24 scroll-mt-32">
        <p className="eyebrow">Reviews</p>
        <h2 className="display mt-2 text-3xl">What lifters say</h2>
        <Stars value={product.ratingAvg} count={product.ratingCount ?? reviews.length} className="mt-4" size={18} />
        {isCustomer && (
          <form
            className="mt-8 max-w-lg space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr('');
              setNotice('');
              try {
                await createReview({ productId: product._id, rating: Number(reviewForm.rating), text: reviewForm.text });
                setReviewForm({ rating: 5, text: '' });
                setNotice('Review submitted for moderation');
                loadReviews(product._id);
              } catch (ex) {
                setErr(ex.message);
              }
            }}
          >
            <select className="input" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <textarea className="input min-h-[80px]" placeholder="How did it mix, taste and sit?" value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
            <button className="btn-ghost" type="submit">
              Submit review
            </button>
          </form>
        )}
        <div className="mt-8 space-y-6">
          {!reviews.length && <p className="text-sm text-ink/65">No reviews published yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-ink/10 pb-6">
              <Stars value={r.rating} size={13} />
              <p className="mt-2 text-sm">{r.text}</p>
              {r.reply?.text && <p className="mt-2 text-xs text-ink/65">Team reply: {r.reply.text}</p>}
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow">Stack it with</p>
          <h2 className="display mt-2 mb-10 text-3xl">Related products</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {zoom && (
        <button type="button" className="fixed inset-0 z-[70] bg-ink/80 p-6 md:p-16" onClick={() => setZoom(false)} aria-label="Close image">
          <img src={imgSrc(photos[activePhoto])} alt="" className="mx-auto max-h-full max-w-full object-contain" />
        </button>
      )}
    </div>
  );
}

function Panel({ title, children, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="group py-4">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-medium tracking-[0.12em] uppercase">
        {title}
        <span className="text-ink/65 transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 text-sm leading-relaxed text-ink/70">{children}</div>
    </details>
  );
}
