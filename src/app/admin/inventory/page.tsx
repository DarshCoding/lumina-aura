"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/products");
    const data: Product[] = await res.json();
    setProducts(data);
    setDrafts(Object.fromEntries(data.map((p) => [p.id, p.stock])));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(id: string) {
    setSaving(id);
    setMessage("");
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: drafts[id] ?? 0 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setMessage("Stock updated");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Inventory</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Adjust on-hand quantities. Sales deduct stock automatically.
        </p>
      </div>

      {message && <p className="text-sm text-flame">{message}</p>}

      <div className="overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Current</th>
              <th className="px-4 py-3 font-medium">Set stock</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-ink-muted">{p.code}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 10 ? "text-flame" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    className="w-28 border border-ink/15 px-2 py-1.5 outline-none focus:border-ink"
                    value={drafts[p.id] ?? 0}
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [p.id]: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={saving === p.id}
                    onClick={() => save(p.id)}
                    className="text-xs uppercase tracking-wide text-ink-muted hover:text-ink disabled:opacity-50"
                  >
                    {saving === p.id ? "Saving…" : "Update"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
