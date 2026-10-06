"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  X,
  Crown,
  Clock3,
  FileText,
  Layers3,
  BadgeCheck,
  Funnel,
  BarChart3,
  Zap,
  Infinity,
  Star,
  ShieldCheck,
  CreditCard,
  Headphones,
  ArrowRight,
} from "lucide-react";

interface UpgradeProModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const freeFeatures = [
  {
    icon: Clock3,
    text: "Leads released 24–48 hrs after client posts",
  },
  {
    icon: FileText,
    text: "Capped applications (recommend 5)",
  },
  {
    icon: Layers3,
    text: "Standard queue order",
  },
  {
    icon: BadgeCheck,
    text: "Verified badge",
  },
  {
    icon: Funnel,
    text: "Basic filters (category only)",
  },
  {
    icon: BarChart3,
    text: "No analytics",
  },
];

const proFeatures = [
  {
    icon: Zap,
    text: "Instant, real-time lead visibility",
  },
  {
    icon: Infinity,
    text: "Unlimited applications/bids",
  },
  {
    icon: Star,
    text: "Shown first to clients",
  },
  {
    icon: Crown,
    text: "Pro profile badge",
  },
  {
    icon: Funnel,
    text: "Advanced filters (budget, domain, Layer 1/2/3, saved searches)",
  },
  {
    icon: BarChart3,
    text: "Detailed analytics (match rate, response rate, win rate)",
  },
];

/* ===============================================================
   FIT-TO-SCREEN (desktop)

   On desktop windows (>= 1024px wide) the modal keeps its full
   two-column design and is scaled down as a whole when the window
   is narrow OR short, so everything shrinks together and nothing
   needs scrolling. Below 1024px the normal responsive layout is
   used (single column, scrolls on its own).
=============================================================== */

const DESKTOP_MIN = 1024; // px, viewport width where desktop mode starts
const DESIGN_W = 1240; // px, width the desktop design is built for
const DESIGN_H = 980; // px, height the desktop design needs (no scroll)
const MAX_W = 1400; // px, max modal width at scale 1
const GUTTER = 16; // px, minimum space around the modal
const MIN_SCALE = 0.62; // never shrink below this (keeps text readable)

type Fit = {
  desktop: boolean;
  scale: number;
  width: number;
  maxHeight: number;
};

function getFit(): Fit {
  if (typeof window === "undefined" || window.innerWidth < DESKTOP_MIN) {
    return { desktop: false, scale: 1, width: 0, maxHeight: 0 };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const scale = Math.max(
    MIN_SCALE,
    Math.min(
      1,
      (vw - GUTTER * 2) / DESIGN_W,
      (vh - GUTTER * 2) / DESIGN_H
    )
  );

  return {
    desktop: true,
    scale,
    // layout size is enlarged by 1/scale so the scaled result fits the screen
    width: Math.min(MAX_W, (vw - GUTTER * 2) / scale),
    maxHeight: (vh - GUTTER * 2) / scale,
  };
}

function useModalFit(open: boolean): Fit {
  const [fit, setFit] = useState<Fit>(getFit);

  useEffect(() => {
    if (!open) return;

    const update = () => setFit(getFit());

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [open]);

  return fit;
}

/* ===============================================================
   REVEAL ANIMATIONS
   (disabled automatically for prefers-reduced-motion)
=============================================================== */

const REVEAL_CSS = `
@keyframes upm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes upm-pop {
  from { opacity: 0; transform: translateY(28px) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@keyframes upm-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
@keyframes upm-slide {
  from { opacity: 0; transform: translateX(48px); }
  to { opacity: 1; transform: none; }
}
@keyframes upm-zoom {
  from { opacity: 0; transform: scale(1.07); }
  to { opacity: 1; transform: none; }
}
@keyframes upm-card {
  from { opacity: 0; transform: translateY(22px) scale(0.88); }
  to { opacity: 1; transform: none; }
}
.upm-fade { animation: upm-fade 0.3s ease-out both; }
.upm-pop { animation: upm-pop 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
.upm-rise { animation: upm-rise 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
.upm-slide { animation: upm-slide 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
.upm-zoom { animation: upm-zoom 1.1s cubic-bezier(0.16, 1, 0.3, 1) both; }
.upm-card { animation: upm-card 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .upm-fade, .upm-pop, .upm-rise, .upm-slide, .upm-zoom, .upm-card {
    animation: none;
  }
}
`;

const delay = (ms: number): CSSProperties => ({
  animationDelay: `${ms}ms`,
});

export default function UpgradeProModal({
  open,
  onClose,
  onUpgrade,
}: UpgradeProModalProps) {
  const { desktop, scale, width, maxHeight } = useModalFit(open);

  /*
   * Prevent background scrolling while modal is open.
   */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="upm-fade fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050a30]/55 p-2 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <style>{REVEAL_CSS}</style>

      {/* Fit wrapper: scales the whole modal down on smaller desktop windows */}

      <div
        className={`flex min-h-0 shrink-0 flex-col ${
          desktop
            ? ""
            : "max-h-[96dvh] w-full max-w-[1400px] sm:max-h-[94dvh]"
        }`}
        style={
          desktop
            ? { width, maxHeight, transform: `scale(${scale})` }
            : undefined
        }
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-title"
          className="upm-pop relative flex min-h-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_35px_100px_rgba(5,10,48,0.35)] sm:rounded-[28px]"
        >
          {/* =========================================================
            CLOSE BUTTON
        ========================================================= */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#050a30] shadow-md backdrop-blur transition hover:scale-105 hover:bg-white sm:right-5 sm:top-5 sm:h-11 sm:w-11"
          >
            <X size={21} strokeWidth={1.8} />
          </button>

          {/* =========================================================
            MAIN CONTENT

            Mobile / tablet: single column, this wrapper scrolls as one.
            Desktop: two columns, left side scrolls on its own if needed.
        ========================================================= */}

          <div
            className={`grid min-h-0 flex-1 overscroll-contain ${
              desktop
                ? "grid-cols-[58%_42%] grid-rows-[minmax(0,1fr)] overflow-hidden"
                : "grid-cols-1 overflow-y-auto"
            }`}
          >
            {/* =======================================================
              LEFT SIDE
          ======================================================= */}

            <section
              className={`relative bg-white ${
                desktop
                  ? "overflow-y-auto overscroll-contain px-12 pb-7 pt-10"
                  : "px-5 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-9 md:px-10"
              }`}
            >
              {/* subtle cyber / architectural lines */}

              <CyberLines />

              <div className="relative z-10">
                {/* Small label */}

                <div
                  className="upm-rise mb-4 flex items-center gap-3 pr-12 sm:mb-5 sm:pr-0"
                  style={delay(200)}
                >
                  <div className="flex h-7 w-7 items-center justify-center text-[#ffffff]">
                    <Crown
                      size={19}
                      strokeWidth={2}
                      className="fill-[#ffffff]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#050a30] sm:tracking-[0.32em]">
                      Upgrade to Pro
                    </span>

                    <span className="h-px w-10 bg-[#ffffff] sm:w-16" />
                  </div>
                </div>

                {/* =================================================
                  HEADLINE
              ================================================= */}

                <h1
                  id="upgrade-title"
                  className={`upm-rise max-w-[720px] font-bold tracking-[-0.04em] text-[#050a30] ${
                    desktop
                      ? "text-[56px] leading-[1]"
                      : "text-[30px] leading-[1.05] min-[420px]:text-[34px] sm:text-[44px] sm:leading-[1] md:text-[50px]"
                  }`}
                  style={delay(280)}
                >
                  Get instant access to
                  <br />
                  <span className="text-[#1257e8]">more opportunities</span>
                </h1>

                <p
                  className="upm-rise mt-4 max-w-[670px] text-sm leading-6 text-slate-500 sm:mt-5 sm:text-[16px]"
                  style={delay(360)}
                >
                  Upgrade to Pro and unlock real-time leads, unlimited
                  applications and advanced filters to grow your business
                  faster.
                </p>

                {/* =================================================
                  PLANS
              ================================================= */}

                <div className="mt-6 grid gap-4 sm:mt-7 md:grid-cols-2">
                  {/* FREE */}

                  <FreePlan delay={440} />

                  {/* PRO */}

                  <ProPlan onUpgrade={onUpgrade} delay={540} />
                </div>
              </div>
            </section>

            {/* =======================================================
              RIGHT SIDE / ARTWORK
              (desktop only)
          ======================================================= */}

            <section
              className={`upm-slide relative overflow-hidden bg-[#1257e8] ${
                desktop ? "block" : "hidden"
              }`}
              style={delay(150)}
            >
              {/* background geometry */}

              <RightBackground />

              {/* Top message */}

              <div
                className="upm-fade absolute left-10 top-14 z-20 max-w-[150px]"
                style={delay(600)}
              >
                <p className="text-[12px] font-medium uppercase leading-[1.8] tracking-[0.32em] text-white/70">
                  More
                  <br />
                  clients
                  <br />
                  faster
                  <br />
                  growth
                </p>

                <div className="mt-4 h-px w-10 bg-[#ffffff]" />
              </div>

              {/* Character */}

              <div className="absolute inset-0 z-10 flex items-end justify-center">
                <img
                  src="/saas/pricing.png"
                  alt="Pro member working with new leads"
                  className="upm-zoom h-full w-full max-w-none object-cover object-bottom"
                  style={delay(300)}
                />
              </div>

              {/* Floating New Leads card
                  (outer wrapper animates, inner element keeps the rotation) */}

              <div
                className="upm-card absolute left-[7%] top-[28%] z-30"
                style={delay(750)}
              >
                <div className="w-[150px] -rotate-[7deg] rounded-xl border border-white/40 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white">
                      New Leads
                    </span>

                    <span className="text-[#ffffff]">♥</span>
                  </div>

                  <div className="mt-3 flex items-end gap-1">
                    <span className="h-4 w-1.5 rounded-sm bg-[#ffffff]" />
                    <span className="h-6 w-1.5 rounded-sm bg-[#ffffff]" />
                    <span className="h-9 w-1.5 rounded-sm bg-[#ffffff]" />
                    <span className="h-12 w-1.5 rounded-sm bg-[#ffffff]" />
                  </div>

                  <p className="mt-2 text-xl font-bold text-[#ffffff]">+12</p>
                </div>
              </div>

              {/* Client interested card */}

              <div
                className="upm-card absolute right-[6%] top-[38%] z-30"
                style={delay(900)}
              >
                <div className="w-[150px] rotate-[4deg] rounded-xl border border-white/40 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <div className="h-4 w-4 rounded-full bg-[#ffffff]" />
                    </div>

                    <div>
                      <p className="text-[10px] text-white/60">Client</p>

                      <p className="text-xs font-semibold text-white">
                        Interested
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[75%] rounded-full bg-[#ffffff]" />
                  </div>
                </div>
              </div>

              {/* Crown card */}

              <div
                className="upm-card absolute right-[7%] top-[23%] z-30"
                style={delay(1050)}
              >
                <div className="flex h-16 w-16 rotate-[5deg] items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-md">
                  <Crown
                    size={30}
                    className="fill-[#ffffff] text-[#ffffff]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* =========================================================
            TRUST FOOTER
            Three columns at every size; stacks icon above text on mobile.
        ========================================================= */}

          <div
            className="upm-fade relative z-40 border-t border-slate-100 bg-white px-2 py-3 sm:px-10 sm:py-4"
            style={delay(700)}
          >
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <TrustItem
                icon={CreditCard}
                title="Secure payment"
                description="SSL encrypted"
              />

              <TrustItem
                icon={Headphones}
                title="24/7 support"
                description="We're here to help"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   FREE PLAN
=============================================================== */

function FreePlan({ delay: startDelay = 0 }: { delay?: number }) {
  return (
    <div
      className="upm-rise rounded-[18px] border border-slate-200 bg-white p-5 sm:p-6"
      style={delay(startDelay)}
    >
      <h2 className="text-[22px] font-bold tracking-tight text-[#050a30] sm:text-[24px]">
        Free
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Good to explore and get started.
      </p>

      <div className="mt-4 flex items-baseline gap-2 sm:mt-5">
        <span className="text-[34px] font-bold tracking-[-0.04em] text-[#050a30] sm:text-[38px]">
          ₹0
        </span>

        <span className="text-sm text-slate-500">/month</span>
      </div>

      <div className="my-4 h-px bg-slate-100 sm:my-5" />

      <div className="space-y-3">
        {freeFeatures.map((feature, index) => (
          <Feature
            key={feature.text}
            icon={feature.icon}
            text={feature.text}
            delay={startDelay + 140 + index * 60}
            dark
          />
        ))}
      </div>

      <button
        type="button"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-[#050a30] transition hover:bg-slate-50 sm:mt-6"
      >
        Continue with Free
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

/* ===============================================================
   PRO PLAN
=============================================================== */

function ProPlan({
  onUpgrade,
  delay: startDelay = 0,
}: {
  onUpgrade: () => void;
  delay?: number;
}) {
  return (
    <div
      className="upm-rise relative overflow-hidden rounded-[18px] bg-[#1257e8] p-5 text-white shadow-[0_15px_40px_rgba(18,87,232,0.18)] sm:p-6"
      style={delay(startDelay)}
    >
      {/* subtle technical corner */}

      <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 border-b border-l border-white/20" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[22px] font-bold tracking-tight text-white sm:text-[24px]">
            Pro
          </h2>

          <p className="mt-1 text-sm text-white/75">
            Get instant visibility and more opportunities.
          </p>
        </div>

      </div>

      <div className="mt-4 flex items-baseline gap-2 sm:mt-5">
        <span className="text-[34px] font-bold tracking-[-0.04em] sm:text-[38px]">
          ₹734
        </span>

        <span className="text-sm text-white/70">/month</span>
      </div>

      <div className="my-4 h-px bg-white/15 sm:my-5" />

      <div className="space-y-3">
        {proFeatures.map((feature, index) => (
          <Feature
            key={feature.text}
            icon={feature.icon}
            text={feature.text}
            delay={startDelay + 140 + index * 60}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onUpgrade}
        className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-[#1257e8] transition hover:-translate-y-0.5 hover:shadow-xl sm:mt-6"
      >
        {/* Upgrade to Pro */}
        Coming soon
        {/* <ArrowRight
          size={18}
          className="
            transition-transform
            group-hover:translate-x-1
          "
        /> */}
      </button>
    </div>
  );
}

/* ===============================================================
   FEATURE
=============================================================== */

function Feature({
  icon: Icon,
  text,
  dark = false,
  delay: startDelay = 0,
}: {
  icon: React.ElementType;
  text: string;
  dark?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="upm-rise flex items-start gap-3"
      style={delay(startDelay)}
    >
      <div
        className={`
          mt-0.5
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            dark
              ? "text-[#050a30]"
              : "text-[#ffffff]"
          }
        `}
      >
        <Icon size={17} strokeWidth={2} />
      </div>

      <p
        className={`
          min-w-0
          text-[13px]
          leading-[1.45]
          ${
            dark
              ? "text-slate-600"
              : "text-white/90"
          }
        `}
      >
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   TRUST ITEM
=============================================================== */

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-1.5 py-1 text-center sm:flex-row sm:gap-3 sm:px-4 sm:py-2 sm:text-left">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[#050a30] sm:h-10 sm:w-10">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold leading-tight text-[#050a30] sm:text-sm">
          {title}
        </p>

        <p className="mt-0.5 hidden text-[10px] leading-tight text-slate-400 min-[400px]:block sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   LEFT SIDE CYBER LINES
=============================================================== */

function CyberLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* top right vertical (hidden on small screens so it never touches text) */}

      <div className="absolute right-[4%] top-0 hidden h-24 w-px bg-[#1257e8]/20 sm:block" />

      <div className="absolute right-[4%] top-10 hidden h-px w-16 bg-[#1257e8]/20 sm:block" />

      {/* corner line */}

      <div className="absolute right-[12%] top-0 hidden h-28 w-24 border-b border-l border-[#1257e8]/15 sm:block" />

      {/* little blue accent */}

      <div className="absolute right-[5%] top-10 hidden h-8 w-1 bg-[#1257e8] sm:block" />

      {/* bottom left */}

      <div className="absolute bottom-8 left-0 h-20 w-20 border-r border-t border-[#ffffff]/40" />

      <div className="absolute bottom-8 left-0 h-px w-24 bg-[#ffffff]/40" />
    </div>
  );
}

/* ===============================================================
   RIGHT BACKGROUND
=============================================================== */

function RightBackground() {
  return (
    <>
      {/* dark blue architectural blocks */}

      <div className="absolute inset-0 bg-[#1257e8]" />

      <div className="absolute right-[-8%] top-[-10%] h-[70%] w-[48%] bg-[#050a30] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%,0_30%)]" />

      <div className="absolute bottom-0 left-[8%] h-[45%] w-[38%] bg-[#050a30]/90 [clip-path:polygon(0_30%,35%_0,100%_0,100%_100%,0_100%)]" />

      {/* yellow architectural accent */}

      <div
        className="absolute right-[30%] top-0 h-[100%] w-[10px] bg-[#ffffff] opacity-90"
        style={{
          clipPath:
            "polygon(0 0,100% 8%,100% 65%,0 100%)",
        }}
      />

      <div className="absolute bottom-[-5%] right-[3%] h-[32%] w-[32%] bg-[#ffffff] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%,0_50%)]" />

      {/* thin cyber lines */}

      <div className="absolute left-[15%] top-[5%] h-[25%] w-px bg-white/30" />

      <div className="absolute left-[15%] top-[5%] h-px w-32 bg-white/30" />

      <div className="absolute right-[18%] top-[8%] h-px w-28 bg-white/30" />

      <div className="absolute right-[18%] top-[8%] h-28 w-px bg-white/30" />

      <div className="absolute bottom-[20%] left-[10%] h-px w-36 bg-[#ffffff]" />

      <div className="absolute bottom-[20%] left-[10%] h-16 w-px bg-[#ffffff]" />
    </>
  );
}