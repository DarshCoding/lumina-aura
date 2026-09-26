import { useRef, useState } from "react";
import { calcFromDiscountPrice, calcFromPercent } from "@/lib/pricing";

const empty = {
  title: "",
  description: "",
  code: "",
  images: [],
  price: 0,
  discountPercent: 0,
  discountPrice: 0,
  stock: 0,
  category: "Signature",
  scent: "",
  burnTime: "",
  featured: false,
};

export function ProductForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          code: initial.code,
          images: initial.images,
          price: initial.price,
          discountPercent: initial.discountPercent,
          discountPrice: initial.discountPrice,
          stock: initial.stock,
          category: initial.category,
          scent: initial.scent || "",
          burnTime: initial.burnTime || "",
          featured: initial.featured,
        }
      : empty
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function setPrice(value) {
    const { discountPercent, discountPrice } = calcFromPercent(
      value,
      form.discountPercent
    );
    setForm((f) => ({ ...f, price: value, discountPercent, discountPrice }));
  }

  function setDiscountPercent(value) {
    const { discountPercent, discountPrice } = calcFromPercent(
      form.price,
      value
    );
    setForm((f) => ({ ...f, discountPercent, discountPrice }));
  }

  function setDiscountPrice(value) {
    const { discountPercent, discountPrice } = calcFromDiscountPrice(
      form.price,
      value
    );
    setForm((f) => ({ ...f, discountPercent, discountPrice }));
  }

  async function uploadFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} must be under 10MB`);
        }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "same-origin",
        });
        let data = {};
        try {
          data = await res.json();
        } catch {
          throw new Error(
            res.status === 413
              ? "Image is too large for the server"
              : "Upload failed"
          );
        }
        if (!res.ok) throw new Error(data.error || "Upload failed");
        if (!data.url) throw new Error("Upload failed");
        urls.push(data.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/products/${initial.id}` : "/api/products";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "mt-1.5 w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

  return (
    <form onSubmit={submit} className="space-y-6 border border-ink/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">
          {initial ? "Edit product" : "New product"}
        </h2>
        <button type="button" onClick={onCancel} className="text-sm text-ink-muted">
          Cancel
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Title
          </label>
          <input
            required
            className={field}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Code
          </label>
          <input
            required
            className={field}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs tracking-wide uppercase text-ink-muted">
          Description
        </label>
        <textarea
          rows={4}
          className={field}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Price
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            className={field}
            value={form.price || ""}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Discount %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            className={field}
            value={form.discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
          />
          <p className="mt-1 text-[11px] text-ink-muted">
            Auto-calculates discount price
          </p>
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Discount price
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            className={field}
            value={form.discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value) || 0)}
          />
          <p className="mt-1 text-[11px] text-ink-muted">
            Auto-calculates discount %
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Stock
          </label>
          <input
            type="number"
            min={0}
            className={field}
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Category
          </label>
          <input
            className={field}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Scent
          </label>
          <input
            className={field}
            value={form.scent}
            onChange={(e) => setForm({ ...form, scent: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Burn time
          </label>
          <input
            className={field}
            value={form.burnTime}
            onChange={(e) => setForm({ ...form, burnTime: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs tracking-wide uppercase text-ink-muted">
          Images
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((src) => (
            <div key={src} className="group relative h-24 w-24 overflow-hidden bg-paper-dark">
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    images: f.images.filter((i) => i !== src),
                  }))
                }
                className="absolute inset-0 flex items-center justify-center bg-ink/60 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="border border-ink/20 px-4 py-2 text-xs tracking-wide uppercase"
          >
            {uploading ? "Uploading…" : "Upload images"}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        Featured on homepage
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-ink px-8 py-3 text-xs tracking-widest uppercase text-paper hover:bg-flame disabled:opacity-50"
      >
        {saving ? "Saving…" : initial ? "Update product" : "Add product"}
      </button>
    </form>
  );
}
