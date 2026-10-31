"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

function formatInr(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}

export default function BudgetCalculatorSection() {
  const [budget, setBudget] = useState<number>(50000);
  const sliderId = useId();

  const upfront = Math.round(budget * 0.25);
  const milestoneRest = budget - upfront;
  const competitor20 = Math.round(budget * 0.8);
  const competitor10 = Math.round(budget * 0.9);
  const techEngi5 = Math.round(budget * 0.95);
  const techEngi3 = Math.round(budget * 0.97);

  return (
    <section className="bg-saas-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-saas-accent-2">A clear breakdown, before you commit</p>
            <h2 className="mt-3 text-balance font-sans text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              See where your budget goes.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-saas-tx sm:text-lg">
            Move the slider to see the escrow amount, milestone balance and what your freelancer
            receives.
          </p>
        </div>

        <div className="reveal grid overflow-hidden rounded-saas-5xl border border-saas-line bg-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-8 lg:p-10 xl:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <label htmlFor={sliderId} className="text-sm font-semibold text-saas-tx">
                  Your project budget
                </label>
                <output
                  htmlFor={sliderId}
                  className="mt-2 block font-sans text-5xl font-bold tracking-[-0.06em] text-saas-ink sm:text-6xl"
                >
                  {formatInr(budget)}
                </output>
              </div>
              <span className="rounded-full bg-saas-icon-bg px-4 py-2 text-sm font-semibold text-saas-accent-2">
                No client commission
              </span>
            </div>

            <div className="mt-8 rounded-2xl bg-saas-bg p-4 sm:p-6">
              <input
                id={sliderId}
                type="range"
                min="3000"
                max="500000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                aria-label="Project budget in rupees"
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-saas-line accent-saas-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saas-accent"
              />
              <div className="mt-3 flex justify-between font-mono text-xs text-saas-tx">
                <span>₹3,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-saas-tx">Upfront to confirm · 25% in escrow</span>
                <span className="font-mono text-sm font-semibold text-saas-ink">{formatInr(upfront)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-saas-tx">Released by milestone · 75%</span>
                <span className="font-mono text-sm font-semibold text-saas-ink">{formatInr(milestoneRest)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-saas-tx">Client platform fee</span>
                <span className="rounded-md bg-saas-icon-bg px-2.5 py-1 font-mono text-sm font-bold text-saas-accent-2">₹0</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                <span className="font-semibold text-saas-ink">Your total project budget</span>
                <span className="font-mono text-lg font-bold text-saas-ink">{formatInr(budget)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-saas-bg p-5 sm:p-8 lg:p-10 xl:p-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-saas-icon-bg text-saas-accent">
                  <TrendingUp aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-saas-tx">Freelancer payout comparison</p>
              </div>
              <h3 className="mt-6 max-w-md font-sans text-2xl font-bold leading-tight tracking-[-0.04em] text-saas-ink sm:text-3xl">
                More of your budget reaches the person doing the work.
              </h3>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-saas-line bg-white px-4 py-3 text-sm">
                  <span className="text-saas-tx">20% commission platform</span>
                  <span className="font-mono text-saas-mut line-through">{formatInr(competitor20)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-saas-line bg-white px-4 py-3 text-sm">
                  <span className="text-saas-tx">10% commission platform</span>
                  <span className="font-mono text-saas-tx">{formatInr(competitor10)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-saas-accent/20 bg-saas-icon-bg px-4 py-3 text-sm text-saas-ink">
                  <span>Tech Engi · 5%</span>
                  <span className="font-mono font-semibold text-saas-accent-2">{formatInr(techEngi5)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-saas-line bg-white px-4 py-3 text-sm font-semibold text-saas-ink">
                  <span>First project · 3%</span>
                  <span className="font-mono">{formatInr(techEngi3)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs leading-relaxed text-slate-800">
                Tech Engi takes its fee from the freelancer&apos;s payout, never on top of your
                budget. Payment-gateway charges apply on every platform.
              </p>
              <Link
                href="/register/client"
                className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-saas-nav px-6 text-sm font-semibold text-white transition-colors hover:bg-saas-accent-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saas-accent"
              >
                Start with your budget
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-center text-xs font-medium text-saas-tx">
                Free to post · No credit card required upfront
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
