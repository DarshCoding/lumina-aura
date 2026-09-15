import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { calculateHamperPrice } from "@/lib/hamper";
import { cn, formatCurrency } from "@/lib/pricing";

const emptyCatalog = {
  fragrances: [],
  colors: [],
  flowers: [],
  packagingFee: 0,
  logoFee: 0,
};

export function HamperBuilder({ candles }) {
  const available = candles.filter((c) => c.stock > 0);
  const [catalog, setCatalog] = useState(emptyCatalog);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const [candleId, setCandleId] = useState(available[0]?.id ?? "");
  const [fragranceId, setFragranceId] = useState("");
  const [colorId, setColorId] = useState("");
  const [flowerId, setFlowerId] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [step, setStep] = useState("build");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    fetch("/api/hamper-options")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load hamper options");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const next = {
          fragrances: data.fragrances ?? [],
          colors: data.colors ?? [],
          flowers: data.flowers ?? [],
          packagingFee: Number(data.packagingFee) || 0,
          logoFee: Number(data.logoFee) || 0,
        };
        setCatalog(next);
        setFragranceId((id) => id || next.fragrances[0]?.id || "");
        setColorId((id) => id || next.colors[0]?.id || "");
        setFlowerId((id) => id || next.flowers[0]?.id || "");
        setCatalogError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setCatalog(emptyCatalog);
        setCatalogError(err instanceof Error ? err.message : "Failed to load options");
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!candleId && available[0]?.id) {
      setCandleId(available[0].id);
    }
  }, [available, candleId]);

  const selectedCandle = available.find((c) => c.id === candleId);

  const breakdown = useMemo(() => {
    return calculateHamperPrice({
      candlePrice: selectedCandle?.discountPrice ?? 0,
      fragranceId,
      colorId,
      flowerId,
      hasLogo: Boolean(logoUrl),
      fragrances: catalog.fragrances,
      colors: catalog.colors,
      flowers: catalog.flowers,
      packagingFee: catalog.packagingFee,
      logoFee: catalog.logoFee,
    });
  }, [selectedCandle, fragranceId, colorId, flowerId, logoUrl, catalog]);

  async function onLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/hampers/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setLogoUrl(data.url);
      setLogoName(file.name);
    } catch (err) {
      setLogoUrl(null);
      setLogoName("");
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function clearLogo() {
    setLogoUrl(null);
    setLogoName("");
    setUploadError("");
  }

  async function submitOrder(e) {
    e.preventDefault();
    if (!candleId) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/hampers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          candleProductId: candleId,
          fragranceId,
          colorId,
          flowerId,
          logoUrl: logoUrl || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reserve hamper");
      setReference(data.reference);
      setStep("done");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-xl border border-ink/10 bg-gradient-to-b from-paper-warm to-paper p-10 text-center md:p-14">
        <p className="text-xs tracking-widest uppercase text-flame">Reserved</p>
        <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">
          Your hamper is held
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Reference <span className="font-medium text-ink">{reference}</span>. We&apos;ll
          confirm by email shortly.
        </p>
        <Link
          to="/collection"
          className="mt-10 inline-block bg-ink px-10 py-3.5 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame"
        >
          Browse collection
        </Link>
      </div>
    );
  }

  if (catalogLoading) {
    return (
      <p className="text-sm text-ink-muted">Loading hamper options…</p>
    );
  }

  if (catalogError) {
    return (
      <p className="text-sm text-flame-deep">{catalogError}</p>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:gap-20 xl:grid-cols-[1fr_400px]">
      <div className="space-y-16 md:space-y-20">
        <section>
          <p className="text-xs tracking-widest uppercase text-flame">01</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Candle
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {available.map((candle) => {
              const active = candle.id === candleId;
              return (
                <button
                  key={candle.id}
                  type="button"
                  onClick={() => setCandleId(candle.id)}
                  className={cn(
                    "border p-5 text-left transition-all duration-300",
                    active
                      ? "border-ink bg-paper-warm"
                      : "border-ink/10 hover:border-ink/30"
                  )}
                >
                  <p className={cn("font-display text-lg", active && "text-ink")}>
                    {candle.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{candle.scent}</p>
                  <p className="mt-3 text-sm">
                    {formatCurrency(candle.discountPrice)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="text-xs tracking-widest uppercase text-flame">02</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Fragrance
          </h2>
          <div className="mt-8 space-y-2">
            {catalog.fragrances.map((opt) => {
              const active = opt.id === fragranceId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFragranceId(opt.id)}
                  className={cn(
                    "flex w-full items-center justify-between border-b px-1 py-4 text-left transition-colors",
                    active ? "border-ink" : "border-ink/10 hover:border-ink/30"
                  )}
                >
                  <div>
                    <p className={cn("text-sm", active && "font-medium")}>
                      {opt.label}
                    </p>
                    {opt.description && (
                      <p className="mt-1 text-xs text-ink-muted">
                        {opt.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-ink-muted">
                    {opt.price === 0 ? "Included" : `+${formatCurrency(opt.price)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="text-xs tracking-widest uppercase text-flame">03</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Color
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {catalog.colors.map((opt) => {
              const active = opt.id === colorId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColorId(opt.id)}
                  className={cn(
                    "flex min-w-[120px] flex-col items-start gap-3 border p-4 transition-all duration-300",
                    active
                      ? "border-ink bg-paper-warm"
                      : "border-ink/10 hover:border-ink/30"
                  )}
                >
                  <span
                    className="block h-8 w-8 border border-ink/10"
                    style={{ backgroundColor: opt.swatch }}
                    aria-hidden
                  />
                  <span className="text-sm">{opt.label}</span>
                  <span className="text-xs text-ink-muted">
                    {opt.price === 0 ? "Included" : `+${formatCurrency(opt.price)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="text-xs tracking-widest uppercase text-flame">04</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Flowers
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {catalog.flowers.map((opt) => {
              const active = opt.id === flowerId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFlowerId(opt.id)}
                  className={cn(
                    "border p-5 text-left transition-all duration-300",
                    active
                      ? "border-ink bg-paper-warm"
                      : "border-ink/10 hover:border-ink/30"
                  )}
                >
                  <p className="font-display text-lg">{opt.label}</p>
                  {opt.description && (
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {opt.description}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-ink-muted">
                    {opt.price === 0 ? "Included" : `+${formatCurrency(opt.price)}`}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="text-xs tracking-widest uppercase text-flame">05</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Packaging logo
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            Optional. Upload a logo for the gift box sleeve
            {` (+${formatCurrency(catalog.logoFee)})`}. PNG, JPG, WebP, or SVG
            under 2MB.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <label className="cursor-pointer border border-ink/20 px-6 py-3 text-xs tracking-widest uppercase transition-colors hover:border-ink hover:bg-ink hover:text-paper">
              {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                disabled={uploading}
                onChange={onLogoChange}
              />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={clearLogo}
                className="text-xs tracking-widest uppercase text-ink-muted hover:text-ink"
              >
                Remove
              </button>
            )}
          </div>
          {uploadError && (
            <p className="mt-3 text-sm text-flame-deep">{uploadError}</p>
          )}
          {logoUrl && (
            <div className="mt-6 flex items-center gap-4 border border-ink/10 bg-paper-warm p-4">
              <div className="relative h-16 w-16 overflow-hidden bg-paper">
                <img
                  src={logoUrl}
                  alt="Uploaded logo preview"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div>
                <p className="text-sm">{logoName || "Custom logo"}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Applied to packaging · +{formatCurrency(catalog.logoFee)}
                </p>
              </div>
            </div>
          )}
        </section>

        {step === "details" && (
          <section className="border-t border-ink/10 pt-14 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            <p className="text-xs tracking-widest uppercase text-flame">06</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
              Your details
            </h2>
            <form onSubmit={submitOrder} className="mt-8 max-w-lg space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-ink-muted">
                  Name
                </label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-ink-muted">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-ink-muted">
                  Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-ink-muted">
                  Gift note
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full resize-none border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
                />
              </div>
              {formError && (
                <p className="text-sm text-flame-deep">{formError}</p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("build")}
                  className="border border-ink/20 px-8 py-3.5 text-xs tracking-widest uppercase transition-colors hover:border-ink"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ink px-10 py-3.5 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame disabled:opacity-60"
                >
                  {saving ? "Reserving…" : "Reserve hamper"}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink/10 bg-gradient-to-b from-paper-warm to-paper p-8 md:p-10">
          <p className="text-xs tracking-widest uppercase text-flame">
            Hamper total
          </p>
          <p className="mt-4 font-display text-4xl tracking-tight transition-all duration-300">
            {formatCurrency(breakdown.total)}
          </p>
          <dl className="mt-8 space-y-3 border-t border-ink/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">
                Candle{selectedCandle ? ` · ${selectedCandle.title}` : ""}
              </dt>
              <dd>{formatCurrency(breakdown.candle)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Fragrance</dt>
              <dd>
                {breakdown.fragrance === 0
                  ? "Included"
                  : formatCurrency(breakdown.fragrance)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Color</dt>
              <dd>
                {breakdown.color === 0
                  ? "Included"
                  : formatCurrency(breakdown.color)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Flowers</dt>
              <dd>
                {breakdown.flower === 0
                  ? "Included"
                  : formatCurrency(breakdown.flower)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Gift packaging</dt>
              <dd>{formatCurrency(catalog.packagingFee)}</dd>
            </div>
            {breakdown.logo > 0 && (
              <div className="flex justify-between gap-4 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
                <dt className="text-ink-muted">Logo on packaging</dt>
                <dd>{formatCurrency(breakdown.logo)}</dd>
              </div>
            )}
          </dl>

          {step === "build" && (
            <button
              type="button"
              onClick={() => setStep("details")}
              disabled={!candleId || !fragranceId || !colorId || !flowerId}
              className="mt-10 w-full bg-ink px-8 py-4 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame disabled:opacity-50"
            >
              Continue
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
