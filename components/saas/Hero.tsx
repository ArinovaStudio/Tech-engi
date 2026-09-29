"use client";

import { useRef, useState } from "react";
import { gsap } from "@/components/saas/gsapClient";
import HeroTiles from "@/components/saas/HeroTiles";

type ViewKey = "client" | "engineer" | "corporate";

type View = {
  line1: string;
  line2: string;
  sub: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const VIEWS: Record<ViewKey, View> = {
  client: {
    line1: "Get projects built.",
    line2: "Get projects finished.",
    sub: "Tech Engi brings clients, engineers and students into one workspace. Start a project from zero, or hand over one that stalled halfway.",
    primary: { label: "Start a project", href: "#leads" },
    secondary: { label: "Find engineering work", href: "#who" },
  },
  engineer: {
    line1: "Get work that fits.",
    line2: "Finish what you started.",
    sub: "Find leads that match your skills, join a team, or bring in a partner to finish your own unfinished build.",
    primary: { label: "Browse leads", href: "#leads" },
    secondary: { label: "See how it works", href: "#how" },
  },
  corporate: {
    line1: "Your bug doesn't wait for Monday.",
    line2: "Neither do we.",
    sub: "Post the problem. Get matched with a verified engineer in hours. Pay only when it's fixed — just 5% platform fee.",
    primary: { label: "Post your first task", href: "#leads" },
    secondary: { label: "Register free", href: "/register/client" },
  },
};

const ORDER: ViewKey[] = ["client", "engineer", "corporate"];

export default function Hero() {
  const [view, setView] = useState<ViewKey>("engineer");

  const rootRef = useRef<HTMLElement>(null);

  const v = VIEWS[view];

  const toggle = () => {
    const root = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const next = ORDER[(ORDER.indexOf(view) + 1) % ORDER.length];

    if (!root || reduced) {
      setView(next);
      return;
    }

    const targets = root.querySelectorAll(".line-text, .hero-sub, .hero-cta");

    gsap
      .timeline()
      .to(targets, { y: -14, opacity: 0, duration: 0.2, stagger: 0.03 })
      .add(() => setView(next))
      .fromTo(
        targets,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" }
      );
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[max(680px,calc(100svh-64px))] flex-col justify-between overflow-hidden pt-8 sm:pt-10 md:min-h-[max(820px,calc(100svh-76px))] md:pt-[52px]"
    >
      {/* Gradient glow */}
      <div
        className="pointer-events-none absolute inset-x-[-8%] top-[-10%] h-[45%] opacity-60 blur-3xl md:h-[55%]"
        style={{
          background:
            "radial-gradient(38% 65% at 14% 22%, rgba(110,168,255,.5), transparent 72%), radial-gradient(34% 60% at 58% 6%, rgba(185,140,246,.44), transparent 72%), radial-gradient(30% 60% at 96% 26%, rgba(245,162,107,.42), transparent 72%)",
        }}
      />

      {/* Faint vertical grid (fewer, wider columns on phones) */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(8.333% - 1px), rgba(15,27,61,.05) calc(8.333% - 1px) 8.333%)",
          WebkitMaskImage: "linear-gradient(#000, transparent 65%)",
          maskImage: "linear-gradient(#000, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 sm:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(25% - 1px), rgba(15,27,61,.05) calc(25% - 1px) 25%)",
          WebkitMaskImage: "linear-gradient(#000, transparent 65%)",
          maskImage: "linear-gradient(#000, transparent 65%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-[2] mx-auto w-full max-w-none px-[clamp(20px,5vw,80px)]">
        <div className="max-w-[1100px] pb-20 sm:pb-28 md:pb-32">
                   <div className="my-5 flex sm:my-6">
            <button
              type="button"
              aria-label="Switch between client, engineer and corporate view"
              onClick={toggle}
              className="view-switch hero-entrance hero-entrance-delay-2"
              data-view={view} 
            >
              <span>Client</span>
              <span>Engineer</span>
              <span>Corporate</span>
            <i className="knob" />  
            </button>
          </div>

          <h1 className="text-[clamp(2.25rem,5.4vw,4.5rem)]">
            {/* First line */}
            <b className="line-mask block overflow-hidden pb-[0.08em]">
              <span className="line-text hero-title-text hero-entrance block">
                <em className="text-inset not-italic text-saas-ink">{v.line1}</em>
              </span>
            </b>

            {/* Second line */}
            <b className="line-mask block overflow-hidden pb-[0.08em]">
              <span className="line-text text-inset block text-saas-mut hero-entrance hero-entrance-delay-1">
                {v.line2}
              </span>
            </b>
          </h1>

          {/* Toggle: between the headline and the sub heading */}

          <p className="hero-sub hero-entrance hero-entrance-delay-2 mt-5 max-w-[520px] text-base sm:mt-6 sm:text-[1.15rem]">
            {v.sub}
          </p>

          <div className="hero-cta hero-entrance hero-entrance-delay-3 mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <a href={v.primary.href} className="btn w-full sm:w-auto">
              {v.primary.label}
            </a>
            <a href={v.secondary.href} className="btn-outline w-full sm:w-auto">
              {v.secondary.label}
            </a>
          </div>
        </div>
      </div>

      <HeroTiles />
    </section>
  );
}