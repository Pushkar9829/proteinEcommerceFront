import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import FadeIn from '../components/FadeIn.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import Newsletter from '../components/Newsletter.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Testimonials from '../components/Testimonials.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import { useHome } from '../context/HomeContext';
import { cmsHref, imgSrc } from '../lib/format';

const ease = [0.22, 1, 0.36, 1];

export default function Home() {
  const { home, loading, refresh } = useHome();
  useEffect(() => {
    if (!loading) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !home) {
    return (
      <div>
        <Skeleton className="h-[88vh]" />
        <div className="mx-auto grid max-w-store grid-cols-2 gap-6 px-6 py-16 md:grid-cols-3">
          <Skeleton className="aspect-[4/5]" />
          <Skeleton className="aspect-[4/5]" />
          <Skeleton className="hidden aspect-[4/5] md:block" />
        </div>
      </div>
    );
  }

  const collections = (home.featuredCollections || []).length
    ? home.featuredCollections
    : (home.homeSections || []).filter((s) => s.config?.kind === 'collection');

  return (
    <div>
      <HeroSlider banners={home.banners} />

      <section className="mx-auto max-w-store px-6 py-24 md:px-10">
        <FadeIn>
          <p className="eyebrow">Goals</p>
          <h2 className="display mt-3 text-4xl md:text-5xl">Shop by goal</h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {(home.categories || []).map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              whileHover={{ y: -8 }}
            >
              <Link to={`/c/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-frame">
                <img src={imgSrc(c.image)} alt={c.name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition duration-500 group-hover:from-ink/70" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-display text-3xl text-paper">{c.name}</p>
                  <span className="mt-2 inline-block translate-x-0 text-[10px] tracking-[0.12em] uppercase text-chargeLight transition duration-500 group-hover:translate-x-1">
                    Explore
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {collections.length > 0 && (
        <section className="bg-haze px-6 py-24 md:px-10">
          <div className="mx-auto max-w-store">
            <FadeIn>
              <p className="eyebrow">Collections</p>
              <h2 className="display mt-3 text-4xl">Featured collections</h2>
            </FadeIn>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {collections.map((col, i) => (
                <motion.div
                  key={col._id || col.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease }}
                >
                  <Link
                    to={cmsHref(col.ctaUrl || (col.config?.categorySlug ? `/c/${col.config.categorySlug}` : '/products'))}
                    className="group relative block aspect-[5/4] overflow-hidden bg-frame md:aspect-[16/10]"
                  >
                    {col.image && (
                      <img src={imgSrc(col.image)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-ink/45 transition duration-500 group-hover:bg-ink/35" />
                    <div className="relative z-10 flex h-full flex-col justify-end p-8 text-paper md:p-10">
                      <h3 className="font-display text-4xl">{col.title}</h3>
                      {col.body && <p className="mt-2 max-w-sm text-sm text-paper/75">{col.body}</p>}
                      <span className="mt-4 text-[11px] tracking-[0.12em] uppercase text-chargeLight">{col.ctaLabel || 'Shop now'}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {home.flashSale && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-ink px-6 py-20 text-paper md:px-10"
        >
          <div className="mx-auto flex max-w-store flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Limited time</p>
              <h2 className="display mt-3 text-5xl">{home.flashSale.title}</h2>
              <Link to="/sale" className="mt-6 inline-block text-[11px] tracking-[0.12em] uppercase text-chargeLight transition hover:text-paper">
                Shop the sale
              </Link>
            </div>
            <Countdown endsAt={home.flashSale.endsAt} />
          </div>
        </motion.section>
      )}

      <section className="mx-auto max-w-store px-6 py-24 md:px-10">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="display mt-3 text-4xl">Training staples this week</h2>
            </div>
            <Link to="/products" className="hidden text-[11px] tracking-[0.12em] uppercase text-chargeDeep transition hover:text-ink md:inline">
              All products
            </Link>
          </div>
        </FadeIn>
        <div className="mt-12">
          <ProductGrid products={home.featuredProducts} />
        </div>
      </section>

      {(home.ritualSteps || []).length > 0 && (
        <section className="border-y border-ink/10 px-6 py-24 md:px-10">
          <div className="mx-auto max-w-store">
            <FadeIn>
              <p className="eyebrow">How to use it</p>
              <h2 className="display mt-3 text-4xl">Fit it into your day</h2>
            </FadeIn>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {home.ritualSteps.map((step, i) => (
                <motion.div
                  key={step._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.65, ease }}
                  className="border-t border-chargeLight/40 pt-8"
                >
                  <p className="font-display text-2xl">{step.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustStrip badges={home.trustBadges} />
      <Testimonials items={home.testimonials} />

      <section className="mx-auto max-w-store px-6 py-24 md:px-10">
        <FadeIn>
          <p className="eyebrow">Just arrived</p>
          <h2 className="display mt-3 text-4xl">New arrivals</h2>
        </FadeIn>
        <div className="mt-12">
          <ProductGrid products={home.newProducts} />
        </div>
      </section>

      {home.story && (
        <section className="relative overflow-hidden bg-ink text-paper">
          {home.story.image && (
            <motion.img
              src={imgSrc(home.story.image)}
              alt=""
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease }}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <FadeIn className="relative mx-auto max-w-2xl px-6 py-28 md:px-10">
            <p className="eyebrow text-chargeLight">Our standard</p>
            <h2 className="display mt-4 text-5xl">{home.story.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-paper/75">{home.story.body}</p>
            <Link
              to={home.story.ctaUrl ? cmsHref(home.story.ctaUrl) : '/pages/about'}
              className="mt-8 inline-block text-[11px] tracking-[0.12em] uppercase text-chargeLight transition hover:text-paper"
            >
              {home.story.ctaLabel || 'Read more'}
            </Link>
          </FadeIn>
        </section>
      )}

      {home.blogs?.length > 0 && (
        <section className="border-t border-ink/10 bg-haze px-6 py-24 md:px-10">
          <div className="mx-auto max-w-store">
            <FadeIn>
              <p className="eyebrow">Guides</p>
              <h2 className="display mt-3 text-4xl">Training and nutrition guides</h2>
            </FadeIn>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {home.blogs.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease }}
                >
                  <Link to={`/blog/${b.slug}`} className="group block border-t border-ink/10 pt-6">
                    <p className="text-[11px] tracking-[0.12em] uppercase text-chargeDeep">Guide</p>
                    <h3 className="mt-2 font-display text-3xl transition group-hover:text-chargeDeep">{b.title}</h3>
                    <p className="mt-3 text-sm text-ink/65">{b.excerpt || b.seoDescription}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter block={home.newsletter} />
    </div>
  );
}
