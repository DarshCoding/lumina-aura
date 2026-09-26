import { Link } from "react-router-dom";
import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const fallback = {
  title: "Lummina Aura",
  body: "Quiet light. Considered scent. Candles poured for interiors that prefer stillness over spectacle.",
  meta: {
    hoursLabel: "Studio hours · Mon–Sat",
    hours: "10:00 – 19:00",
  },
};

export function SiteFooter() {
  const { sections } = usePageSections("footer");
  const content = sectionOr(fallback, sections.main);

  return (
    <footer className="border-t border-ink/8 bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-sm tracking-brand uppercase">
            {content.title || "Lummina Aura"}
          </p>
          {content.body && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              {content.body}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 text-sm text-paper/70">
          <Link to="/collection" className="hover:text-paper">
            Collection
          </Link>
          <Link to="/gifts" className="hover:text-paper">
            Gift hampers
          </Link>
          <Link to="/about" className="hover:text-paper">
            About
          </Link>
          <Link to="/contact" className="hover:text-paper">
            Contact
          </Link>
        </div>
        <div className="text-sm text-paper/50 md:text-right">
          {content.meta.hoursLabel && <p>{content.meta.hoursLabel}</p>}
          {content.meta.hours && <p className="mt-1">{content.meta.hours}</p>}
          <p className="mt-6">{new Date().getFullYear()} Lummina Aura</p>
        </div>
      </div>
    </footer>
  );
}
