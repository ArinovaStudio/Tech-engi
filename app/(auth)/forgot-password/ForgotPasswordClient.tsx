"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGeneralError("");
    setEmailError("");

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "RESET_PASSWORD" }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpSent(true);
        toast.success(data.message || "Verification code sent to your email.");
      } else {
        const msg = data.message || "Failed to send verification code.";
        setGeneralError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Failed to send verification code. Please try again.";
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setOtpError("");

    if (otp.trim().length !== 6) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: otp.trim(),
          type: "RESET_PASSWORD",
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpVerified(true);
        toast.success(data.message || "Code verified. Please set your new password.");
      } else {
        const msg = data.message || "Invalid or expired verification code.";
        setOtpError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Verification failed. Please try again.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Password reset successfully. Please log in.");
        router.push("/login");
      } else {
        const msg = data.message || "Failed to reset password.";
        setGeneralError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "An error occurred while resetting password.";
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors duration-200">
      {/* ================= LEFT: FORM SIDE ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-4 pb-6">
          <Link
            href="/login"
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
            <span>Back to Log in</span>
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
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          <div>
            <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
              Reset password.
            </h1>
            <p className="mt-2 text-[15.5px] text-slate-500 dark:text-slate-400">
              Enter the email address registered with your account to receive a verification code.
            </p>
          </div>

          {/* General Error Notice */}
          {generalError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {generalError}
            </div>
          )}

          <div className="mt-7 space-y-5">
            {/* Step 1: Email Address */}
            <form onSubmit={handleSendOtp} noValidate className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="fpEmail"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                  >
                    Email Address
                  </label>
                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={loading}
                      className="text-[12px] font-semibold text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] cursor-pointer hover:underline disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    id="fpEmail"
                    name="email"
                    type="email"
                    disabled={otpSent}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="you@company.in"
                    aria-invalid={emailError ? "true" : "false"}
                    required
                    className={`min-h-[52px] w-full rounded-xl border px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 ${
                      emailError
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                        : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                    } ${otpSent ? "opacity-75 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50" : ""}`}
                  />
                </div>
                {emailError && (
                  <p role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                    {emailError}
                  </p>
                )}
              </div>

              {!otpSent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                      <span>Sending code...</span>
                    </div>
                  ) : (
                    <span>Send verification code</span>
                  )}
                </button>
              )}
            </form>

            {/* Step 2: Verification Code */}
            {otpSent && !otpVerified && (
              <form onSubmit={handleVerifyOtp} noValidate className="space-y-4 pt-2">
                <div>
                  <label
                    htmlFor="fpOtp"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                  >
                    6-Digit Verification Code
                  </label>
                  <input
                    id="fpOtp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      if (otpError) setOtpError("");
                    }}
                    placeholder="123456"
                    className={`mt-2 min-h-[52px] w-full rounded-xl border px-4 text-center font-mono text-2xl tracking-[0.3em] font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:outline-none dark:text-white dark:placeholder:text-slate-600 ${
                      otpError
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                        : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                    }`}
                  />
                  {otpError && (
                    <p role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                      {otpError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyLoading || otp.length !== 6}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {verifyLoading ? (
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
                    <span>Verify code</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {otpVerified && (
              <form onSubmit={handleResetPassword} noValidate className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="fpNewPass"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase"
                    >
                      New Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="fpNewPass"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="At least 8 characters"
                      aria-invalid={passwordError ? "true" : "false"}
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
                    <p role="alert" className="mt-2 text-[13.5px] font-medium text-rose-500">
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resetLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Updating password...</span>
                    </div>
                  ) : (
                    <span>Save new password</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Swap Link */}
          <div className="mt-8 border-t border-slate-200 pt-5 text-center sm:text-left text-[15px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Remembered your credentials?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#c48d08] hover:text-[#a07204] dark:text-[#f0b31e] dark:hover:text-[#ffc543] underline-offset-2 hover:underline transition-colors"
            >
              Log in
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
