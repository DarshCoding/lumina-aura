import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/pricing";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/gifts", label: "Gift hampers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-paper/90 backdrop-blur-md border-b border-ink/5"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="font-display text-sm font-semibold tracking-brand uppercase text-ink"
          >
            Lummina Aura
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-[13px] tracking-wide text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex flex-col gap-1.5 md:hidden"
          >
            <span className="block h-px w-7 bg-ink" />
            <span className="block h-px w-5 bg-ink self-end" />
          </button>

          <Link
            to="/admin"
            className="hidden text-[11px] tracking-widest uppercase text-ink-muted transition-colors hover:text-flame md:inline"
          >
            Admin
          </Link>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-500",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-ink/40"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper px-10 py-10 transition-transform duration-500 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm tracking-brand uppercase">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-ink-muted"
            >
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-6">
            {links.map((l, i) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-medium tracking-tight text-ink opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-8 text-sm tracking-widest uppercase text-flame"
            >
              Admin Dashboard
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
