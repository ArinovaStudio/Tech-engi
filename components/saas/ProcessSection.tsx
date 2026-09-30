"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FileText, ChartLineUp, UsersThree, Stack, CheckCircle } from "@phosphor-icons/react";
import { gsap } from "@/components/saas/gsapClient";

type Row = { label: string; value: string; done?: boolean } | { bar: true };

/* ---------- Illustrations (inline SVG, colored via currentColor) ---------- */

const ill = {
  viewBox: "0 0 320 150",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-full w-full",
  "aria-hidden": true,
};
const BG_FILL: CSSProperties = { fill: "var(--ill-bg)" };
const BG_STROKE: CSSProperties = { stroke: "var(--ill-bg)" };
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

const IlloPost = () => (
  <svg {...ill}>
    <circle cx="58" cy="98" r="18" strokeDasharray="3 6" opacity=".5" />
    <path d="M52 32h12M58 26v12" opacity=".5" />
    <rect x="98" y="16" width="124" height="118" rx="12" style={BG_FILL} />
    <path d="M114 36h52M114 48h30" opacity=".35" />
    <g className="illo-float">
      <rect x="130" y="108" width="60" height="10" rx="4" fill="currentColor" fillOpacity=".15" />
      <path d="M160 108V80l32-24" strokeWidth="6" />
      <circle cx="160" cy="80" r="6" style={BG_FILL} />
      <circle cx="192" cy="56" r="6" style={BG_FILL} />
      <path d="M192 56l12-4M192 56l6 12" />
    </g>
    <g className="illo-float" style={delay(-1.2)}>
      <circle cx="250" cy="40" r="17" fill="currentColor" stroke="none" />
      <path d="M250 48V32M243 39l7-7 7 7" style={BG_STROKE} />
    </g>
  </svg>
);

const IlloMatch = () => (
  <svg {...ill}>
    <path d="M40 106H280" opacity=".3" />
    <path d="M40 106H170" strokeWidth="3" />
    <path d="M64 78v20M160 78v20M260 78v20" opacity=".4" strokeDasharray="2 5" />
    <rect x="36" y="44" width="56" height="34" rx="8" style={BG_FILL} />
    <path d="M46 56h26M46 66h16" opacity=".4" />
    <g className="illo-float">
      <rect x="132" y="32" width="56" height="46" rx="8" style={BG_FILL} />
      <path d="M142 46h30M142 56h20M142 66h26" opacity=".4" />
    </g>
    <circle cx="64" cy="106" r="8" fill="currentColor" />
    <circle cx="160" cy="106" r="8" fill="currentColor" />
    <circle cx="260" cy="106" r="8" style={BG_FILL} />
    <g className="illo-float" style={delay(-1.6)}>
      <rect x="226" y="32" width="68" height="30" rx="15" fill="currentColor" stroke="none" />
      <path d="M248 47l6 6 12-12" style={BG_STROKE} />
    </g>
  </svg>
);

const IlloEngineer = () => (
  <svg {...ill}>
    <circle cx="160" cy="64" r="44" strokeDasharray="4 7" opacity=".4" />
    <circle cx="94" cy="80" r="20" style={BG_FILL} opacity=".8" />
    <circle cx="94" cy="74" r="7" opacity=".8" />
    <circle cx="226" cy="80" r="20" style={BG_FILL} opacity=".8" />
    <circle cx="226" cy="74" r="7" opacity=".8" />
    <g className="illo-float">
      <circle cx="160" cy="62" r="28" style={BG_FILL} />
      <circle cx="160" cy="54" r="10" />
      <path d="M141 86c2-13 36-13 38 0" />
      <circle cx="186" cy="38" r="12" fill="currentColor" stroke="none" />
      <path d="M180 38l4 4 8-9" style={BG_STROKE} />
    </g>
    <rect x="110" y="122" width="100" height="8" rx="4" opacity=".25" />
    <rect x="110" y="122" width="96" height="8" rx="4" fill="currentColor" stroke="none" />
  </svg>
);

const IlloSecure = () => (
  <svg {...ill}>
    <rect x="66" y="22" width="156" height="104" rx="12" style={BG_FILL} />
    <path d="M66 44H222" opacity=".4" />
    <circle cx="80" cy="33" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="90" cy="33" r="2.5" fill="currentColor" stroke="none" opacity=".5" />
    <rect x="82" y="58" width="52" height="8" rx="4" fill="currentColor" fillOpacity=".2" stroke="none" />
    <rect x="82" y="74" width="34" height="8" rx="4" fill="currentColor" fillOpacity=".2" stroke="none" />
    <rect x="82" y="96" width="120" height="14" rx="7" opacity=".4" />
    <g className="illo-float" style={delay(-0.8)}>
      <path d="M254 34l30 10v22c0 20-13 34-30 42-17-8-30-22-30-42V44z" fill="currentColor" stroke="none" />
      <path d="M246 70v-4a8 8 0 0 1 16 0v4" style={BG_STROKE} />
      <rect x="243" y="70" width="22" height="16" rx="4" style={BG_FILL} stroke="none" />
    </g>
  </svg>
);

const IlloPay = () => (
  <svg {...ill}>
    <circle cx="160" cy="72" r="56" strokeDasharray="3 8" opacity=".4" />
    <g className="illo-float">
      <circle cx="160" cy="72" r="40" fill="currentColor" stroke="none" />
      <path d="M141 72l14 14 26-30" style={BG_STROKE} strokeWidth="5" />
    </g>
    <g className="illo-float" style={delay(-1.4)}>
      <ellipse cx="66" cy="112" rx="24" ry="8" style={BG_FILL} />
      <ellipse cx="66" cy="102" rx="24" ry="8" style={BG_FILL} />
      <ellipse cx="66" cy="92" rx="24" ry="8" style={BG_FILL} />
    </g>
    <rect x="238" y="46" width="50" height="62" rx="8" style={BG_FILL} />
    <path d="M250 64h26M250 76h26M250 88h14" opacity=".4" />
  </svg>
);

const STEPS: {
  icon: typeof FileText;
  illo: () => React.JSX.Element;
  title: string;
  body: string;
  rows: Row[];
}[] = [
  {
    icon: FileText,
    illo: IlloPost,
    title: "Post your project in brief",
    body: "Describe the project or upload what you already have. Start from scratch or from a half-built one.",
    rows: [
      { label: "Project", value: "Robotic arm" },
      { label: "Stage", value: "Half built" },
      { label: "Files", value: "3 uploaded" },
    ],
  },
  {
    icon: ChartLineUp,
    illo: IlloMatch,
    title: "Get matched in 24 hours",
    body: "We break the work into milestones and send a custom quote based on scope and skills.",
    rows: [
      { label: "Milestone 1", value: "Requirements" },
      { label: "Milestone 2", value: "Prototype" },
      { label: "Quote", value: "Ready", done: true },
    ],
  },
  {
    icon: UsersThree,
    illo: IlloEngineer,
    title: "Meet your verified engineer",
    body: "Matches are picked by skill and past work. You approve the team before anything starts.",
    rows: [
      { label: "Match score", value: "96%" },
      { label: "Mechanical", value: "Verified", done: true },
      { label: "Embedded", value: "Verified", done: true },
    ],
  },
  {
    icon: Stack,
    illo: IlloSecure,
    title: "Work in a shared, NDA-protected space",
    body: "Files, chat and tasks stay together while progress updates live for everyone.",
    rows: [
      { label: "Tasks", value: "12 of 18 done" },
      { bar: true },
      { label: "Latest", value: "CAD v3 uploaded" },
    ],
  },
  {
    icon: CheckCircle,
    illo: IlloPay,
    title: "Approve and pay — just 5% fee",
    body: "Approve each milestone. Payment is released and the finished files are yours.",
    rows: [
      { label: "Milestone 3", value: "Approved", done: true },
      { label: "Payment", value: "Released", done: true },
      { label: "Delivery", value: "Complete", done: true },
    ],
  },
];

const LAST = STEPS.length; // panel 0 is the intro, panels 1..5 are the steps
const pad = (n: number) => String(n).padStart(2, "0");

/* Alternating surfaces: intro + even steps are white, odd steps are primary blue */
const TONE = {
  white: {
    surface: "bg-white text-saas-tx",
    ink: "!text-saas-tx",
    muted: "!text-saas-mut",
    rule: "border-saas-line",
    track: "bg-saas-line",
    fill: "bg-saas-accent",
    on: "border-saas-accent bg-saas-accent",
    off: "border-saas-line bg-white",
    focus: "focus-visible:outline-saas-accent",
    tile: "bg-saas-accent",
    iconColor: "#ffffff",
    frame: "border-saas-line bg-saas-bg text-saas-accent",
    dot: "rgba(79,107,234,.22)",
    outline: "rgba(79,107,234,.2)",
    ill: "#ffffff",
    pull: "border-saas-accent",
  },
  blue: {
    surface: "bg-saas-accent text-white",
    ink: "!text-white",
    muted: "!text-white/90",
    rule: "border-white/25",
    track: "bg-white/25",
    fill: "bg-white",
    on: "border-white bg-white",
    off: "border-white/50 bg-saas-accent",
    focus: "focus-visible:outline-white",
    tile: "bg-white",
    iconColor: "#4F6BEA",
    frame: "border-white/25 bg-white/10 text-white",
    dot: "rgba(255,255,255,.28)",
    outline: "rgba(255,255,255,.22)",
    ill: "#4F6BEA",
    pull: "border-white",
  },
};

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add({ desk: "(min-width: 901px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { desk, reduce } = ctx.conditions as { desk: boolean; reduce: boolean };
      if (!desk) return;

      const distance = () => track.scrollWidth - window.innerWidth;
      const fills = gsap.utils.toArray<HTMLElement>(".folio-fill", track);

      // Vertical scroll -> horizontal movement; pinned, with no snapping so it stays smooth.
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: reduce ? true : 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(fills, { scaleX: self.progress }),
        },
      });

      const st = move.scrollTrigger!;
      rangeRef.current = {
        get start() { return st.start; },
        get end() { return st.end; },
      };

      if (!reduce) {
        gsap.utils.toArray<HTMLElement>(".process-panel", track).forEach((panel, i) => {
          const base = { trigger: panel, containerAnimation: move };
          const ghost = panel.querySelector(".ghost");
          if (ghost) {
            gsap.fromTo(ghost, { xPercent: 14 }, {
              xPercent: -14, ease: "none",
              scrollTrigger: { ...base, start: "left right", end: "right left", scrub: true },
            });
          }
          if (i === 0) return;
          const enter = { ...base, start: "left 70%", toggleActions: "play none none reverse" };
          gsap.from(panel.querySelectorAll(".reveal"), {
            opacity: 0, y: 28, duration: 0.7, stagger: 0.09, ease: "power3.out", scrollTrigger: enter,
          });
          gsap.fromTo(panel.querySelectorAll(".bar-fill"), { scaleX: 0 }, {
            scaleX: 1, duration: 0.9, delay: 0.3, ease: "power2.out", scrollTrigger: enter,
          });
        });
      }

      return () => { rangeRef.current = null; };
    });

    return () => mm.revert();
  }, []);

  const goTo = (p: number) => {
    const r = rangeRef.current;
    if (!r) return false;
    window.scrollTo({ top: r.start + (r.end - r.start) * (p / LAST), behavior: "smooth" });
    return true;
  };

  /* Running folio at the foot of every panel: counter + scroll-linked line + a dot per step */
  const Folio = ({ n, t }: { n: number; t: typeof TONE.white }) => (
    <div className="mt-auto hidden items-center gap-8 pt-8 min-[901px]:flex">
      <div className="flex w-24 items-baseline gap-1 tabular-nums">
        <span className={`text-3xl font-semibold tracking-tight ${t.ink}`}>{pad(n)}</span>
        <span className={`text-base ${t.muted}`}>/ {pad(LAST)}</span>
      </div>
      <div className={`relative h-[2px] flex-1 ${t.track}`}>
        <b className={`folio-fill absolute inset-0 origin-left ${t.fill}`} style={{ transform: "scaleX(0)" }} />
        {STEPS.map((step, i) => (
          <button
            key={step.title}
            type="button"
            onClick={() => goTo(i + 1)}
            aria-label={`Go to step ${i + 1}: ${step.title}`}
            aria-current={n === i + 1 ? "step" : undefined}
            className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${t.focus} ${
              n >= i + 1 ? t.on : t.off
            }`}
            style={{ left: `${((i + 1) / LAST) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  const panel = "process-panel relative flex shrink-0 flex-col overflow-hidden px-6 py-16 min-[901px]:h-screen min-[901px]:w-screen min-[901px]:px-[6vw] min-[901px]:py-10";

  return (
    <section id="how" ref={sectionRef} className="relative overflow-hidden min-[901px]:h-screen">
      <div ref={trackRef} className="flex flex-col min-[901px]:h-full min-[901px]:w-max min-[901px]:flex-row min-[901px]:will-change-transform">
        {/* ---------- Intro / cover ---------- */}
        <article className={`${panel} ${TONE.white.surface} max-[900px]:pt-28 min-[901px]:pt-[15vh]`}>
          <div className="grid flex-1 gap-14 min-[901px]:grid-cols-[1.7fr_1fr] min-[901px]:gap-[5vw]">
            <div>
              <h2 className={`text-[clamp(2.75rem,min(6vw,12.5vh),5rem)] font-semibold tracking-[-0.040em] text-saas-mut`}>
                From <span className="text-black">posted</span> to <span className="text-black">delivered</span>, step by step.
              </h2>
              <p className={`mt-8 max-w-[30ch] text-[clamp(1.05rem,1.5vw,1.45rem)] leading-snug ${TONE.white.muted}`}>
                Scroll to follow a project through all five stages.
              </p>
            </div>
            <nav aria-label="Steps" className="self-end -mt-2">
              <ol className={`border-t-2 ${TONE.white.pull}`}>
                {STEPS.map((step, i) => (
                  <li key={step.title} className={`border-b ${TONE.white.rule}`}>
                    <a
                      href={`#step-${i + 1}`}
                      onClick={(e) => { if (goTo(i + 1)) e.preventDefault(); }}
                      className="flex gap-5 py-4 text-lg transition-colors hover:text-saas-accent"
                    >
                      <span className={`tabular-nums ${TONE.white.muted}`}>{pad(i + 1)}</span>
                      <span className={`font-medium ${TONE.white.ink}`}>{step.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <Folio n={0} t={TONE.white} />
        </article>

        {/* ---------- Steps: alternating blue / white ---------- */}
        {STEPS.map((step, i) => {
          const t = i % 2 === 0 ? TONE.blue : TONE.white;
          const Icon = step.icon;
          const Illo = step.illo;
          return (
            <article key={step.title} id={`step-${i + 1}`} className={`${panel} ${t.surface} max-[900px]:first:border-t-0`}>
              {/* outlined numeral drifting behind the content */}
              <span
                aria-hidden
                className="ghost pointer-events-none absolute -bottom-[0.14em] right-[1vw] select-none text-[clamp(10rem,36vw,34rem)] font-semibold leading-none tracking-[-0.06em] text-transparent"
                style={{ WebkitTextStroke: `1.5px ${t.outline}` }}
              >
                {pad(i + 1)}
              </span>

              {/* running head */}
              <header className={`reveal relative z-10 flex items-center justify-between border-b pb-5 ${t.rule}`}>
                <span className={`text-sm ${t.muted}`}>Step {i + 1} of {STEPS.length}</span>
                <span className={`grid h-10 w-10 place-items-center rounded-lg ${t.tile}`}>
                  <Icon size={20} weight="regular" color={t.iconColor} />
                </span>
              </header>

              <div className="relative z-10 grid flex-1 items-center gap-10 py-10 min-[901px]:grid-cols-[1.25fr_1fr] min-[901px]:gap-[6vw] min-[901px]:py-6">
                <div>
                  <h3 className={`reveal text-[clamp(2.25rem,min(5vw,10vh),5.25rem)] font-semibold leading-[0.98] tracking-[-0.05em] min-[901px]:max-w-[14ch] ${t.ink}`}>
                    {step.title}
                  </h3>
                  <p className={`reveal mt-8 max-w-[34ch] border-l-2 pl-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-snug ${t.pull} ${t.muted}`}>
                    {step.body}
                  </p>
                </div>

                <div className="reveal">
                  <div
                    className={`relative aspect-[320/150] w-full overflow-hidden border min-[901px]:max-h-[30vh] ${t.frame}`}
                    style={{
                      "--ill-bg": t.ill,
                      backgroundImage: `radial-gradient(${t.dot} 1.2px, transparent 1.2px)`,
                      backgroundSize: "20px 20px",
                    } as CSSProperties}
                  >
                    <Illo />
                  </div>

                  <ul className={`mt-6 border-t-2 ${t.pull}`}>
                    {step.rows.map((row, ri) =>
                      "bar" in row ? (
                        <li key={ri} className={`border-b py-5 ${t.rule}`}>
                          <div className={`h-1.5 overflow-hidden ${t.track}`}>
                            <b className={`bar-fill block h-full origin-left ${t.fill}`} style={{ width: "66%" }} />
                          </div>
                        </li>
                      ) : (
                        <li key={row.label} className={`flex items-baseline justify-between gap-6 border-b py-4 ${t.rule}`}>
                          <span className={`text-sm ${t.muted}`}>{row.label}</span>
                          <b className={`inline-flex items-center gap-2 text-base font-medium min-[901px]:text-lg ${t.ink}`}>
                            {row.done && <i className={`h-2 w-2 rounded-full ${t.fill}`} />}
                            {row.value}
                          </b>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <Folio n={i + 1} t={t} />
            </article>
          );
        })}
      </div>
    </section>
  );
}