import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/pricing";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  const cards = [
    { label: "Products", value: String(stats.productCount) },
    { label: "Units in stock", value: String(stats.totalStock) },
    { label: "Low stock", value: String(stats.lowStockCount) },
    { label: "Invoices", value: String(stats.billingCount) },
    { label: "Gift hampers", value: String(stats.hamperCount) },
    { label: "Online sales", value: formatCurrency(stats.onlineSales) },
    { label: "Offline sales", value: formatCurrency(stats.offlineSales) },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Inventory, catalogue, and sales at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="bg-ink px-5 py-2.5 text-xs tracking-widest uppercase text-paper"
          >
            Add product
          </Link>
          <Link
            to="/admin/billings"
            className="border border-ink/20 px-5 py-2.5 text-xs tracking-widest uppercase"
          >
            New billing
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-ink/10 bg-white p-5">
            <p className="text-xs tracking-wide uppercase text-ink-muted">
              {c.label}
            </p>
            <p className="mt-2 font-display text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-ink/10 bg-white p-5">
          <h2 className="font-display text-lg">Recent billings</h2>
          {stats.recentBillings.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">No invoices yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {stats.recentBillings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{b.invoiceNumber}</p>
                    <p className="text-ink-muted">
                      {b.customerName} · {b.channel}
                    </p>
                  </div>
                  <p>{formatCurrency(b.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-ink/10 bg-white p-5">
          <h2 className="font-display text-lg">Low stock</h2>
          {stats.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">All stock levels healthy.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {stats.lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-ink-muted">{p.code}</p>
                  </div>
                  <p className="text-flame">{p.stock} left</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
