"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const COMPANY = [
  { label: "Join as Builder", href: "/register/engineer" },
  { label: "Start a Project", href: "/register/client" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and conditions", href: "/terms-and-conditions" },
];

const LEGAL = [
  { label: "Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tsquarey1",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tsy1_tech.engi?igsh=MTdvNnZzdHpvb215bg%3D%3D&utm_source=qr",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtu.be/7jniNW5R2R0",
    icon: <path d="M22 8.5a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.4A3 3 0 0 0 2 8.5 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.5a3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.4a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.3.4-3.5s-.1-2.3-.4-3.5zM10 15V9l5 3z" />,
  },
];

const btn =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const link =
  "text-base !text-white underline-offset-4 hover:underline focus-visible:underline";
const colTitle = "text-sm font-medium !text-white/75";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/subscribemail", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Thank you for subscribing");
        setEmail("");
      } else toast.error("Sorry for the inconvenience");
    } catch {
      toast.error("Error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="pb-5 pt-4 sm:pb-8">
      <div className="mx-auto max-w-full px-5 sm:px-8">
        <div
          className="reveal relative overflow-hidden rounded-saas-6xl p-7 text-white sm:p-12 lg:p-16"
          style={{
            // dark brown at the bottom, rising to amber at the top
            background: "linear-gradient(to top, #1F1000 0%, #6B3A06 40%, #B8620A 75%, #DB8A0C 100%)",
          }}
        >
          {/* CTA */}
          <div className="flex flex-col gap-8 border-b border-white/25 pb-10 sm:pb-14 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-[clamp(2.1rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.045em] !text-white">
              Start or finish your project with a verified engineer.
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row w-1/4">
              <Link href="/register/client" className={`${btn} bg-white !text-[#8F4F04] hover:bg-white/90 w-full`}>
                Start a Project
              </Link>
              <Link href="/register/engineer" className={`${btn} border border-white/40 !text-white hover:bg-white/10 w-full`}>
                Join as Builder
              </Link>
            </div>
          </div>

          {/* brand + links + subscribe */}
          <div className="grid gap-10 py-10 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.3fr_0.9fr_1fr_1.4fr] lg:gap-10">
            <div>
              <p className="max-w-[26ch] text-xl font-semibold leading-snug tracking-tight !text-white">
                Connecting engineering talent with innovative projects worldwide.
              </p>
            </div>

            <nav aria-label="Company">
              <h3 className={colTitle}>Company</h3>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {COMPANY.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className={colTitle}>Contact info</h3>
              <ul className="mt-4 grid list-none gap-3 p-0">
                <li>
                  <a href="mailto:techengi@tsquarey.tech" className={`${link} break-all`}>
                    techengi@tsquarey.tech
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={colTitle}>Newsletter</h3>
              <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="h-12 w-full min-w-0 rounded-full border border-white/30 bg-white/10 px-5 text-sm !text-white outline-none placeholder:text-white/60 focus:border-white"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className={`${btn} shrink-0 bg-white !text-[#8F4F04] hover:bg-white/90 disabled:opacity-60`}
                >
                  {sending ? "Sending…" : "Subscribe"}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/30 !text-white transition-colors duration-200 hover:bg-white hover:!text-[#8F4F04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={s.label === "YouTube" ? "currentColor" : "none"}
                      stroke={s.label === "YouTube" ? "none" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* legal row */}
          <div className="flex flex-col gap-3 border-t border-white/25 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="!text-white/80">© {new Date().getFullYear()} TSquareY1 OPC Private limited</p>
            <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="!text-white/80 underline-offset-4 hover:underline focus-visible:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* big outlined wordmark, bleeding off the bottom edge */}
          <div
            aria-hidden
            className="pointer-events-none -mx-7 -mb-7 mt-8 select-none overflow-hidden text-center sm:-mx-12 sm:-mb-12 lg:-mx-16 lg:-mb-16"
          >
            <div
              className="translate-y-[0%] text-[clamp(3.5rem,13.5vw,13rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-transparent"
              style={{ WebkitTextStroke: "1.75px #ffffff" }}
            >
              Tech Engi
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}