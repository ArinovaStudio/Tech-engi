import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const ESCROW_STEPS = [
  {
    step: "01",
    text: "You fund 25%. It enters escrow. Matching begins.",
  },
  {
    step: "02",
    text: "Engineer delivers milestone one. You review and verify it.",
  },
  {
    step: "03",
    text: "You accept. Only then does any money move to them.",
  },
  {
    step: "04",
    text: "Repeat per milestone until the project closes cleanly.",
  },
];

export default function EscrowSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal grid gap-8 xl:grid-cols-[0.8fr_1.2fr] xl:gap-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-saas-accent-2">Milestone payments, protected</p>
            <h2 className="mt-3 text-balance font-sans text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              Your money stays yours until you approve the work.
            </h2>
            <p className="mt-7 text-base leading-relaxed text-saas-tx sm:text-lg">
              The 25% confirms an active project and activates Nashedi AI. It goes into escrow—not
              to the freelancer—and stays protected until you accept the first milestone.
            </p>
            <p className="mt-4 text-base leading-relaxed text-saas-tx sm:text-lg">
              You are never left chasing a refund after work stalls. The funds remain in escrow
              until you approve a milestone.
            </p>
            <div className="mt-8 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saas-accent" />
              <p className="text-sm leading-relaxed text-saas-tx">
                Review the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="font-semibold text-saas-ink underline decoration-saas-accent/50 decoration-2 underline-offset-4 transition-colors hover:text-saas-accent-2"
                >
                  dispute and refund terms
                </Link>{" "}
                before you fund. Transparent rules, available upfront.
              </p>
            </div>
          </div>

          <div className="reveal rounded-saas-4xl border border-saas-line bg-saas-bg p-5 sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-saas-accent-2">How your project funds move</p>
                <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-saas-ink sm:text-3xl">
                  Nothing released before approval.
                </h3>
              </div>
              <ShieldCheck className="h-7 w-7 text-saas-accent" />
            </div>

            <div className="mt-9 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
              <div className="rounded-2xl bg-saas-accent px-3 py-4 text-center text-white sm:p-5">
                <span className="text-xs font-semibold">TO START</span>
                <p className="mt-2 font-mono text-3xl font-bold sm:text-4xl">25%</p>
                <p className="mt-1 text-xs font-medium sm:text-sm">Held in escrow</p>
              </div>
              <div aria-hidden="true" className="h-px w-8 bg-white/30 sm:w-12" />
              <div className="rounded-2xl border border-saas-line bg-white px-3 py-4 text-center sm:p-5">
                <span className="text-xs font-semibold text-saas-mut">BY MILESTONE</span>
                <p className="mt-2 font-mono text-3xl font-bold text-saas-ink sm:text-4xl">75%</p>
                <p className="mt-1 text-xs font-medium text-saas-tx sm:text-sm">Released on approval</p>
              </div>
            </div>

            <div className="mt-8 space-y-0">
              {ESCROW_STEPS.map((step, index) => (
                <div key={step.step} className="group flex gap-4 py-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-saas-icon-bg font-mono text-xs font-bold text-saas-accent-2 transition-colors group-hover:bg-saas-accent group-hover:text-white">
                      {step.step}
                    </span>
                    {index < ESCROW_STEPS.length - 1 && (
                      <span aria-hidden="true" className="mt-2 h-full min-h-4 w-px bg-saas-line" />
                    )}
                  </div>
                  <p className="pt-1.5 text-sm leading-relaxed text-saas-tx sm:text-base">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-saas-tx">
              <ShieldCheck className="h-4 w-4 shrink-0 text-saas-accent" />
              100% escrow protection on every milestone release
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
