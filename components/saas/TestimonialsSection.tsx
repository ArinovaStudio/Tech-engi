const TESTIMONIALS = [
  {
    quote:
      "Posted a backend bug at 11pm. Woke up to a pull request. Paid 5% fee on a project that would’ve cost 20% anywhere else.",
    initial: "S",
    name: "Sowjanya Founder",
    role: "D2D e-commerce",
  },
  {
    quote: "Our payment gateway broke on a Friday deploy. Matched with an engineer in 40 minutes — fixed before the weekend even started.",
    initial: "D",
    name: "Diikshitha V",
    role: "Engineering manager , Fintech startup",
  },
  {
    quote: "Our team was overloaded before a client demo. Tech Engi matched a verified engineer who cleared the backlog in two days.",
    initial: "R",
    name: "Ranjhana T ",
    role: "Product lead, SaaS Company",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="tst" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          People whose Monday morning <span className="text-saas-mut">didn’t turn into a crisis.</span>
        </h2>

        <div className="mt-[60px] grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card reveal flex flex-col">
              <p className="mb-5 flex-1 text-base sm:text-[1.15rem] leading-[1.55] text-saas-ink">{t.quote}</p>
              <div className="flex items-center gap-3.5">
                <i className="grid h-11 w-11 flex-none place-items-center rounded-full bg-saas-accent font-semibold not-italic text-white">
                  {t.initial}
                </i>
                <div>
                  <b className="text-saas-ink text-sm lg:text-base">{t.name}</b>
                  <p className="text-xs lg:text-[0.9rem] leading-[1.3]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
