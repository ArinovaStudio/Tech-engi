"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

export default function LoginClient() {
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError && EMAIL_REGEX.test(val.trim())) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError && val.length > 0) {
      setPasswordError("");
    }
  };

  const validate = () => {
    let isValid = true;
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setGeneralError(res.error);
        setLoading(false);
        return;
      }

      window.location.href = "/api/auth/role-redirect";
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    setGeneralError("");
    signIn(provider, { callbackUrl: "/api/auth/role-redirect" });
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
                /* Moon Icon */
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
                /* Sun Icon */
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
            <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
              Welcome back.
            </h1>
            <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
              Log in to your Tech Engi account.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-7 grid gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 shadow-xs hover:bg-slate-50 hover:shadow-sm active:translate-y-[1px] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.5h4.8a4.1 4.1 0 01-1.8 2.7v2.2h2.9a8.8 8.8 0 002.7-6.6z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18a8.7 8.7 0 006-2.2l-2.9-2.2a5.4 5.4 0 01-8.1-2.9H1v2.3A9 9 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M4 10.7a5.4 5.4 0 010-3.4V5H1a9 9 0 000 8z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.6a4.9 4.9 0 013.4 1.3l2.6-2.6A8.7 8.7 0 009 0 9 9 0 001 5l3 2.3A5.4 5.4 0 019 3.6z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-slate-900 bg-slate-950 font-semibold text-white shadow-xs hover:bg-slate-900 active:translate-y-[1px] dark:border-slate-800 dark:bg-[#111622] dark:hover:bg-[#1a2133] cursor-pointer transition-all duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <path d="M9 0a9 9 0 00-2.8 17.5c.4.1.6-.2.6-.5v-1.7c-2.5.6-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.3-2-.2-4.1-1-4.1-4.5 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8.4 8.4 0 014.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.4 0 3.5-2.1 4.3-4.1 4.5.3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A9 9 0 009 0z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white px-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-slate-400 dark:bg-[#070b14] dark:text-slate-500 uppercase">
              OR WITH EMAIL
            </span>
          </div>

          {/* General Error Notice */}
          {generalError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {generalError}
            </div>
          )}

          {/* Form */}
          <form id="loginForm" onSubmit={handleCredentialsLogin} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="liEmail"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                >
                  Email
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  id="liEmail"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@company.in"
                  aria-invalid={emailError ? "true" : "false"}
                  aria-describedby={emailError ? "liEmailErr" : undefined}
                  required
                  className={`min-h-[52px] w-full rounded-xl border px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 ${
                    emailError
                      ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  }`}
                />
              </div>
              {emailError && (
                <p id="liEmailErr" role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="liPass"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  id="liPass"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Your password"
                  aria-invalid={passwordError ? "true" : "false"}
                  aria-describedby={passwordError ? "liPassErr" : undefined}
                  required
                  className={`min-h-[52px] w-full rounded-xl border pl-4 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 ${
                    passwordError
                      ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    /* Eye Off */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 10S4.8 4.5 10 4.5 18.5 10 18.5 10 15.2 15.5 10 15.5 1.5 10 1.5 10z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="liPassErr" role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          {/* Swap Link */}
          <div className="mt-7 border-t border-slate-200 pt-5 text-center sm:text-left text-[15px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] underline-offset-2 hover:underline transition-colors"
            >
              Create one free
            </Link>
          </div>
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
