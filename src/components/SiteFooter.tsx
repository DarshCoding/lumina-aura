import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/8 bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-sm tracking-brand uppercase">
            Lummina Aura
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            Quiet light. Considered scent. Candles poured for interiors that
            prefer stillness over spectacle.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-paper/70">
          <Link href="/collection" className="hover:text-paper">
            Collection
          </Link>
          <Link href="/gifts" className="hover:text-paper">
            Gift hampers
          </Link>
          <Link href="/about" className="hover:text-paper">
            About
          </Link>
          <Link href="/contact" className="hover:text-paper">
            Contact
          </Link>
        </div>
        <div className="text-sm text-paper/50 md:text-right">
          <p>Studio hours · Mon–Sat</p>
          <p className="mt-1">10:00 – 19:00</p>
          <p className="mt-6">{new Date().getFullYear()} Lummina Aura</p>
        </div>
      </div>
    </footer>
  );
}
