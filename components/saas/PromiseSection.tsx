import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const ZERO_ITEMS = [
  {
    amount: "₹0",
    title: "Platform fee for clients",
    description: "You pay only the agreed budget for the work. No commission added on top.",
  },
  {
    amount: "₹0",
    title: "To post a project or get matched",
    description: "Describe what you need and receive verified engineering candidates for free.",
  },
  {
    amount: "₹0",
    title: "Credits, tokens or connects",
    description: "They do not exist here — neither for you nor for engineers applying to work.",
  },
  {
    amount: "₹0",
    title: "To close the deal or message",
    description: "Direct collaboration with your engineer from day one without paywalled chats.",
  },
];

export default function PromiseSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal grid overflow-hidden bg-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-14 xl:p-16">
            <p className="text-sm font-semibold tracking-wide text-saas-accent-2">
              Straightforward project pricing
            </p>
            <h2 className="mt-4 max-w-3xl text-balance font-sans text-[clamp(2.25rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              Your budget is the price.
              <span className="mt-1 block text-saas-mut">Not a rupee more.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-saas-tx sm:text-lg">
              You agree on an amount. Fund 25% into milestone escrow to confirm, then release the
              remaining 75% as each deliverable lands. No client platform fee, posting fee,
              subscription, or hidden charges in between.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register/client"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-saas-nav px-6 text-sm font-semibold text-white transition-colors hover:bg-saas-accent-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saas-accent"
              >
                Post your project
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-saas-line px-5 text-sm font-semibold text-saas-ink transition-colors hover:border-saas-accent/40 hover:bg-saas-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saas-accent"
              >
                See how matching works
              </a>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-saas-tx">
              <ShieldCheck size={17} className="text-saas-accent" />
              Free to post · No credit card required
            </p>
          </div>

          <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-saas-bg p-6 sm:p-9 lg:min-h-full lg:p-12">
            <div className="relative">
              <p className="text-sm font-semibold text-saas-tx">One agreed project budget</p>
              <p className="mt-4 font-sans text-6xl font-bold tracking-[-0.07em] text-saas-accent sm:text-7xl">
                100<span className="text-4xl text-saas-ink sm:text-5xl">%</span>
              </p>
              <p className="mt-2 max-w-xs text-base leading-relaxed text-saas-tx">
                goes toward the work you asked for. No surprise platform charges.
              </p>
            </div>

            <div className="relative mt-12 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-saas-line bg-white px-5 py-4">
                <span className="font-medium text-saas-tx">Held safely in escrow</span>
                <span className="font-mono text-lg font-bold text-saas-ink">25%</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-saas-line bg-white px-5 py-4">
                <span className="font-medium text-saas-tx">Released by milestones</span>
                <span className="font-mono text-lg font-bold text-saas-ink">75%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {ZERO_ITEMS.map((item, index) => (
            <div
              key={item.title}
              className="reveal border-t border-saas-line py-5 sm:py-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold text-saas-accent">
                  0{index + 1}
                </span>
                <span className="font-sans text-3xl font-bold tracking-tight text-saas-ink">
                  {item.amount}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold leading-snug text-saas-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-saas-tx">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
