import { Check } from "lucide-react";

interface FreeItem {
  title: string;
  description: string;
}

const FREE_ITEMS: FreeItem[] = [
  {
    title: "Posting a project",
    description: "Post as many as you like. Nothing is charged to list work.",
  },
  {
    title: "Seeing your matches",
    description: "The shortlist and the reasoning behind it cost nothing to read.",
  },
  {
    title: "Talking to an engineer",
    description: "No per-message charge, no unlock fee, no paywall on the conversation.",
  },
  {
    title: "Credits, tokens or connects",
    description: "They do not exist here, for you or for the engineer.",
  },
  {
    title: "A monthly subscription",
    description: "There is no client plan to buy. You pay for work, when there is work.",
  },
  {
    title: "Closing the deal",
    description: "No completion fee, no success fee, no charge to finish.",
  },
  {
    title: "Escrow & milestone protection",
    description: "Built in on every project, not an upgrade you have to remember to buy.",
  },
  {
    title: "Identity verification",
    description: "Every engineer is Aadhaar, PAN and experience checked before matching. Always included.",
  },
];

export default function NeverPaySection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold text-saas-accent-2">No paywalls between you and good work</p>
            <h2 className="mt-3 text-balance font-sans text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              Eight things you won&apos;t pay for.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-saas-tx sm:text-lg">
            No platform tax, no paywalled chats, and no hidden surprises on your invoice.
          </p>
        </div>

        <div className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-4">
          {FREE_ITEMS.map((item, index) => (
            <article
              key={item.title}
              className="reveal group border-t border-saas-line py-5 transition-colors duration-200 hover:border-saas-accent sm:py-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-wide text-saas-mut">
                  NO. {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-saas-icon-bg text-saas-accent-2 transition-colors duration-200 group-hover:bg-saas-accent group-hover:text-white">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </span>
              </div>
              <h3 className="mt-5 font-sans text-lg font-bold leading-snug text-saas-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-saas-tx">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-col gap-3 rounded-saas-4xl border border-saas-line bg-saas-bg px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <p className="max-w-2xl font-sans text-xl font-bold tracking-tight text-saas-ink sm:text-2xl">
            Your money should go toward the work—not getting access to it.
          </p>
          <span className="shrink-0 font-mono text-sm font-bold text-saas-accent-2">THAT&apos;S THE WHOLE POINT.</span>
        </div>
      </div>
    </section>
  );
}
