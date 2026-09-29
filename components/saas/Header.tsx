"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { href: "#who", label: "Platform" },
  { href: "#how", label: "How it works" },
  { href: "#leads", label: "Leads" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close if the screen grows to desktop width
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-[9] border-b border-saas-line/80 bg-saas-bg/78 backdrop-blur-[14px]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 md:h-[76px] md:px-8">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold text-saas-ink sm:gap-2.5 sm:text-xl"
          onClick={() => setOpen(false)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7B95F5"
            strokeWidth={1.8}
            strokeLinejoin="round"
            className="h-6 w-6 sm:h-7 sm:w-7"
          >
            <path d="M12 2l8.5 5v10L12 22 3.5 17V7z" />
            <path d="M12 22V12M12 12L3.5 7M12 12l8.5-5" />
          </svg>
          Tech Engi
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-[0.95rem] md:flex lg:gap-9">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-saas-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-outline btn-sm hidden sm:inline-flex">
            Login
          </Link>
          <Link href="/register" className="btn btn-sm whitespace-nowrap">
            Get started
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-saas-line bg-white text-saas-ink transition-colors hover:border-saas-accent/40 md:hidden"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-nav"
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            className={`mx-auto flex max-w-[1200px] flex-col px-4 pb-4 pt-1 transition-opacity duration-300 sm:px-6 ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!open}
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="border-b border-saas-line/70 py-3.5 text-base text-saas-tx transition-colors hover:text-saas-ink"
              >
                {l.label}
              </a>
            ))}

            {/* Login lives here on phones, since the header button is hidden below sm */}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="btn-outline mt-4 sm:hidden"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}