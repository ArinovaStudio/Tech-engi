"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

export default function ClientFormPage() {
  const router = useRouter();
  const { status } = useSession();
  const { theme, toggleTheme } = useTheme();

  const [totalProjects, setTotalProjects] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const addExpertise = () => {
    const val = expertiseInput.trim();
    if (val && !expertise.includes(val)) {
      setExpertise([...expertise, val]);
    }
    setExpertiseInput("");
  };

  const removeExpertise = (tag: string) => {
    setExpertise(expertise.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (expertise.length === 0) {
      setError("Please add at least one area of expertise.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalProjects: parseInt(totalProjects, 10) || 0,
          totalBudget: parseFloat(totalBudget) || 0,
          expertise,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save profile.");
      }

      router.push("/client");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070b14] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <svg className="h-6 w-6 animate-spin text-[#f0b31e]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="font-mono text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors duration-200">
      {/* ================= LEFT: FORM SIDE ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-4 pb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path
                d="M15 7H1M7 1L1 7l6 6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to techengi.in</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === "light" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* Mobile Brandmark */}
            <div className="flex lg:hidden items-center gap-2 font-black text-slate-900 dark:text-white">
              <span className="font-mono text-[#f0b31e]">{`{ }`}</span>
              <span className="text-sm tracking-tight">Tech Engi</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          <div>
            <span className="inline-block rounded-full bg-[#f0b31e]/15 px-3 py-1 font-mono text-[11px] font-bold text-[#b8850a] dark:text-[#f0b31e] tracking-wider uppercase mb-3">
              CLIENT ONBOARDING
            </span>
            <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
              Complete your profile.
            </h1>
            <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
              Tell us a bit about your past project history and technical requirements.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {/* Total Projects Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="clProjects"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                >
                  Total Projects Done
                </label>
              </div>
              <input
                id="clProjects"
                type="number"
                min="0"
                value={totalProjects}
                onChange={(e) => setTotalProjects(e.target.value)}
                placeholder="e.g. 5"
                className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
              />
            </div>

            {/* Total Budget Spent Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="clBudget"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                >
                  Total Budget Spent (₹)
                </label>
              </div>
              <input
                id="clBudget"
                type="number"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="e.g. 50000"
                className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
              />
            </div>

            {/* Areas of Expertise Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="clExpertise"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                >
                  Areas of Expertise
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  id="clExpertise"
                  type="text"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExpertise();
                    }
                  }}
                  placeholder="e.g. Next.js, Embedded, AI..."
                  className="min-h-[52px] flex-1 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  aria-label="Add expertise tag"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#f0b31e] text-slate-950 font-bold transition-all hover:bg-[#ffc543] active:translate-y-[1px] cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() => removeExpertise(tag)}
                        className="text-amber-700 hover:text-amber-950 dark:text-amber-300 dark:hover:text-white cursor-pointer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving profile...</span>
                </div>
              ) : (
                <span>Save & Continue</span>
              )}
            </button>
          </form>
        </div>

        {/* Mini Footer */}
        <p className="pt-6 font-mono text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-center sm:text-left">
          TSquareY1 OPC Private Limited, Chennai, Tamil Nadu &middot; techengi.in
        </p>
      </div>

      {/* ================= RIGHT: BRAND + TRUST SIDE ================= */}
      <AuthBrandSide role="CLIENT" />
    </div>
  );
}
