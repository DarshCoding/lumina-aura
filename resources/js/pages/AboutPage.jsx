import { sectionOr, usePageSections } from "@/hooks/usePageSections";

const fallback = {
  eyebrow: "Atelier",
  title: "A practice of quiet light",
  body: "Lummina Aura began as a studio experiment — fewer scents, better vessels, burns that hold a room without shouting.",
  bodySecondary:
    "We pour in small batches using soy wax and cotton wicks. Fragrances are composed for clarity: warm woods, soft florals, clean linen, and evening spices.\n\nThe portfolio is curated, not crowded. Each candle is named, photographed, and stocked with the same care we give the pour itself.",
  imageUrl: "/images/atelier.svg",
};

export default function AboutPage() {
  const { sections } = usePageSections("about");
  const content = sectionOr(fallback, sections.main);
  const secondaryParagraphs = (content.bodySecondary || "")
    .split(/\n\n+/)
    .filter(Boolean);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {content.eyebrow && (
          <p className="text-xs tracking-widest uppercase text-flame">
            {content.eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight md:text-6xl">
          {content.title}
        </h1>
      </div>

      <div className="relative mt-16 h-[50vh] min-h-[360px] w-full overflow-hidden md:mt-20 md:h-[70vh]">
        <img
          src={content.imageUrl || "/images/atelier.svg"}
          alt="Candle making"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] gap-12 px-6 md:mt-24 md:grid-cols-2 md:px-10">
        {content.body && (
          <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl">
            {content.body}
          </p>
        )}
        <div className="space-y-6 text-ink-muted leading-relaxed">
          {secondaryParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
