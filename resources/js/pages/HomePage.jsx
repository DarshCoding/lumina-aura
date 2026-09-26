import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const defaults = {
  hero: {
    eyebrow: "Lummina Aura",
    title: "Light, pared back.",
    body: "Hand-poured candles for quiet rooms — scent, vessel, and burn designed as one composition.",
    imageUrl: "/images/hero.svg",
    ctaLabel: "View collection",
    ctaHref: "/collection",
    ctaSecondaryLabel: "Our atelier",
    ctaSecondaryHref: "/about",
  },
  featured: {
    eyebrow: "Selected works",
    title: "Featured candles",
    ctaLabel: "Browse all",
    ctaHref: "/collection",
  },
  atelier: {
    title: "Made slowly.\nMeant to linger.",
    body: "Each pour begins with soy wax, cotton wick, and a fragrance composition balanced for clean burn and lasting presence.",
    imageUrl: "/images/atelier.svg",
  },
  hamper_promo: {
    eyebrow: "Lummina Aura",
    title: "Custom gift hampers",
    body: "Compose candle, fragrance, color, and flowers — with optional logo packaging and live pricing.",
    ctaLabel: "Build a hamper",
    ctaHref: "/gifts",
  },
  collection_teaser: {
    title: "The collection",
    body: "Six signature profiles — from soft linen mornings to deep cocoa nights.",
    ctaLabel: "See full portfolio",
    ctaHref: "/collection",
  },
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { sections } = usePageSections("home");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const hero = sectionOr(defaults.hero, sections.hero);
  const featuredCopy = sectionOr(defaults.featured, sections.featured);
  const atelier = sectionOr(defaults.atelier, sections.atelier);
  const hamper = sectionOr(defaults.hamper_promo, sections.hamper_promo);
  const collection = sectionOr(
    defaults.collection_teaser,
    sections.collection_teaser
  );

  const heroImage =
    hero.imageUrl || featured[0]?.images?.[0] || "/images/hero.svg";
  const atelierTitleLines = (atelier.title || "").split("\n");

  return (
    <>
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Lummina Aura candle"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28">
          <div className="mx-auto w-full max-w-[1400px]">
            {hero.eyebrow && (
              <p className="font-display text-xs tracking-brand uppercase text-paper/80 opacity-0 animate-fade-up">
                {hero.eyebrow}
              </p>
            )}
            <h1
              className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-paper opacity-0 animate-fade-up md:text-7xl lg:text-8xl"
              style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
            >
              {hero.title}
            </h1>
            {hero.body && (
              <p
                className="mt-6 max-w-md text-base leading-relaxed text-paper/75 opacity-0 animate-fade-up md:text-lg"
                style={{
                  animationDelay: "220ms",
                  animationFillMode: "forwards",
                }}
              >
                {hero.body}
              </p>
            )}
            <div
              className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
            >
              {hero.ctaLabel && (
                <Link
                  to={hero.ctaHref || "/collection"}
                  className="bg-paper px-8 py-3.5 text-xs tracking-widest uppercase text-ink transition-colors hover:bg-flame hover:text-paper"
                >
                  {hero.ctaLabel}
                </Link>
              )}
              {hero.ctaSecondaryLabel && (
                <Link
                  to={hero.ctaSecondaryHref || "/about"}
                  className="border border-paper/40 px-8 py-3.5 text-xs tracking-widest uppercase text-paper transition-colors hover:border-paper hover:bg-paper/10"
                >
                  {hero.ctaSecondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {featuredCopy.eyebrow && (
              <p className="text-xs tracking-widest uppercase text-flame">
                {featuredCopy.eyebrow}
              </p>
            )}
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              {featuredCopy.title}
            </h2>
          </div>
          {featuredCopy.ctaLabel && (
            <Link
              to={featuredCopy.ctaHref || "/collection"}
              className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {featuredCopy.ctaLabel}
            </Link>
          )}
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src={atelier.imageUrl || "/images/atelier.svg"}
          alt="Candle atelier atmosphere"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 flex min-h-[70vh] items-center px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="max-w-2xl font-display text-4xl font-medium leading-tight text-paper md:text-6xl">
              {atelierTitleLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            {atelier.body && (
              <p className="mt-6 max-w-md text-paper/70">{atelier.body}</p>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/5 bg-paper-warm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-10 md:py-28">
          <div className="max-w-xl">
            {hamper.eyebrow && (
              <p className="text-xs tracking-widest uppercase text-flame">
                {hamper.eyebrow}
              </p>
            )}
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              {hamper.title}
            </h2>
            {hamper.body && (
              <p className="mt-4 text-ink-muted">{hamper.body}</p>
            )}
          </div>
          {hamper.ctaLabel && (
            <Link
              to={hamper.ctaHref || "/gifts"}
              className="inline-block shrink-0 bg-ink px-10 py-4 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame"
            >
              {hamper.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl">
          {collection.title}
        </h2>
        {collection.body && (
          <p className="mt-4 max-w-lg text-ink-muted">{collection.body}</p>
        )}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {collection.ctaLabel && (
          <div className="mt-16 text-center">
            <Link
              to={collection.ctaHref || "/collection"}
              className="inline-block border border-ink px-10 py-4 text-xs tracking-widest uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              {collection.ctaLabel}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
