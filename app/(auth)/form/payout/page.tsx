"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

export default function PayoutFormPage() {
  const { theme, toggleTheme } = useTheme();

  const [method, setMethod] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "UPI") {
      const upiTrimmed = upiId.trim();
      if (!upiTrimmed) {
        setError("Please enter your UPI ID.");
        return;
      }

      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(upiTrimmed)) {
        setError("Invalid UPI ID format. Example: yourname@okaxis");
        return;
      }
    }

    if (method === "BANK") {
      const accTrimmed = accountNumber.trim();
      const ifscTrimmed = ifscCode.trim().toUpperCase();
      const bankTrimmed = bankName.trim();
      const holderTrimmed = accountHolder.trim();

      if (!accTrimmed || !ifscTrimmed || !bankTrimmed || !holderTrimmed) {
        setError("All bank details (Account Number, IFSC, Bank Name, Account Holder) are required.");
        return;
      }

      const accountRegex = /^\d{9,18}$/;
      if (!accountRegex.test(accTrimmed)) {
        setError("Invalid Account Number. It should be between 9 and 18 digits.");
        return;
      }

      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifscTrimmed)) {
        setError("Invalid IFSC Code format. Example: SBIN0001234");
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/payout/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredMethod: method,
          upiId: method === "UPI" ? upiId.trim() : null,
          accountNumber: method === "BANK" ? accountNumber.trim() : null,
          ifscCode: method === "BANK" ? ifscCode.trim().toUpperCase() : null,
          bankName: method === "BANK" ? bankName.trim() : null,
          accountHolder: method === "BANK" ? accountHolder.trim() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update payout details.");
      }

      window.location.href = "/api/auth/role-redirect";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update payout details.";
      setError(msg);
      setIsLoading(false);
    }
  };

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
              DIRECT ESCROW PAYOUT
            </span>
            <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
              Payout details.
            </h1>
            <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
              Where should milestone disbursements and project payouts be released?
            </p>
          </div>

          {/* Method Toggle */}
          <div
            role="group"
            aria-label="Payment Method"
            className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-800 dark:bg-slate-900/90"
          >
            <button
              type="button"
              aria-pressed={method === "UPI"}
              onClick={() => {
                setMethod("UPI");
                setError("");
              }}
              className={`flex min-h-[46px] items-center justify-center rounded-xl py-2 px-3 text-[14px] font-semibold transition-all cursor-pointer ${
                method === "UPI"
                  ? "bg-[#f0b31e] text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              UPI Transfer
            </button>

            <button
              type="button"
              aria-pressed={method === "BANK"}
              onClick={() => {
                setMethod("BANK");
                setError("");
              }}
              className={`flex min-h-[46px] items-center justify-center rounded-xl py-2 px-3 text-[14px] font-semibold transition-all cursor-pointer ${
                method === "BANK"
                  ? "bg-[#f0b31e] text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Bank Account
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {method === "UPI" ? (
              <div>
                <label
                  htmlFor="payoutUpi"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  UPI ID *
                </label>
                <input
                  id="payoutUpi"
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                  placeholder="yourname@okaxis"
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="accHolder"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                  >
                    Account Holder Name *
                  </label>
                  <input
                    id="accHolder"
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Full name as on bank passbook"
                    className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="accNum"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                  >
                    Account Number *
                  </label>
                  <input
                    id="accNum"
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter account number"
                    className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="ifsc"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                    >
                      IFSC Code *
                    </label>
                    <input
                      id="ifsc"
                      type="text"
                      required
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm uppercase text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bankName"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                    >
                      Bank Name *
                    </label>
                    <input
                      id="bankName"
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                    />
                  </div>
                </div>
              </div>
            )}

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
                  <span>Saving payout details...</span>
                </div>
              ) : (
                <span>Save & Continue</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/role-redirect";
              }}
              className="w-full pt-3 text-center text-sm font-semibold text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          </form>
        </div>

        {/* Mini Footer */}
        <p className="pt-6 font-mono text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-center sm:text-left">
          TSquareY1 OPC Private Limited, Chennai, Tamil Nadu &middot; techengi.in
        </p>
      </div>

      {/* ================= RIGHT: BRAND + TRUST SIDE ================= */}
      <AuthBrandSide role="ENGINEER" />
    </div>
  );
}
