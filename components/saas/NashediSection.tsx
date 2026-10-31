import { Clock } from "lucide-react";

const TRAITS = [
  {
    num: "01",
    title: "It understands the problem",
    description:
      "Not keyword matching. Nashedi reads your title, your description, your stack and the skills the work genuinely needs — which is frequently not the same as the skills people list on a profile.",
  },
  {
    num: "02",
    title: "It thinks before it answers",
    description:
      "Every match arrives with its reasoning attached: this engineer closed three jobs with the same shape as yours. You are reading an argument and deciding whether you agree, not guessing from an inflated star rating.",
  },
  {
    num: "03",
    title: "It matches for care, not availability",
    description:
      "Being free this week is not a qualification. Nashedi ranks on work actually finished and verified — so the person who arrives is the one most likely to get it right, not the one who refreshed fastest.",
  },
  {
    num: "04",
    title: "Then a human takes over",
    description:
      "Nashedi does not write your code. A verified engineer does — one with a name, a verified identity and years behind them, who talks to you directly with nobody in between.",
  },
];

const TIMELINE_STEPS = [
  {
    time: "00:00",
    text: "You post the problem.",
    highlight: "Plain words are fine",
    rest: "— no complex spec, no stack list needed.",
  },
  {
    time: "00:02",
    text: "Nashedi asks two or three follow-ups and writes the brief.",
    highlight: "You correct it",
    rest: "before anything moves.",
  },
  {
    time: "00:05",
    text: "You fund",
    highlight: "25% into escrow",
    rest: ". Matching starts. The money has not reached anyone.",
  },
  {
    time: "00:40",
    text: "A shortlist arrives, each with",
    highlight: "the reasoning for the match",
    rest: "and verified experience records.",
  },
  {
    time: "01:30",
    text: "You pick one and talk to them",
    highlight: "directly",
    rest: ". No account manager in between.",
  },
  {
    time: "02:00",
    text: "Work starts. You approve each milestone, and",
    highlight: "only then",
    rest: "does escrow release.",
  },
];

export default function NashediSection() {
  return (
    <section id="how" className="bg-saas-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-saas-accent-2">Thoughtful matching, not a race to apply</p>
            <h2 className="mt-3 max-w-4xl text-balance font-sans text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              A match should make sense.{" "}
              <span className="underline decoration-saas-accent/40 decoration-[0.18em] underline-offset-[0.12em]">
                Here&apos;s how.
              </span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-saas-tx sm:text-lg">
            Nashedi looks beyond keywords and availability to find the freelancer who has solved
            your kind of problem before.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr] xl:gap-12">
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {TRAITS.map((trait, index) => (
              <article key={trait.num} className="reveal border-t border-saas-line pt-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-saas-icon-bg font-mono text-xs font-bold text-saas-accent-2">
                    {trait.num}
                  </span>
                  <span className="mx-4 h-px flex-1 bg-saas-line" />
                  <span className="font-mono text-xs text-saas-mut">0{index + 1} / 04</span>
                </div>
                <h3 className="mt-5 font-sans text-xl font-bold tracking-tight text-saas-ink">
                  {trait.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-saas-tx">
                  {trait.description}
                </p>
              </article>
            ))}
          </div>

          <div className="reveal rounded-saas-4xl border border-saas-line bg-white p-6 sm:p-8 lg:p-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-saas-accent-2">
                  <Clock className="h-4 w-4" />
                  A typical first session
                </div>
                <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                  From brief to first conversation.
                </h3>
              </div>
              <span className="hidden rounded-full bg-saas-icon-bg px-3 py-1.5 font-mono text-xs font-bold text-saas-accent-2 sm:inline-flex">
                ~2 HOURS
              </span>
            </div>

            <div className="mt-8">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={step.time} className="relative flex gap-4 pb-6 last:pb-0">
                  {idx < TIMELINE_STEPS.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px bg-saas-line" />
                  )}
                  <span className="relative z-10 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saas-accent font-mono text-[9px] font-bold text-white">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 border-b border-saas-line pb-5 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium leading-relaxed text-saas-ink">
                        {step.text}{" "}
                        <strong className="font-semibold text-saas-accent-2">{step.highlight}</strong>
                        {step.rest}
                      </p>
                      <span className="font-mono text-[11px] text-saas-mut">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-7 rounded-2xl bg-saas-bg p-4 text-sm leading-relaxed text-saas-tx">
              <strong className="text-saas-ink">Fast turnarounds:</strong> Most projects are matched
              within 2 hours; the outside limit is 24 hours. Timing above illustrates a typical
              first session.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
