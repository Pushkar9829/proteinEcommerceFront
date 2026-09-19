export function inr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

export function lowestPrice(product) {
  const variants = product?.variants || [];
  if (!variants.length) return null;
  return Math.min(...variants.map((v) => v.price));
}

export function pricing(product) {
  const variants = product?.variants || [];
  if (!variants.length) return { price: null, compare: null, from: false, variant: null };
  const variant = variants.slice().sort((a, b) => a.price - b.price)[0];
  const prices = [...new Set(variants.map((v) => v.price))];
  const compare = variant.compareAtPrice > variant.price ? variant.compareAtPrice : null;
  return {
    price: variant.price,
    compare,
    from: prices.length > 1,
    variant,
  };
}

export function availableQty(variant) {
  if (!variant) return 0;
  if (typeof variant.available === 'number') return variant.available;
  return Math.max(0, (variant.stock || 0) - (variant.reserved || 0));
}

export function firstBuyable(product) {
  return (product?.variants || []).find((v) => availableQty(v) > 0) || null;
}

export function cmsHref(url) {
  if (!url) return '/';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/collections/')) return url.replace('/collections/', '/c/');
  return url;
}

export function imgSrc(url) {
  if (!url) return 'https://images.unsplash.com/photo-1579722820308-d74e643f23c8?auto=format&fit=crop&w=1200&q=80';
  return url;
}

export function downloadText(filename, text) {
  const blob = new Blob([String(text || '')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
