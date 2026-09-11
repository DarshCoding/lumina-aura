import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/pricing";
import { getProduct } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const hasDiscount = product.discountPercent > 0;

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-paper-dark">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1).map((src) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden bg-paper-dark"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-32 md:self-start">
          <Link
            href="/collection"
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
            <Link href="/contact" className="underline underline-offset-4">
              contact
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
