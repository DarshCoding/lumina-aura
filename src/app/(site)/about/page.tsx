import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="text-xs tracking-widest uppercase text-flame">Atelier</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight md:text-6xl">
          A practice of quiet light
        </h1>
      </div>

      <div className="relative mt-16 h-[50vh] min-h-[360px] w-full overflow-hidden md:mt-20 md:h-[70vh]">
        <Image
          src="/images/atelier.svg"
          alt="Candle making"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] gap-12 px-6 md:mt-24 md:grid-cols-2 md:px-10">
        <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl">
          Lummina Aura began as a studio experiment — fewer scents, better
          vessels, burns that hold a room without shouting.
        </p>
        <div className="space-y-6 text-ink-muted leading-relaxed">
          <p>
            We pour in small batches using soy wax and cotton wicks. Fragrances
            are composed for clarity: warm woods, soft florals, clean linen,
            and evening spices.
          </p>
          <p>
            The portfolio is curated, not crowded. Each candle is named,
            photographed, and stocked with the same care we give the pour
            itself.
          </p>
        </div>
      </div>
    </div>
  );
}
