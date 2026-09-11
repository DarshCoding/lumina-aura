"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { formatCurrency } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  if (mode === "create") {
    return (
      <ProductForm
        onCancel={() => setMode("list")}
        onSaved={() => {
          setMode("list");
          load();
        }}
      />
    );
  }

  if (mode === "edit" && editing) {
    return (
      <ProductForm
        initial={editing}
        onCancel={() => {
          setMode("list");
          setEditing(null);
        }}
        onSaved={() => {
          setMode("list");
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Title, description, code, images, pricing & discounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode("create")}
          className="bg-ink px-5 py-2.5 text-xs tracking-widest uppercase text-paper"
        >
          Add product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-paper-dark">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-ink-muted">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{p.code}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.discountPercent > 0 ? (
                      <span>
                        {p.discountPercent}% → {formatCurrency(p.discountPrice)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="mr-3 text-xs uppercase tracking-wide text-ink-muted hover:text-ink"
                      onClick={() => {
                        setEditing(p);
                        setMode("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs uppercase tracking-wide text-red-700/80 hover:text-red-700"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
