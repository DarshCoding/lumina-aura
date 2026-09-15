export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="text-xs tracking-widest uppercase text-flame">Studio</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
          Contact
        </h1>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <div className="space-y-8 text-ink-muted">
            <div>
              <p className="text-xs tracking-widest uppercase text-ink">Visit</p>
              <p className="mt-3 leading-relaxed">
                Lummina Aura Studio
                <br />
                By appointment
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-ink">Email</p>
              <a
                href="mailto:hello@lumminaaura.com"
                className="mt-3 block text-ink hover:text-flame"
              >
                hello@lumminaaura.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-ink">Hours</p>
              <p className="mt-3">Monday – Saturday · 10:00 – 19:00</p>
            </div>
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
