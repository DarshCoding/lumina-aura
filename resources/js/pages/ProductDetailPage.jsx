import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "@/lib/pricing";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-sm text-ink-muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="font-display text-2xl">Product not found</p>
          <Link
            to="/collection"
            className="mt-4 inline-block text-sm text-ink-muted hover:text-ink"
          >
            ← Back to collection
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPercent > 0;

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-paper-dark">
            <img
              src={product.images[0]}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1).map((src) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden bg-paper-dark"
                >
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-32 md:self-start">
          <Link
            to="/collection"
            className="text-xs tracking-widest uppercase text-ink-muted hover:text-ink"
          >
            ← Collection
          </Link>
          <p className="mt-8 text-xs tracking-widest uppercase text-flame">
            {product.category} · {product.code}
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            {product.title}
          </h1>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-2xl">
              {formatCurrency(product.discountPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-ink-muted line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm text-flame">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-8 max-w-md leading-relaxed text-ink-muted">
            {product.description}
          </p>
          <dl className="mt-10 space-y-3 border-t border-ink/10 pt-8 text-sm">
            {product.scent && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Scent</dt>
                <dd>{product.scent}</dd>
              </div>
            )}
            {product.burnTime && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Burn time</dt>
                <dd>{product.burnTime}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Availability</dt>
              <dd>{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</dd>
            </div>
          </dl>
          <p className="mt-10 text-sm text-ink-muted">
            Purchase in-studio or request online fulfilment via{" "}
            <Link to="/contact" className="underline underline-offset-4">
              contact
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
