import { useEffect, useState } from "react";
import { HamperBuilder } from "@/components/HamperBuilder";
import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const fallback = {
  eyebrow: "Lummina Aura",
  title: "Custom gift hamper",
  body: "Compose a candle, fragrance, color, and flowers — then add your logo to the packaging. Pricing updates as you build.",
  imageUrl: "",
};

export default function GiftsPage() {
  const [products, setProducts] = useState([]);
  const { sections } = usePageSections("gifts");
  const hero = sectionOr(fallback, sections.hero);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="relative overflow-hidden border-b border-ink/5 bg-gradient-to-br from-paper-warm via-paper to-paper-dark/40">
        {hero.imageUrl ? (
          <>
            <img
              src={hero.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-paper/70" />
          </>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(184,137,74,0.18), transparent 45%), radial-gradient(circle at 85% 70%, rgba(168,181,160,0.2), transparent 40%)",
            }}
          />
        )}
        <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          {hero.eyebrow && (
            <p
              className="text-xs tracking-widest uppercase text-flame opacity-0 animate-fade-up"
              style={{ animationFillMode: "forwards" }}
            >
              {hero.eyebrow}
            </p>
          )}
          <h1
            className="mt-4 max-w-2xl font-display text-4xl tracking-tight opacity-0 animate-fade-up md:text-6xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            {hero.title}
          </h1>
          {hero.body && (
            <p
              className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted opacity-0 animate-fade-up md:text-lg"
              style={{
                animationDelay: "200ms",
                animationFillMode: "forwards",
              }}
            >
              {hero.body}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-16 md:px-10 md:pt-24">
        <HamperBuilder candles={products} />
      </div>
    </div>
  );
}
