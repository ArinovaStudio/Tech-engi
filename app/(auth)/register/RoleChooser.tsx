"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";
import { humanizeAuthError } from "@/lib/auth-errors";

const OPTIONS = [
  {
    role: "CLIENT" as const,
    href: "/register/client",
    title: "I\u2019m hiring",
    tag: "CLIENT",
    desc: "Fix a bug, take over code, or run a milestone project with a verified Indian engineer.",
    cta: "Continue as a client",
  },
  {
    role: "ENGINEER" as const,
    href: "/register/engineer",
    title: "I\u2019m an engineer",
    tag: "ENGINEER",
    desc: "Get matched on work you\u2019ve actually built and had verified. No bidding, no credits.",
    cta: "Continue as an engineer",
  },
];

export default function RoleChooser({
  callbackUrl = null,
  initialError = null,
}: {
  callbackUrl?: string | null;
  initialError?: string | null;
}) {
  const { theme, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState<"CLIENT" | "ENGINEER" | null>(null);
  const qs = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
  const notice = initialError ? humanizeAuthError(initialError) : "";

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-screen">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            &larr; Back to techengi.in
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {theme === "light" ? "\u263E" : "\u2600"}
          </button>
        </div>

        <div className="w-full max-w-[460px] mx-auto my-auto py-8">
          <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
            How will you use Tech Engi?
          </h1>
          <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
            Choose the option that fits you. It sets up your dashboard.
          </p>

          {notice && (
            <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
              {notice}
            </div>
          )}

          <div className="mt-7 grid gap-4">
            {OPTIONS.map((o) => (
              <Link
                key={o.role}
                href={`${o.href}${qs}`}
                onMouseEnter={() => setHovered(o.role)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(o.role)}
                onBlur={() => setHovered(null)}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#f0b31e] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f0b31e]/30 active:translate-y-[1px] dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{o.title}</span>
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{o.tag}</span>
                </div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-400">{o.desc}</p>
                <span className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#f0b31e] px-4 font-bold text-slate-950 transition-colors group-hover:bg-[#ffc543]">
                  {o.cta}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-7 border-t border-slate-200 pt-5 text-center sm:text-left text-[15px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href={`/login${qs}`}
              className="font-semibold text-[#c48d08] underline-offset-2 hover:underline dark:text-[#f0b31e]"
            >
              Log in
            </Link>
          </div>
        </div>

        <p className="pt-6 font-mono text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
          TSquareY1 OPC Private Limited, Chennai, Tamil Nadu &middot; techengi.in
        </p>
      </div>

      <AuthBrandSide role={hovered ?? "CLIENT"} />
    </div>
  );
}
