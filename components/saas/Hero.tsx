"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/components/saas/gsapClient";
import HeroTiles from "@/components/saas/HeroTiles";

type ViewKey = "client" | "engineer";
type PillIconName = "rocket" | "flag" | "users" | "search";

// A pill with an href is a link; a pill without one fills the message box with its label.
type Pill = { label: string; icon?: PillIconName; href?: string };

type View = {
  line1: string;
  line2: string;
  sub: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string }; // engineer: second button next to the primary one
  // Only the client view has a text input
  input?: { placeholder: string };
  // Same slot on both tabs, so the two sides stay balanced. Add or remove entries here.
  pills?: Pill[];
};

const VIEWS: Record<ViewKey, View> = {
  client: {
    line1: "We handle code smoothly.",
    line2: "Where your AI fails easily.",
    sub: "One workspace for clients, engineers and students. Start fresh, or hand over a stalled project.",
    primary: { label: "Start a project", href: "#leads" },
    input: { placeholder: "Describe your project…" },
    pills: [
      { label: "Build my idea from scratch", icon: "rocket" },
      { label: "Take over my stalled project and finish it", icon: "flag" },
    ],
  },
  engineer: {
    line1: "Get work that fits.",
    line2: "Finish what you started.",
    sub: "Find leads that match your skills, join a team, or bring in a partner to finish your own unfinished build.",
    primary: { label: "Join as an engineer", href: "/register/engineer" },
    secondary: { label: "Browse leads", href: "#leads" }
  },
};

const ORDER: ViewKey[] = ["client", "engineer"];

const CTA_W = "max-w-[620px]"; // width of the input / button area (was 540px)
const CIRCLE = 44; // send button diameter (px)
const LABEL_PAD = 40; // horizontal padding around the button label (px)
const MIN_H = 44; // one line of text field (px)
const MAX_H = 116; // four lines, then it scrolls (px)
const HIDE_PILLS_AFTER = 10; // characters (client only)
const GREEN_AT = 100; // characters until the border is fully green

const PANEL_CLS =
  "rounded-[28px] bg-white/75 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(15,27,61,.10),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_14px_32px_-14px_rgba(15,27,61,.28),0_0_0_1px_rgba(15,27,61,.06)]";

// Focus glow for the box. With the progress border showing, the blue ring is left out.
const FOCUS_RING =
  "focus-within:shadow-[inset_0_2px_6px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_18px_40px_-14px_rgba(110,120,255,.45),0_0_0_3px_rgba(110,168,255,.28)]";
const FOCUS_PLAIN =
  "focus-within:shadow-[inset_0_2px_6px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_18px_40px_-14px_rgba(15,27,61,.3)]";

// Engineer tab: primary (dark) button. h-14 matches the height of the client input box.
const PRIMARY_BTN =
  "hero-send relative inline-flex py-3.5 items-center justify-center overflow-hidden rounded-full bg-saas-ink px-8 text-sm font-medium text-white hover:brightness-110 active:scale-95";

// Engineer tab: secondary (glass) button, same height as the primary one
const SECONDARY_BTN =
  "inline-flex py-3.5 items-center justify-center rounded-full bg-white/70 px-8 text-sm font-medium text-saas-ink backdrop-blur transition hover:bg-white active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(15,27,61,.08),0_6px_14px_-6px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.08)]";

const PILL_CLS =
  "rounded-full bg-white/65 px-3.5 py-1.5 text-[13px] text-saas-mut backdrop-blur transition-all duration-300 hover:bg-white hover:text-saas-ink shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_6px_14px_-8px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_18px_-8px_rgba(15,27,61,.35),0_0_0_1px_rgba(15,27,61,.1)] inline-flex items-center gap-1.5";

function Ico({
  children,
  className = "h-4 w-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function PillIcon({ name }: { name: PillIconName }) {
  return (
    <Ico className="h-3.5 w-3.5">
      {name === "rocket" && (
        <>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </>
      )}
      {name === "flag" && (
        <>
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <path d="M4 22v-7" />
        </>
      )}
      {name === "users" && (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      )}
    </Ico>
  );
}

export default function Hero() {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>("client"); // client is the default tab
  const [value, setValue] = useState("");
  const [labelW, setLabelW] = useState(0);
  const [fieldH, setFieldH] = useState(MIN_H);
  const [narrow, setNarrow] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const v = VIEWS[view];
  const hasText = value.trim().length > 0;
  const pillW = (labelW || 140) + LABEL_PAD;
  // Client pills collapse once you start typing; engineer pills (links) always stay
  const showPills = v.input ? value.length <= HIDE_PILLS_AFTER : true;
  // Border colour: orange -> yellow -> green (hue 24 -> 140) as the message gets longer
  const progress = Math.min(value.trim().length / GREEN_AT, 1);
  const hue = Math.round(24 + progress * 116);
  const ringOn = hasText;

  // Phones: there is no room beside the input, so the empty-state button sits under it
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Measure the button label so the width can animate between pill and circle
  useLayoutEffect(() => {
    const measure = () => {
      if (labelRef.current) setLabelW(labelRef.current.offsetWidth);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [view]);

  // Auto-grow: a hidden mirror measures the wrapped text, the wrapper animates to that height
  useLayoutEffect(() => {
    const measure = () => {
      if (mirrorRef.current) {
        setFieldH(
          Math.min(MAX_H, Math.max(MIN_H, mirrorRef.current.offsetHeight)),
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fieldRef.current) ro.observe(fieldRef.current);
    return () => ro.disconnect();
  }, [value, view]);

  const toggle = () => {
    const root = rootRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const advance = (prev: ViewKey) =>
      ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];

    if (!root || reduced) {
      setView(advance);
      return;
    }

    const targets = root.querySelectorAll(".line-text, .hero-sub, .hero-cta");
    if (gsap.isTweening(targets)) return;

    gsap
      .timeline()
      .to(targets, { y: -14, opacity: 0, duration: 0.2, stagger: 0.03 })
      .add(() => setView(advance))
      .fromTo(
        targets,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" },
      );
  };

  // Send: save the request, then go to /start
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) {
      window.location.href = v.primary.href; // empty: the button just scrolls to #leads
      return;
    }
    try {
      localStorage.setItem("req", text);
    } catch {
      // storage can be blocked (private mode); still continue to /start
    }
    router.push("/start");
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[max(680px,calc(100svh-64px))] flex-col justify-between overflow-hidden pt-8 sm:pt-10 md:min-h-[max(820px,calc(100svh-76px))] md:pt-[52px]"
    >
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(3px, -6px); }
        }
        .hero-chip { animation: heroFloat 5.5s ease-in-out infinite; transition: opacity .5s ease; }

        /* Send / primary button: lit from above, with a faint white glow */
        .hero-send {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.5),
            inset 0 0 0 1px rgba(255,255,255,.08),
            inset 0 -3px 6px rgba(0,0,0,.28),
            0 0 10px rgba(255,255,255,.55),
            0 0 22px rgba(150,175,255,.28),
            0 8px 18px -6px rgba(15,27,61,.6);
          transition:
            width 380ms cubic-bezier(.7,0,.2,1),
            right 380ms cubic-bezier(.7,0,.2,1),
            bottom 380ms cubic-bezier(.7,0,.2,1),
            transform 150ms ease,
            filter 200ms ease,
            box-shadow 300ms ease,
            opacity 200ms ease;
        }
        .hero-send:hover {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.6),
            inset 0 0 0 1px rgba(255,255,255,.1),
            inset 0 -3px 6px rgba(0,0,0,.28),
            0 0 14px rgba(255,255,255,.75),
            0 0 26px rgba(150,175,255,.4),
            0 10px 20px -6px rgba(15,27,61,.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-chip { animation: none; }
          .hero-send { transition: none; }
        }
      `}</style>

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

      {/* Hero content (centred) */}
      <div className="relative z-[2] mx-auto mt-20 w-full max-w-none px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-[1100px] pb-20 text-center sm:pb-28 md:pb-32">
          <div className="my-5 flex justify-center sm:my-6">
            <button
              type="button"
              aria-label="Switch between client and engineer view"
              onClick={toggle}
              className="view-switch hero-entrance hero-entrance-delay-2"
              data-view={view}
            >
              <span>Client</span>
              <span>Engineer</span>
              <i className="knob" />
            </button>
          </div>

          <h1 className="text-[clamp(2.25rem,5.4vw,4.5rem)]">
            <b className="line-mask block overflow-hidden pb-[0.08em]">
              <span className="line-text hero-title-text hero-entrance block">
                <em className="text-inset not-italic text-saas-ink">
                  {v.line1}
                </em>
              </span>
            </b>
            <b className="line-mask block overflow-hidden pb-[0.08em]">
              <span className="line-text text-inset block text-saas-mut hero-entrance hero-entrance-delay-1">
                {v.line2}
              </span>
            </b>
          </h1>

          <p className="hero-sub hero-entrance hero-entrance-delay-2 mx-auto mt-5 max-w-[520px] text-base sm:mt-6 sm:text-[1.15rem]">
            {v.sub}
          </p>

          <div
            className={`hero-cta hero-entrance hero-entrance-delay-3 mx-auto mt-7 w-full ${CTA_W} sm:mt-8`}
          >
            {/* Main control: input + send button (client) or primary + secondary buttons (engineer) */}
            {v.input ? (
              <div
                className="relative"
                style={{
                  paddingBottom: narrow && !hasText ? CIRCLE + 10 : 0,
                  transition: "padding-bottom 380ms cubic-bezier(.7,0,.2,1)",
                }}
              >
                <div
                  className={`relative overflow-hidden ${PANEL_CLS} ${ringOn ? FOCUS_PLAIN : FOCUS_RING}`}
                  style={{
                    width:
                      hasText || narrow
                        ? "100%"
                        : `calc(100% - ${pillW + 12}px)`,
                    height: fieldH + 12,
                    transition:
                      "width 380ms cubic-bezier(.7,0,.2,1), height 260ms cubic-bezier(.4,0,.2,1), box-shadow 500ms ease",
                  }}
                >
                  <form
                    id="hero-form"
                    onSubmit={handleSubmit}
                    className="flex items-start p-1.5 pl-5 text-left"
                    style={{
                      paddingRight: hasText ? CIRCLE + 12 : 20,
                      transition: "padding-right 380ms cubic-bezier(.7,0,.2,1)",
                    }}
                  >
                    <div
                      ref={fieldRef}
                      className="relative min-w-0 flex-1"
                      style={{
                        height: fieldH,
                        transition: "height 260ms cubic-bezier(.4,0,.2,1)",
                      }}
                    >
                      <div
                        ref={mirrorRef}
                        aria-hidden="true"
                        className="invisible absolute inset-x-0 top-0 whitespace-pre-wrap break-words py-[10px] text-[15px] leading-6"
                      >
                        {value + "\u200b"}
                      </div>
                      <textarea
                        rows={1}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (hasText) e.currentTarget.form?.requestSubmit();
                          }
                        }}
                        placeholder={v.input.placeholder}
                        aria-label={v.input.placeholder}
                        autoComplete="off"
                        className="block h-full w-full resize-none overflow-y-auto border-0 bg-transparent p-0 py-2.5 text-left text-sm leading-6 text-saas-ink outline-none ring-0 [scrollbar-width:none] placeholder:text-saas-mut focus:outline-none focus:ring-0 [&::-webkit-scrollbar]:hidden"
                      />
                    </div>
                  </form>

                  {/* Progress border: orange -> yellow -> green while you write */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[28px]"
                    style={{
                      boxShadow: `inset 0 0 0 2px hsl(${hue} 90% 50%), inset 0 0 16px -2px hsl(${hue} 90% 50% / .28)`,
                      opacity: ringOn ? 1 : 0,
                      transition: "box-shadow 450ms ease, opacity 300ms ease",
                    }}
                  />
                </div>

                {/* Morphing button: pill with label when empty, circle with arrow when typing */}
                <button
                  type="submit"
                  form="hero-form"
                  aria-label={hasText ? "Send" : v.primary.label}
                  className="hero-send absolute h-11 overflow-hidden rounded-full bg-saas-ink text-sm font-medium text-white hover:brightness-110 active:scale-95"
                  style={{
                    width: hasText ? CIRCLE : pillW,
                    // empty + phone: centred under the box; empty + desktop: right of the box
                    right: hasText
                      ? 6
                      : narrow
                        ? `calc(50% - ${pillW / 2}px)`
                        : 0,
                    bottom: hasText || !narrow ? 6 : 0,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(90% 75% at 50% 0%, rgba(255,255,255,.3), transparent 70%)",
                    }}
                  />
                  <span
                    ref={labelRef}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-[opacity,transform] duration-200 ${
                      hasText
                        ? "scale-90 opacity-0"
                        : "scale-100 opacity-100 delay-100"
                    }`}
                  >
                    {v.primary.label}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-300 ${
                      hasText
                        ? "rotate-0 scale-100 opacity-100 delay-100"
                        : "-rotate-45 scale-50 opacity-0"
                    }`}
                  >
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={v.primary.href}
                  className={`${PRIMARY_BTN} w-full sm:w-auto`}
                >
                  {/* light hitting the top of the button, same as the client send button */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(90% 75% at 50% 0%, rgba(255,255,255,.3), transparent 70%)",
                    }}
                  />
                  <span className="relative">{v.primary.label}</span>
                </a>
                {v.secondary && (
                  <a
                    href={v.secondary.href}
                    className={`${SECONDARY_BTN} w-full sm:w-auto`}
                  >
                    {v.secondary.label}
                  </a>
                )}
              </div>
            )}

            {/* Pills: same slot on both tabs. Client pills fill the input, engineer pills are links. */}
            <div
              className="-mx-3 grid"
              style={{
                gridTemplateRows: showPills ? "1fr" : "0fr",
                opacity: showPills ? 1 : 0,
                visibility: showPills ? "visible" : "hidden",
                transition: `grid-template-rows 350ms cubic-bezier(.7,0,.2,1), opacity 250ms ease, visibility 0s linear ${showPills ? "0s" : "350ms"}`,
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <ul
                  className="flex flex-wrap items-start justify-center gap-x-2 gap-y-2 px-3 pb-4 pt-4"
                  aria-label="Suggestions"
                >
                  {v.pills?.map((p, i) => (
                    <li
                      key={`${view}-${p.label}`}
                      className="hero-chip"
                      style={{
                        marginTop: [0, 6, 2][i % 3],
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + i * 0.7}s`,
                      }}
                    >
                      {p.href ? (
                        <a href={p.href} className={PILL_CLS}>
                          {p.icon && <PillIcon name={p.icon} />}
                          {p.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setValue(p.label)}
                          className={PILL_CLS}
                        >
                          {p.icon && <PillIcon name={p.icon} />}
                          {p.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroTiles />
    </section>
  );
}