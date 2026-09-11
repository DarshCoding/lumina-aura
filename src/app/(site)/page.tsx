import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const heroImage = featured[0]?.images[0] || "/images/hero.svg";

  return (
    <>
      {/* Full-bleed hero — brand first, minimal portfolio */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="Lummina Aura candle"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28">
          <div className="mx-auto w-full max-w-[1400px]">
            <p className="font-display text-xs tracking-brand uppercase text-paper/80 opacity-0 animate-fade-up">
              Lummina Aura
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-paper opacity-0 animate-fade-up md:text-7xl lg:text-8xl"
              style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
            >
              Light, pared back.
            </h1>
            <p
              className="mt-6 max-w-md text-base leading-relaxed text-paper/75 opacity-0 animate-fade-up md:text-lg"
              style={{ animationDelay: "220ms", animationFillMode: "forwards" }}
            >
              Hand-poured candles for quiet rooms — scent, vessel, and burn
              designed as one composition.
            </p>
            <div
              className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
            >
              <Link
                href="/collection"
                className="bg-paper px-8 py-3.5 text-xs tracking-widest uppercase text-ink transition-colors hover:bg-flame hover:text-paper"
              >
                View collection
              </Link>
              <Link
                href="/about"
                className="border border-paper/40 px-8 py-3.5 text-xs tracking-widest uppercase text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                Our atelier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured portfolio grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-flame">
              Selected works
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              Featured candles
            </h2>
          </div>
          <Link
            href="/collection"
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Browse all
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Atmosphere band */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="/images/atelier.svg"
          alt="Candle atelier atmosphere"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 flex min-h-[70vh] items-center px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="max-w-2xl font-display text-4xl font-medium leading-tight text-paper md:text-6xl">
              Made slowly.
              <br />
              Meant to linger.
            </h2>
            <p className="mt-6 max-w-md text-paper/70">
              Each pour begins with soy wax, cotton wick, and a fragrance
              composition balanced for clean burn and lasting presence.
            </p>
          </div>
        </div>
      </section>

      {/* Custom gift hampers */}
      <section className="border-y border-ink/5 bg-paper-warm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-10 md:py-28">
          <div className="max-w-xl">
            <p className="text-xs tracking-widest uppercase text-flame">
              Lummina Aura
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              Custom gift hampers
            </h2>
            <p className="mt-4 text-ink-muted">
              Compose candle, fragrance, color, and flowers — with optional logo
              packaging and live pricing.
            </p>
          </div>
          <Link
            href="/gifts"
            className="inline-block shrink-0 bg-ink px-10 py-4 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame"
          >
            Build a hamper
          </Link>
        </div>
      </section>

      {/* Full collection teaser */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl">
          The collection
        </h2>
        <p className="mt-4 max-w-lg text-ink-muted">
          Six signature profiles — from soft linen mornings to deep cocoa
          nights.
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/collection"
            className="inline-block border border-ink px-10 py-4 text-xs tracking-widest uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            See full portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
