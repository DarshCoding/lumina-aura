import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const fallback = {
  eyebrow: "Studio",
  title: "Contact",
  meta: {
    visit: "Lummina Aura Studio\nBy appointment",
    email: "hello@lumminaaura.com",
    hours: "Monday – Saturday · 10:00 – 19:00",
  },
};

export default function ContactPage() {
  const { sections } = usePageSections("contact");
  const content = sectionOr(fallback, sections.main);
  const visitLines = (content.meta.visit || "").split("\n").filter(Boolean);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {content.eyebrow && (
          <p className="text-xs tracking-widest uppercase text-flame">
            {content.eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
          {content.title}
        </h1>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <div className="space-y-8 text-ink-muted">
            {visitLines.length > 0 && (
              <div>
                <p className="text-xs tracking-widest uppercase text-ink">
                  Visit
                </p>
                <p className="mt-3 leading-relaxed">
                  {visitLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            )}
            {content.meta.email && (
              <div>
                <p className="text-xs tracking-widest uppercase text-ink">
                  Email
                </p>
                <a
                  href={`mailto:${content.meta.email}`}
                  className="mt-3 block text-ink hover:text-flame"
                >
                  {content.meta.email}
                </a>
              </div>
            )}
            {content.meta.hours && (
              <div>
                <p className="text-xs tracking-widest uppercase text-ink">
                  Hours
                </p>
                <p className="mt-3">{content.meta.hours}</p>
              </div>
            )}
          </div>
          <form className="space-y-6">
            <div>
              <label className="text-xs tracking-widest uppercase text-ink-muted">
                Name
              </label>
              <input
                type="text"
                className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-ink-muted">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-ink-muted">
                Message
              </label>
              <textarea
                rows={4}
                className="mt-2 w-full resize-none border-b border-ink/20 bg-transparent py-3 outline-none transition-colors focus:border-ink"
              />
            </div>
            <button
              type="button"
              className="mt-4 bg-ink px-10 py-4 text-xs tracking-widest uppercase text-paper transition-colors hover:bg-flame"
            >
              Send enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
