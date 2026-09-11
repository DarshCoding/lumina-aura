import { HamperBuilder } from "@/components/HamperBuilder";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GiftsPage() {
  const products = await getProducts();

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="relative overflow-hidden border-b border-ink/5 bg-gradient-to-br from-paper-warm via-paper to-paper-dark/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(184,137,74,0.18), transparent 45%), radial-gradient(circle at 85% 70%, rgba(168,181,160,0.2), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <p className="text-xs tracking-widest uppercase text-flame opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            Lummina Aura
          </p>
          <h1
            className="mt-4 max-w-2xl font-display text-4xl tracking-tight opacity-0 animate-fade-up md:text-6xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Custom gift hamper
          </h1>
          <p
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted opacity-0 animate-fade-up md:text-lg"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Compose a candle, fragrance, color, and flowers — then add your logo
            to the packaging. Pricing updates as you build.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-16 md:px-10 md:pt-24">
        <HamperBuilder candles={products} />
      </div>
    </div>
  );
}
