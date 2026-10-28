"use client";

import React from "react";

interface AuthBrandSideProps {
  role?: "CLIENT" | "ENGINEER" | null;
}

export default function AuthBrandSide({ role = "CLIENT" }: AuthBrandSideProps) {
  const isEngineer = role === "ENGINEER";

  const subtitle = isEngineer
    ? "Get matched on what you've actually built and had verified — not on a profile score, and not on who paid to be seen."
    : "Describe what's broken. We match it to a verified Indian engineer who has fixed that kind of thing before — no bidding, no proposals to read.";

  const feeTitle = isEngineer
    ? "Keep 97%, then 95%"
    : "Clients pay no platform fee";

  const feeDesc = isEngineer
    ? "The fee is 3% on your first completed project and 5% after. No credits to buy before you can apply."
    : "You pay the agreed amount for the work. No posting fee, no subscription, nothing on top.";

  return (
    <aside
      aria-label="About Tech Engi"
      className="relative hidden lg:flex flex-col justify-between overflow-hidden border-l border-slate-200 bg-[#f8fafc] p-10 xl:p-14 dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#090e24] dark:via-[#060a1d] dark:to-[#030614] select-none"
    >
      {/* Subtle Atmospheric Watermark Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-[500px] w-[500px] rounded-full border-[54px] border-amber-500/[0.04] dark:border-amber-400/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -left-28 h-[440px] w-[440px] rounded-full border-[44px] border-blue-500/[0.035] dark:border-pink-500/[0.04]"
      />

      {/* Top Wordmark */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="font-mono text-xl font-black text-[#f0b31e]">{`{ }`}</span>
        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          TECH ENGI
        </span>
        <span className="ml-1 border-l border-slate-200 pl-3 font-mono text-[10.5px] font-medium tracking-[0.16em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
          INDIA&apos;S ENGINEERING NETWORK
        </span>
      </div>

      {/* Center Main Message */}
      <div className="relative z-10 my-auto py-10 max-w-xl">
        <h2 className="text-4xl xl:text-5xl font-black tracking-[-0.04em] text-slate-900 dark:text-white leading-[1.02]">
          AI matches.
          <span className="block text-[#f0b31e]">Humans fix.</span>
        </h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>

        {/* Fact Cards */}
        <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800/80 dark:border-slate-800/80">
          {/* Fact 1: Verification */}
          <div className="flex items-start gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#f0b31e] dark:bg-amber-400/15">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M9 1.5l6.5 2.8v4.8c0 4-2.8 7.3-6.5 8.2-3.7-.9-6.5-4.2-6.5-8.2V4.3z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M6.2 9.1l2 2 3.7-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                Verified before matching
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Aadhaar, PAN and proof of experience &mdash; checked before anyone reaches your project.
              </p>
            </div>
          </div>

          {/* Fact 2: Escrow */}
          <div className="flex items-start gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#f0b31e] dark:bg-amber-400/15">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2.5" y="7" width="13" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5.8 7V4.8a3.2 3.2 0 016.4 0V7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                Milestone escrow
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Money is released when you accept a milestone &mdash; not before.
              </p>
            </div>
          </div>

          {/* Fact 3: Dynamic Fee */}
          <div className="flex items-start gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#f0b31e] dark:bg-amber-400/15">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M11.6 6.4L6.4 11.6M7 6.9h.01M11 11.1h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                {feeTitle}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {feeDesc}
              </p>
            </div>
          </div>

          {/* Fact 4: No bidding */}
          <div className="flex items-start gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#f0b31e] dark:bg-amber-400/15">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M9 2.2l1.9 4 4.4.6-3.2 3.1.8 4.4L9 12.2l-3.9 2.1.8-4.4L2.7 6.8l4.4-.6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                No bidding, ever
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                No proposal flood, no profile ranking, and nothing to buy before you&apos;re allowed to apply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Badges */}
      <div className="relative z-10 flex flex-wrap gap-2 pt-4">
        <span className="rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.08em] text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          DPIIT RECOGNISED
        </span>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.08em] text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          MSME REGISTERED
        </span>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.08em] text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          CHENNAI, INDIA
        </span>
      </div>
    </aside>
  );
}

