import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_LABELS = {
  home: "Home",
  about: "About",
  collection: "Collection",
  gifts: "Gift hampers",
  contact: "Contact",
  footer: "Footer",
};

const field =
  "mt-1.5 w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

function SectionEditor({ section, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const meta = section.meta || {};
  const showImage = meta.hasImage !== false || Boolean(section.imageUrl);
  const showCtas = meta.hasCtas === true;
  const isContact = section.page === "contact";
  const isFooter = section.page === "footer";

  function patch(partial) {
    onChange({ ...section, ...partial });
  }

  function patchMeta(partial) {
    onChange({ ...section, meta: { ...meta, ...partial } });
  }

  async function uploadImage(files) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be under 10MB");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
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
      patch({ imageUrl: data.url });
      // Persist immediately so the banner is saved even if "Save changes" is skipped
      const saveRes = await fetch(`/api/page-sections/${section.id}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...section, imageUrl: data.url }),
      });
      if (!saveRes.ok) {
        const saveData = await saveRes.json().catch(() => ({}));
        throw new Error(
          saveData.error ||
            "Image uploaded but not saved. Click Save changes."
        );
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5 border border-ink/10 bg-white p-6">
      <div>
        <h3 className="font-display text-lg">{section.label}</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {PAGE_LABELS[section.page] || section.page} · {section.sectionKey}
        </p>
      </div>

      {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Eyebrow
          </label>
          <input
            className={field}
            value={section.eyebrow || ""}
            onChange={(e) => patch({ eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Title
          </label>
          <input
            className={field}
            value={section.title || ""}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs tracking-wide uppercase text-ink-muted">
          Body
        </label>
        <textarea
          rows={3}
          className={field}
          value={section.body || ""}
          onChange={(e) => patch({ body: e.target.value })}
        />
      </div>

      {(section.bodySecondary !== null && section.bodySecondary !== undefined) ||
      section.page === "about" ? (
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Secondary body
          </label>
          <textarea
            rows={4}
            className={field}
            value={section.bodySecondary || ""}
            onChange={(e) => patch({ bodySecondary: e.target.value })}
          />
        </div>
      ) : null}

      {showImage && (
        <div>
          <label className="text-xs tracking-wide uppercase text-ink-muted">
            Section image / banner
          </label>
          {section.imageUrl ? (
            <div className="group relative mt-2 h-40 max-w-md overflow-hidden bg-paper-dark">
              <img
                src={section.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => patch({ imageUrl: "" })}
                className="absolute inset-0 flex items-center justify-center bg-ink/60 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove image
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">No image uploaded</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadImage(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="border border-ink/20 px-4 py-2 text-xs tracking-wide uppercase"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {section.imageUrl && (
              <input
                className={`${field} mt-0 max-w-sm`}
                value={section.imageUrl}
                onChange={(e) => patch({ imageUrl: e.target.value })}
                placeholder="/uploads/…"
              />
            )}
          </div>
        </div>
      )}

      {showCtas && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Primary CTA label
            </label>
            <input
              className={field}
              value={section.ctaLabel || ""}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Primary CTA link
            </label>
            <input
              className={field}
              value={section.ctaHref || ""}
              onChange={(e) => patch({ ctaHref: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Secondary CTA label
            </label>
            <input
              className={field}
              value={section.ctaSecondaryLabel || ""}
              onChange={(e) => patch({ ctaSecondaryLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Secondary CTA link
            </label>
            <input
              className={field}
              value={section.ctaSecondaryHref || ""}
              onChange={(e) => patch({ ctaSecondaryHref: e.target.value })}
            />
          </div>
        </div>
      )}

      {isContact && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Visit address
            </label>
            <textarea
              rows={2}
              className={field}
              value={meta.visit || ""}
              onChange={(e) => patchMeta({ visit: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Email
            </label>
            <input
              className={field}
              value={meta.email || ""}
              onChange={(e) => patchMeta({ email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Hours
            </label>
            <input
              className={field}
              value={meta.hours || ""}
              onChange={(e) => patchMeta({ hours: e.target.value })}
            />
          </div>
        </div>
      )}

      {isFooter && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Hours label
            </label>
            <input
              className={field}
              value={meta.hoursLabel || ""}
              onChange={(e) => patchMeta({ hoursLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Hours
            </label>
            <input
              className={field}
              value={meta.hours || ""}
              onChange={(e) => patchMeta({ hours: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteContentPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pageFilter, setPageFilter] = useState("home");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/page-sections");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setSections(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pages = [...new Set(sections.map((s) => s.page))];
  const visible = sections.filter((s) => s.page === pageFilter);

  function updateSection(next) {
    setSections((all) => all.map((s) => (s.id === next.id ? next : s)));
    setSaved(false);
  }

  async function saveAll() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/page-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: visible }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSections((all) =>
        all.map((s) => data.find((u) => u.id === s.id) || s)
      );
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading site content…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-tight md:text-3xl">
            Site content
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Upload banners and edit copy for each website section.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={saveAll}
          className="bg-ink px-8 py-3 text-xs tracking-widest uppercase text-paper hover:bg-flame disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-ink-muted">Changes saved.</p>
      )}

      <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => {
              setPageFilter(page);
              setSaved(false);
            }}
            className={
              pageFilter === page
                ? "bg-ink px-4 py-2 text-xs tracking-wide uppercase text-paper"
                : "border border-ink/15 px-4 py-2 text-xs tracking-wide uppercase text-ink-muted hover:text-ink"
            }
          >
            {PAGE_LABELS[page] || page}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {visible.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            onChange={updateSection}
          />
        ))}
      </div>
    </div>
  );
}
