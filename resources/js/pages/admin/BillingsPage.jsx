import { useCallback, useEffect, useMemo, useState } from "react";
import { formatCurrency, roundMoney } from "@/lib/pricing";

export default function BillingsPage() {
  const [products, setProducts] = useState([]);
  const [billings, setBillings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [channel, setChannel] = useState("offline");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [pRes, bRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/billings"),
    ]);
    setProducts(await pRes.json());
    if (bRes.ok) setBillings(await bRes.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const preview = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;
    for (const line of lines) {
      const p = products.find((x) => x.id === line.productId);
      if (!p || !line.quantity) continue;
      const list = p.price * line.quantity;
      const sale = p.discountPrice * line.quantity;
      subtotal += list;
      discountTotal += list - sale;
    }
    return {
      subtotal: roundMoney(subtotal),
      discountTotal: roundMoney(discountTotal),
      total: roundMoney(subtotal - discountTotal),
    };
  }, [lines, products]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const items = lines.filter((l) => l.productId && l.quantity > 0);
      const res = await fetch("/api/billings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          notes: notes || undefined,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setShowForm(false);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setNotes("");
      setLines([{ productId: "", quantity: 1 }]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "mt-1.5 w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Billings</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Create invoices for online and offline sales. Stock updates on save.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-ink px-5 py-2.5 text-xs tracking-widest uppercase text-paper"
        >
          {showForm ? "Close form" : "New billing"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="space-y-6 border border-ink/10 bg-white p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-muted">
                Channel
              </label>
              <div className="mt-2 flex gap-2">
                {["offline", "online"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={`px-4 py-2 text-xs uppercase tracking-wide ${
                      channel === c
                        ? "bg-ink text-paper"
                        : "border border-ink/15 text-ink-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-muted">
                Customer name
              </label>
              <input
                required
                className={field}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-muted">
                Email
              </label>
              <input
                type="email"
                className={field}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-muted">
                Phone
              </label>
              <input
                className={field}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              Line items
            </p>
            {lines.map((line, idx) => (
              <div key={idx} className="flex flex-wrap gap-3">
                <select
                  required
                  className={`${field} mt-0 min-w-[220px] flex-1`}
                  value={line.productId}
                  onChange={(e) => {
                    const next = [...lines];
                    next[idx] = { ...next[idx], productId: e.target.value };
                    setLines(next);
                  }}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.code}) — stock {p.stock}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-24 border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-ink"
                  value={line.quantity}
                  onChange={(e) => {
                    const next = [...lines];
                    next[idx] = {
                      ...next[idx],
                      quantity: Number(e.target.value) || 1,
                    };
                    setLines(next);
                  }}
                />
                {lines.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-ink-muted"
                    onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-xs uppercase tracking-wide text-flame"
              onClick={() =>
                setLines([...lines, { productId: "", quantity: 1 }])
              }
            >
              + Add line
            </button>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-muted">
              Notes
            </label>
            <textarea
              rows={2}
              className={field}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span>{formatCurrency(preview.subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-ink-muted">Discount</span>
              <span>−{formatCurrency(preview.discountTotal)}</span>
            </div>
            <div className="mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(preview.total)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-ink px-8 py-3 text-xs tracking-widest uppercase text-paper hover:bg-flame disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create invoice"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {billings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-ink-muted">
                  No billings yet. Create an online or offline sale.
                </td>
              </tr>
            ) : (
              billings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-medium">{b.invoiceNumber}</td>
                  <td className="px-4 py-3 capitalize">{b.channel}</td>
                  <td className="px-4 py-3">
                    <p>{b.customerName}</p>
                    {b.customerEmail && (
                      <p className="text-xs text-ink-muted">{b.customerEmail}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {b.items.map((i) => `${i.productTitle} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(b.total)}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Date(b.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
