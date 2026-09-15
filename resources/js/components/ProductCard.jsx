import { Link } from "react-router-dom";
import { useState } from "react";
import { formatCurrency } from "@/lib/pricing";

export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const img = product.images[0] || "/images/candle-1.svg";
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link
      to={`/collection/${product.id}`}
      className="group relative block opacity-0 animate-fade-up"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-dark">
        <img
          src={img}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-ink/0 transition-colors duration-500 ${
            hovered ? "bg-ink/20" : ""
          }`}
        />
        {hasDiscount && (
          <span className="absolute left-4 top-4 text-[11px] tracking-widest uppercase text-paper">
            −{product.discountPercent}%
          </span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg tracking-tight text-ink">
            {product.title}
          </p>
          <p className="mt-1 text-xs tracking-wide text-ink-muted">
            {product.category}
            {product.scent ? ` · ${product.scent}` : ""}
          </p>
        </div>
        <div className="text-right text-sm">
          {hasDiscount ? (
            <>
              <p className="text-ink">{formatCurrency(product.discountPrice)}</p>
              <p className="text-ink-muted line-through">
                {formatCurrency(product.price)}
              </p>
            </>
          ) : (
            <p className="text-ink">{formatCurrency(product.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
