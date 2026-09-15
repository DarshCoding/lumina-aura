import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/pricing";

export default function HampersPage() {
  const [hampers, setHampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/hampers");
      if (!res.ok) throw new Error("Failed to load hampers");
      setHampers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-flame">Orders</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Gift hampers
          </h1>
        </div>
        <button
          type="button"
          onClick={load}
          className="text-xs tracking-widest uppercase text-ink-muted hover:text-ink"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-flame-deep">{error}</p>}
      {loading && <p className="mt-10 text-sm text-ink-muted">Loading…</p>}

      {!loading && !hampers.length && (
        <p className="mt-10 text-sm text-ink-muted">
          No custom hampers yet. Orders from /gifts will appear here.
        </p>
      )}

      <div className="mt-10 space-y-4">
        {hampers.map((h) => (
          <article
            key={h.id}
            className="border border-ink/10 bg-paper-warm/40 p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase text-flame">
                  {h.reference} · {h.status}
                </p>
                <h2 className="mt-2 font-display text-xl">{h.customerName}</h2>
                <p className="mt-1 text-sm text-ink-muted">{h.customerEmail}</p>
                {h.customerPhone && (
                  <p className="text-sm text-ink-muted">{h.customerPhone}</p>
                )}
              </div>
              <p className="font-display text-2xl">{formatCurrency(h.total)}</p>
            </div>

            <dl className="mt-6 grid gap-3 border-t border-ink/10 pt-6 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-ink-muted">Candle</dt>
                <dd className="sm:mt-1">
                  {h.candle.label} · {formatCurrency(h.candle.price)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-ink-muted">Fragrance</dt>
                <dd className="sm:mt-1">
                  {h.fragrance.label}
                  {h.fragrance.price > 0
                    ? ` · ${formatCurrency(h.fragrance.price)}`
                    : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-ink-muted">Color</dt>
                <dd className="sm:mt-1">
                  {h.color.label}
                  {h.color.price > 0 ? ` · ${formatCurrency(h.color.price)}` : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-ink-muted">Flowers</dt>
                <dd className="sm:mt-1">
                  {h.flower.label}
                  {h.flower.price > 0
                    ? ` · ${formatCurrency(h.flower.price)}`
                    : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-ink-muted">Packaging</dt>
                <dd className="sm:mt-1">
                  {formatCurrency(h.packagingFee)}
                  {h.logoFee > 0
                    ? ` + logo ${formatCurrency(h.logoFee)}`
                    : ""}
                </dd>
              </div>
              {h.logoUrl && (
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-ink-muted">Logo</dt>
                  <dd className="sm:mt-1">
                    <a
                      href={h.logoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      View upload
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {h.notes && (
              <p className="mt-4 text-sm text-ink-muted">Note: {h.notes}</p>
            )}
            <p className="mt-4 text-xs text-ink-muted">
              {new Date(h.createdAt).toLocaleString("en-IN")}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
