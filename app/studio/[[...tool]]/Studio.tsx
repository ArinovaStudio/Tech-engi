"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";
import Link from "next/link";
import { KeyRound, ArrowRight, Sparkles } from "lucide-react";

export function Studio() {
  const configured = isSanityConfigured();

  if (!configured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050a30] px-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
            <KeyRound size={28} />
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Sparkles size={13} />
            Sanity CMS Ready
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Connect Your Sanity Project
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sanity Studio and dynamic blog routing are completely configured for Tech Engi. To activate the live CMS editor, add your credentials in <code className="rounded bg-white/10 px-1.5 py-0.5 text-amber-300 font-mono text-xs">.env</code>:
          </p>

          <div className="mt-6 overflow-hidden rounded-xl bg-black/50 p-4 font-mono text-xs text-amber-200/90 border border-white/5">
            <p className="text-slate-400"># .env</p>
            <p className="mt-1 text-emerald-400">NEXT_PUBLIC_SANITY_PROJECT_ID=&quot;your_project_id&quot;</p>
            <p className="text-emerald-400">NEXT_PUBLIC_SANITY_DATASET=&quot;production&quot;</p>
            <p className="text-emerald-400">NEXT_PUBLIC_SANITY_API_VERSION=&quot;2024-03-15&quot;</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#050a30] transition hover:bg-slate-200"
            >
              Go to Blog
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open Sanity Manage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
