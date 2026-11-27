"use client";
import { useEffect } from "react";

const COOKIE = "te_ref";
const DAYS = 30;

/** Stores ?ref=CODE in a 30-day cookie so signup can attribute the new user. */
export default function ReferralCapture() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref")?.trim().toUpperCase();
    if (!ref || !/^[A-Z0-9][A-Z0-9_-]{3,31}$/.test(ref)) return;
    document.cookie = `${COOKIE}=${encodeURIComponent(ref)}; path=/; max-age=${DAYS * 86400}; SameSite=Lax`;
  }, []);
  return null;
}
