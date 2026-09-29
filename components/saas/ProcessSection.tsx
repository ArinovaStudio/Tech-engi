"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FileText, ChartLineUp, UsersThree, Stack, CheckCircle } from "@phosphor-icons/react";
import { gsap } from "@/components/saas/gsapClient";

type Row = { label: string; value: string; done?: boolean } | { bar: true };

/* ---------- Card illustrations (inline SVG, colored via currentColor) ---------- */

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
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

const IlloPost = () => (
  <svg {...ill}>
    <circle cx="58" cy="98" r="18" strokeDasharray="3 6" opacity=".5" />
    <path d="M52 32h12M58 26v12" opacity=".5" />
    <rect x="98" y="16" width="124" height="118" rx="12" className="fill-white" />
    <path d="M114 36h52M114 48h30" opacity=".35" />
    <g className="illo-float">
      <rect x="130" y="108" width="60" height="10" rx="4" fill="currentColor" fillOpacity=".15" />
      <path d="M160 108V80l32-24" strokeWidth="6" />
      <circle cx="160" cy="80" r="6" className="fill-white" />
      <circle cx="192" cy="56" r="6" className="fill-white" />
      <path d="M192 56l12-4M192 56l6 12" />
    </g>
    <g className="illo-float" style={delay(-1.2)}>
      <circle cx="250" cy="40" r="17" fill="currentColor" stroke="none" />
      <path d="M250 48V32M243 39l7-7 7 7" stroke="#fff" />
    </g>
  </svg>
);

const IlloMatch = () => (
  <svg {...ill}>
    <path d="M40 106H280" opacity=".3" />
    <path d="M40 106H170" strokeWidth="3" />
    <path d="M64 78v20M160 78v20M260 78v20" opacity=".4" strokeDasharray="2 5" />
    <rect x="36" y="44" width="56" height="34" rx="8" className="fill-white" />
    <path d="M46 56h26M46 66h16" opacity=".4" />
    <g className="illo-float">
      <rect x="132" y="32" width="56" height="46" rx="8" className="fill-white" />
      <path d="M142 46h30M142 56h20M142 66h26" opacity=".4" />
    </g>
    <circle cx="64" cy="106" r="8" fill="currentColor" />
    <circle cx="160" cy="106" r="8" fill="currentColor" />
    <circle cx="260" cy="106" r="8" className="fill-white" />
    <g className="illo-float" style={delay(-1.6)}>
      <rect x="226" y="32" width="68" height="30" rx="15" fill="currentColor" stroke="none" />
      <path d="M248 47l6 6 12-12" stroke="#fff" />
    </g>
  </svg>
);

const IlloEngineer = () => (
  <svg {...ill}>
    <circle cx="160" cy="64" r="44" strokeDasharray="4 7" opacity=".4" />
    <circle cx="94" cy="80" r="20" className="fill-white" opacity=".8" />
    <circle cx="94" cy="74" r="7" opacity=".8" />
    <circle cx="226" cy="80" r="20" className="fill-white" opacity=".8" />
    <circle cx="226" cy="74" r="7" opacity=".8" />
    <g className="illo-float">
      <circle cx="160" cy="62" r="28" className="fill-white" />
      <circle cx="160" cy="54" r="10" />
      <path d="M141 86c2-13 36-13 38 0" />
      <circle cx="186" cy="38" r="12" fill="currentColor" stroke="none" />
      <path d="M180 38l4 4 8-9" stroke="#fff" />
    </g>
    <rect x="110" y="122" width="100" height="8" rx="4" opacity=".25" />
    <rect x="110" y="122" width="96" height="8" rx="4" fill="currentColor" stroke="none" />
  </svg>
);

const IlloSecure = () => (
  <svg {...ill}>
    <rect x="66" y="22" width="156" height="104" rx="12" className="fill-white" />
    <path d="M66 44H222" opacity=".4" />
    <circle cx="80" cy="33" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="90" cy="33" r="2.5" fill="currentColor" stroke="none" opacity=".5" />
    <rect x="82" y="58" width="52" height="8" rx="4" fill="currentColor" fillOpacity=".2" stroke="none" />
    <rect x="82" y="74" width="34" height="8" rx="4" fill="currentColor" fillOpacity=".2" stroke="none" />
    <rect x="82" y="96" width="120" height="14" rx="7" opacity=".4" />
    <g className="illo-float" style={delay(-0.8)}>
      <path d="M254 34l30 10v22c0 20-13 34-30 42-17-8-30-22-30-42V44z" fill="currentColor" stroke="none" />
      <path d="M246 70v-4a8 8 0 0 1 16 0v4" stroke="#fff" />
      <rect x="243" y="70" width="22" height="16" rx="4" fill="#fff" stroke="none" />
    </g>
  </svg>
);

const IlloPay = () => (
  <svg {...ill}>
    <circle cx="160" cy="72" r="56" strokeDasharray="3 8" opacity=".4" />
    <g className="illo-float">
      <circle cx="160" cy="72" r="40" fill="currentColor" stroke="none" />
      <path d="M141 72l14 14 26-30" stroke="#fff" strokeWidth="5" />
    </g>
    <g className="illo-float" style={delay(-1.4)}>
      <ellipse cx="66" cy="112" rx="24" ry="8" className="fill-white" />
      <ellipse cx="66" cy="102" rx="24" ry="8" className="fill-white" />
      <ellipse cx="66" cy="92" rx="24" ry="8" className="fill-white" />
    </g>
    <rect x="238" y="46" width="50" height="62" rx="8" className="fill-white" />
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

/* ---------- Floating background decorations ---------- */

const dec = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-full w-full",
  "aria-hidden": true,
};

const Gear = () => (
  <svg viewBox="0 0 64 64" {...dec}>
    <circle cx="32" cy="32" r="24" strokeWidth="8" strokeDasharray="7 6.3" />
    <circle cx="32" cy="32" r="16" />
    <circle cx="32" cy="32" r="6" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 24 24" {...dec}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);
const Circuit = () => (
  <svg viewBox="0 0 64 64" {...dec}>
    <circle cx="5" cy="30" r="3" />
    <path d="M8 30H26a6 6 0 0 1 6 6V54H53" />
    <circle cx="56" cy="54" r="3" />
    <path d="M32 42H44" />
  </svg>
);
const Bolt = () => (
  <svg viewBox="0 0 64 64" {...dec}>
    <path d="M36 4 14 36h14l-4 24 26-36H36z" />
  </svg>
);
const Ring = () => (
  <svg viewBox="0 0 64 64" {...dec}>
    <circle cx="32" cy="32" r="28" strokeDasharray="2 8" />
    <circle cx="32" cy="32" r="18" />
    <circle cx="32" cy="32" r="4" />
  </svg>
);
const Dots = () => (
  <svg viewBox="0 0 48 48" fill="currentColor" className="h-full w-full" aria-hidden>
    {[8, 24, 40].flatMap((x) => [8, 24, 40].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" />))}
  </svg>
);

const DECOR: {
  Comp: () => React.JSX.Element;
  size: number;
  pos: CSSProperties;
  speed: number;
  spin?: boolean;
}[] = [
  { Comp: Gear, size: 64, pos: { left: "2%", top: -48 }, speed: 0.1, spin: true },
  { Comp: Plus, size: 26, pos: { left: "19%", bottom: -40 }, speed: 0.2 },
  { Comp: Circuit, size: 88, pos: { left: "31%", top: -52 }, speed: 0.06 },
  { Comp: Bolt, size: 40, pos: { left: "47%", bottom: -46 }, speed: 0.16 },
  { Comp: Ring, size: 60, pos: { left: "58%", top: -46 }, speed: 0.12, spin: true },
  { Comp: Dots, size: 52, pos: { left: "72%", bottom: -42 }, speed: 0.08 },
  { Comp: Gear, size: 48, pos: { left: "86%", top: -40 }, speed: 0.14, spin: true },
  { Comp: Plus, size: 22, pos: { left: "94%", bottom: -34 }, speed: 0.22 },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = progressRef.current;
    if (!section || !track || !bar) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.06;
      const end = () => "+=" + distance();

      // 1) Vertical scroll -> horizontal movement, page stays pinned
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // 2) Bottom progress line
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: section, start: "top top", end, scrub: true } }
      );

      // 3) Per-card micro interactions
      const cards = gsap.utils.toArray<HTMLElement>(".process-card", track);
      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        // active state while the card is near the middle of the screen
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: move,
            start: "left 70%",
            end: "right 30%",
            toggleClass: { targets: card, className: "is-active" },
          },
        });

        const enter = {
          trigger: card,
          containerAnimation: move,
          start: "left 88%",
          toggleActions: "play none none reverse",
        };

        gsap.from(card.querySelectorAll(".mock-row"), {
          opacity: 0,
          y: 14,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: enter,
        });

        gsap.fromTo(
          card.querySelectorAll(".progress-bar > b"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.out", scrollTrigger: enter }
        );

        // tilt toward the cursor + spotlight position
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
          card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
          gsap.to(card, {
            rotationY: px * 7,
            rotationX: -py * 7,
            y: -6,
            transformPerspective: 900,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () =>
          gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // 4) Decorations: float + parallax drift (+ scroll-spin for gears/rings)
      gsap.utils.toArray<HTMLElement>(".decor", track).forEach((el, i) => {
        const speed = parseFloat(el.dataset.speed || "0.1");
        const spin = el.dataset.spin === "true";

        gsap.to(el, {
          y: i % 2 ? -14 : 14,
          duration: 3 + i * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(el, {
          x: () => -distance() * speed,
          rotation: spin ? () => distance() * 0.1 : 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end, scrub: true, invalidateOnRefresh: true },
        });
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="how"
      ref={sectionRef}
      className="overflow-hidden pt-[72px] pb-12 min-[901px]:flex min-[901px]:min-h-screen min-[901px]:flex-col min-[901px]:justify-center min-[901px]:pt-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-8">
        <h2 className="text-[clamp(2rem,3.4vw,2.8rem)]">
          From posted to delivered, <span className="text-saas-mut">step by step.</span>
        </h2>
        <p>Scroll to follow a project through all five stages.</p>
      </div>

      <div className="mt-4 py-14 max-[900px]:overflow-x-auto max-[900px]:[scroll-snap-type:x_mandatory] min-[901px]:overflow-hidden">
        <div ref={trackRef} className="process-track relative">
          {DECOR.map(({ Comp, size, pos, speed, spin }, i) => (
            <span
              key={i}
              className="decor pointer-events-none absolute z-0 text-saas-accent/30"
              style={{ width: size, height: size, ...pos }}
              data-speed={speed}
              data-spin={spin ? "true" : "false"}
              aria-hidden
            >
              <Comp />
            </span>
          ))}

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const Illo = step.illo;
            return (
              <div key={step.title} className="process-card group [scroll-snap-align:center]">
                <div className="relative z-10">
                  {/* illustration panel */}
                  <div className="illo-panel dot-grid relative h-[150px] overflow-hidden rounded-2xl border border-saas-line bg-saas-bg text-saas-accent">
                    <span className="absolute left-4 top-2 text-[3.2rem] font-semibold leading-none tracking-[-0.05em] text-saas-accent/25 transition-colors duration-300 group-hover:text-saas-accent/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-saas-line bg-white px-3 py-1 text-xs text-saas-tx">
                      Step {i + 1} of 5
                    </span>
                    <Illo />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="icon-tile mb-0 h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon size={20} weight="regular" color="#4F6BEA" />
                    </span>
                    <h3 className="text-[1.35rem] leading-tight">{step.title}</h3>
                  </div>

                  <p className="mt-3 text-base">{step.body}</p>

                  <div className="mock-panel">
                    {step.rows.map((row, ri) =>
                      "bar" in row ? (
                        <div key={ri} className="progress-bar">
                          <b className="origin-left" style={{ width: "66%" }} />
                        </div>
                      ) : (
                        <div
                          key={row.label}
                          className="mock-row transition-transform duration-200 hover:translate-x-1"
                        >
                          <span>{row.label}</span>
                          <b className="pill-value inline-flex items-center gap-2">
                            {row.done && <i className="h-1.5 w-1.5 rounded-full bg-saas-accent" />}
                            {row.value}
                          </b>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1200px] px-8 min-[901px]:block">
        <div className="h-[3px] overflow-hidden rounded-[3px] bg-saas-line">
          <b ref={progressRef} className="block h-full origin-left bg-saas-accent" />
        </div>
      </div>
    </section>
  );
}