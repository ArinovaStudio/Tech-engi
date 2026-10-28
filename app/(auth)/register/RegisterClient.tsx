"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

type AccountRole = "CLIENT" | "ENGINEER";

export default function RegisterClient() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<AccountRole>("CLIENT");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP step
  const [otpCode, setOtpCode] = useState("");
  const [otpSentMsg, setOtpSentMsg] = useState("");

  // Validation & errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Strength score: 0 to 4
  const calculateStrength = (val: string) => {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[^A-Za-z0-9]/.test(val) || (/[A-Za-z]/.test(val) && /\d/.test(val))) score++;
    if (val.length >= 16) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const STRENGTH_LABELS = [
    "Use 8+ characters. A short phrase beats a complicated word.",
    "Too short",
    "Weak — add length",
    "Good",
    "Strong",
  ];

  const strengthLabel = password ? STRENGTH_LABELS[Math.min(strengthScore, 4)] : STRENGTH_LABELS[0];

  const getStrengthBarColor = (score: number) => {
    if (score <= 1) return "bg-rose-500";
    if (score === 2) return "bg-[#f0b31e]";
    return "bg-emerald-500";
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (nameError && val.trim().length >= 2) {
      setNameError("");
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError && EMAIL_REGEX.test(val.trim())) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError && val.length >= 8) {
      setPasswordError("");
    }
  };

  const validate = () => {
    let isValid = true;

    if (name.trim().length < 2) {
      setNameError("Please enter your full name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Create account
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok || !registerData.success) {
        throw new Error(registerData.message || "Registration failed");
      }

      // 2. Try sending verification OTP
      try {
        const otpRes = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), type: "VERIFY_EMAIL" }),
        });

        const otpData = await otpRes.json();

        if (otpRes.ok && otpData.success) {
          setOtpSentMsg(`We've sent a 6-digit verification code to ${email.trim()}`);
          setStep(2);
          setLoading(false);
          return;
        }
      } catch (otpErr) {
        console.warn("OTP sending skipped or failed, proceeding to direct signin", otpErr);
      }

      // If OTP failed or skipped in dev, sign in automatically
      const signInRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Redirect to login if signin failed
        router.push("/login");
        return;
      }

      const callbackUrl = role === "ENGINEER" ? "/form/engineer" : "/form/client";
      window.location.href = callbackUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred during registration. Please try again.";
      setGeneralError(msg);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (otpCode.trim().length !== 6) {
      setGeneralError("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: otpCode.trim(),
          type: "VERIFY_EMAIL",
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || "Invalid verification code.");
      }

      const signInRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
        return;
      }

      const callbackUrl = role === "ENGINEER" ? "/form/engineer" : "/form/client";
      window.location.href = callbackUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed. Please check the code and try again.";
      setGeneralError(msg);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setGeneralError("");
      const otpRes = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "VERIFY_EMAIL" }),
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok || !otpData.success) {
        throw new Error(otpData.message || "Failed to resend code.");
      }
      setOtpSentMsg("A fresh 6-digit verification code has been sent.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setGeneralError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = (provider: "google" | "github") => {
    setGeneralError("");
    // Store selected role in cookie so the OAuth callback knows which role to assign
    document.cookie = `oauth_role=${role}; path=/; max-age=120`;
    const callbackUrl = role === "ENGINEER" ? "/form/engineer" : "/form/client";
    signIn(provider, { callbackUrl });
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
                /* Moon */
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
                /* Sun */
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
        <div className="w-full max-w-[420px] mx-auto my-auto py-6">
          {step === 1 ? (
            <>
              <div>
                <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
                  Create your account.
                </h1>
                <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
                  Free to join. Nothing to pay to get started.
                </p>
              </div>

              {/* Segmented Role Control */}
              <div
                role="group"
                aria-label="Account type"
                className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-800 dark:bg-slate-900/90"
              >
                <button
                  type="button"
                  aria-pressed={role === "CLIENT"}
                  onClick={() => setRole("CLIENT")}
                  className={`flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl py-2 px-3 text-[14.5px] font-semibold transition-all cursor-pointer ${
                    role === "CLIENT"
                      ? "bg-[#f0b31e] text-slate-950 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>I&apos;m hiring</span>
                  <span
                    className={`font-mono text-[10px] font-semibold tracking-wider uppercase ${
                      role === "CLIENT" ? "text-slate-900/80" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    CLIENT
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={role === "ENGINEER"}
                  onClick={() => setRole("ENGINEER")}
                  className={`flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl py-2 px-3 text-[14.5px] font-semibold transition-all cursor-pointer ${
                    role === "ENGINEER"
                      ? "bg-[#f0b31e] text-slate-950 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>I&apos;m building</span>
                  <span
                    className={`font-mono text-[10px] font-semibold tracking-wider uppercase ${
                      role === "ENGINEER" ? "text-slate-900/80" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    ENGINEER
                  </span>
                </button>
              </div>

              {/* OAuth Buttons */}
              <div className="mt-6 grid gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleOAuthRegister("google")}
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
                  <span>Sign up with Google</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleOAuthRegister("github")}
                  className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-slate-900 bg-slate-950 font-semibold text-white shadow-xs hover:bg-slate-900 active:translate-y-[1px] dark:border-slate-800 dark:bg-[#111622] dark:hover:bg-[#1a2133] cursor-pointer transition-all duration-150"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                    <path d="M9 0a9 9 0 00-2.8 17.5c.4.1.6-.2.6-.5v-1.7c-2.5.6-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.3-2-.2-4.1-1-4.1-4.5 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8.4 8.4 0 014.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.4 0 3.5-2.1 4.3-4.1 4.5.3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A9 9 0 009 0z" />
                  </svg>
                  <span>Sign up with GitHub</span>
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

              {/* Registration Form */}
              <form id="regForm" onSubmit={handleRegister} noValidate className="space-y-4">
                {/* Full name Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="rgName"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                    >
                      Full name
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="rgName"
                      name="fullname"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Priya Raman"
                      aria-invalid={nameError ? "true" : "false"}
                      aria-describedby={nameError ? "rgNameErr" : undefined}
                      required
                      className={`min-h-[52px] w-full rounded-xl border px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 ${
                        nameError
                          ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p id="rgNameErr" role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="rgEmail"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                    >
                      Email
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="rgEmail"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="you@company.in"
                      aria-invalid={emailError ? "true" : "false"}
                      aria-describedby={emailError ? "rgEmailErr" : undefined}
                      required
                      className={`min-h-[52px] w-full rounded-xl border px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 ${
                        emailError
                          ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p id="rgEmailErr" role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Field + Strength Meter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="rgPass"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="rgPass"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="At least 8 characters"
                      aria-invalid={passwordError ? "true" : "false"}
                      aria-describedby="rgPassErr rgMeterLabel"
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
                          <line x1="2" y1="22" y2="22" />
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

                  {/* 4-bar Strength Meter */}
                  <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((barIndex) => {
                      const isActive = barIndex <= strengthScore;
                      return (
                        <i
                          key={barIndex}
                          className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                            isActive
                              ? getStrengthBarColor(strengthScore)
                              : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p
                    id="rgMeterLabel"
                    role="status"
                    className="mt-1.5 font-mono text-[11px] tracking-wide text-slate-500 dark:text-slate-400 min-h-[16px]"
                  >
                    {strengthLabel}
                  </p>

                  {passwordError && (
                    <p id="rgPassErr" role="alert" className="mt-1.5 text-[13.5px] font-medium text-rose-500">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Engineer-only Notice */}
                {role === "ENGINEER" && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-emerald-500/25 bg-emerald-50/70 p-3.5 text-[13.5px] leading-relaxed text-slate-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-slate-300 transition-all">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5"
                    >
                      <circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M5.6 8.7l2 2 3.9-4.3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>
                      <strong className="font-semibold text-slate-900 dark:text-white">
                        Verification comes later, not now.
                      </strong>{" "}
                      Aadhaar, PAN and proof of experience are collected from your dashboard before your first match. They&apos;re never shown to clients.
                    </span>
                  </div>
                )}

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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Create account</span>
                  )}
                </button>
              </form>

              {/* Legal Note */}
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                By creating an account you agree to our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="font-medium text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] underline-offset-2 hover:underline transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] underline-offset-2 hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Swap to Login Link */}
              <div className="mt-7 border-t border-slate-200 pt-5 text-center sm:text-left text-[15px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] underline-offset-2 hover:underline transition-colors"
                >
                  Log in
                </Link>
              </div>
            </>
          ) : (
            /* Step 2: OTP Verification */
            <div className="py-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 7H1M7 1L1 7l6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Back to registration</span>
              </button>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Verify your email.
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {otpSentMsg || `We sent a 6-digit verification code to ${email}`}
              </p>

              {generalError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
                >
                  {generalError}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="otpInput"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                  >
                    6-Digit Verification Code
                  </label>
                  <input
                    id="otpInput"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="mt-2 min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-center font-mono text-2xl tracking-[0.3em] font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#f0b31e] focus:outline-none focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Verify and continue</span>
                  )}
                </button>

                <div className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-semibold text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] cursor-pointer hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mini Footer */}
        <p className="pt-6 font-mono text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-center sm:text-left">
          TSquareY1 OPC Private Limited, Chennai, Tamil Nadu &middot; techengi.in
        </p>
      </div>

      {/* ================= RIGHT: BRAND + TRUST SIDE ================= */}
      <AuthBrandSide role={role} />
    </div>
  );
}
