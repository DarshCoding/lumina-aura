import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const fallback = {
  eyebrow: "Portfolio",
  title: "Collection",
  body: "A quiet grid of hand-poured candles — hover to linger, click to explore.",
};

export default function CollectionPage() {
  const [products, setProducts] = useState([]);
  const { sections } = usePageSections("collection");
  const intro = sectionOr(fallback, sections.intro);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {intro.eyebrow && (
          <p className="text-xs tracking-widest uppercase text-flame">
            {intro.eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
          {intro.title}
        </h1>
        {intro.body && (
          <p className="mt-4 max-w-md text-ink-muted">{intro.body}</p>
        )}

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
