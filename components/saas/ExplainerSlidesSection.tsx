"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/components/saas/gsapClient";
import {
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Image from "next/image";

import image_1 from "@/public/saas/explainer/blender_techengi_7.png";
import image_2 from "@/public/saas/explainer/blender_techengi_4.png";
import image_3 from "@/public/saas/explainer/blender_techengi_6.png";
import image_4 from "@/public/saas/explainer/blender_techengi_2.png";
import image_5 from "@/public/saas/explainer/blender_techengi_1.png";
import image_6 from "@/public/saas/explainer/blender_techengi_3.png";
import image_7 from "@/public/saas/explainer/blender_techengi_8.png";
import image_8 from "@/public/saas/explainer/blender_techengi_5.png";

export interface ExplainerSlide {
  id: string;
  number: string;
  stepNumber: number;
  title: string;
  desc: string;
  ambientGlow: string;
  badge?: {
    text: string;
    type?: "green" | "amber" | "pink" | "blue";
    icon?: string;
  };
  checklist?: string[];
  footerTag: string;
  image: string;
}

export const EXPLAINER_SLIDES: ExplainerSlide[] = [
  {
    id: "slide-1",
    number: "01",
    stepNumber: 1,
    title: "Upload the bug. A verified engineer who's fixed this before takes it.",
    desc: "Drop in your code or project folder and say where it breaks. We match you with an engineer who has already solved this exact problem.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(91, 116, 240, 0.12) 0%, rgba(91, 116, 240, 0.04) 40%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "NDA signed before anyone reviews your code",
      type: "green",
      icon: "shield",
    },
    footerTag: "Bug fixing first · freelancing second",
    image: image_1.src,
  },
  {
    id: "slide-2",
    number: "02",
    stepNumber: 2,
    title: "Every engineer keeps 95% of what the client pays.",
    desc: "The client's payment is held in escrow the moment it's made, then released to the engineer on approval. No chasing invoices.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(20, 134, 90, 0.10) 0%, rgba(20, 134, 90, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "Escrow-backed payment on every project",
      type: "green",
      icon: "lock",
    },
    footerTag: "Bug fixing first · freelancing second",
    image: image_2.src,
  },
  {
    id: "slide-3",
    number: "03",
    stepNumber: 3,
    title: "A real SOW for your MVP. Not a guess.",
    desc: "Before a line of code is written, you get a statement of work: scope, milestones, stack and price. Sign once, and there's nothing to argue about later.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(139, 92, 246, 0.10) 0%, rgba(139, 92, 246, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    checklist: [
      "Scope and deliverables",
      "Milestones and timeline",
      "Stack and fixed price",
    ],
    footerTag: "From idea to buildable plan",
    image: image_3.src,
  },
  {
    id: "slide-4",
    number: "04",
    stepNumber: 4,
    title: "Click New Project. Four fields. 25% upfront.",
    desc: "Title, description, budget, tech stack. Pay 25% to publish, and the rest is released milestone by milestone.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(240, 179, 30, 0.11) 0%, rgba(240, 179, 30, 0.03) 25%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "New project in under two minutes",
      type: "amber",
      icon: "pulse",
    },
    footerTag: "Title → description → budget → stack → 25%",
    image: image_4.src,
  },
  {
    id: "slide-5",
    number: "05",
    stepNumber: 5,
    title: "Matched by AI in minutes. Not a job board.",
    desc: "Our model reads your stack and skill needs, then checks each verified engineer's completed projects and specialisation before a name reaches you.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(79, 107, 234, 0.11) 0%, rgba(79, 107, 234, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "Matched on stack, skill and track record",
      type: "blue",
      icon: "sparkles",
    },
    footerTag: "AI match · verified engineers",
    image: image_5.src,
  },
  {
    id: "slide-6",
    number: "06",
    stepNumber: 6,
    title: "Assigned. Now chat, track and pay as you go.",
    desc: "Talk to your engineer and the Tech Engi admin in one thread. Live progress, email updates, and milestone payments after the 25% upfront.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(14, 165, 233, 0.10) 0%, rgba(14, 165, 233, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    checklist: [
      "Chat with engineer and admin",
      "Live tracking with email updates",
      "Milestone payments after upfront",
    ],
    footerTag: "One thread · live progress",
    image: image_6.src,
  },
  {
    id: "slide-7",
    number: "07",
    stepNumber: 7,
    title: "Files in one place. Secrets in another.",
    desc: "Upload resources, files and folders to Assets. Keep keys, logins and tokens in Credentials, private and separate from the project chat.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(99, 102, 241, 0.10) 0%, rgba(99, 102, 241, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "Credentials stay private to the project",
      type: "green",
      icon: "key",
    },
    footerTag: "Assets for files · Credentials for access",
    image: image_7.src,
  },
  {
    id: "slide-8",
    number: "08",
    stepNumber: 8,
    title: "Still broken after delivery? Raise a ticket.",
    desc: "Use Report an Issue on your dashboard. It reopens the project with the same engineer. No email chains, no starting over.",
    ambientGlow:
      "radial-gradient(ellipse 75% 65% at 70% 50%, rgba(242, 84, 138, 0.10) 0%, rgba(242, 84, 138, 0.03) 40%, rgba(248, 250, 253, 0) 70%)",
    badge: {
      text: "Delivered doesn't mean abandoned",
      type: "pink",
      icon: "pulse",
    },
    footerTag: "Report an issue · same engineer",
    image: image_8.src,
  },
];

// ---- Tuning (desktop) ----
const SLIDE_DURATION = 0.02;
const COOLDOWN = 0.01;
const QUIET_MS = 160;
const WHEEL_MIN = 4;
const SWIPE_MIN = 40;
const STEP_VH = 0.8;
const SETTLE_MS = 140;

export default function ExplainerSlidesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const gotoRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        desk: "(min-width: 901px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { desk, reduce } = ctx.conditions as {
          desk: boolean;
          reduce: boolean;
        };
        if (!desk) return;

        const last = EXPLAINER_SLIDES.length - 1;
        const slideDur = reduce ? 0.01 : SLIDE_DURATION;

        let busy = false;
        let lastWheelAt = 0;
        let touchStartY = 0;
        let settleTimer: ReturnType<typeof setTimeout> | undefined;
        let scrollTween: gsap.core.Tween | undefined;

        const trig = () => move.scrollTrigger!;
        const span = () => trig().end - trig().start || 1;
        const stepY = (i: number) => trig().start + span() * (i / last);
        const currentIndex = () => {
          const p = (window.scrollY - trig().start) / span();
          return Math.min(last, Math.max(0, Math.round(p * last)));
        };
        const inRange = () =>
          window.scrollY >= trig().start - 2 && window.scrollY <= trig().end + 2;

        const jumpTo = (y: number) =>
          window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });

        const scrollToIndex = (i: number) => {
          busy = true;
          const p = { y: window.scrollY };
          scrollTween?.kill();
          scrollTween = gsap.to(p, {
            y: stepY(i),
            duration: slideDur,
            ease: "power3.inOut",
            onUpdate: () => jumpTo(p.y),
            onComplete: () => {
              gsap.delayedCall(COOLDOWN, () => {
                busy = false;
              });
            },
          });
        };

        const settle = () => {
          if (busy || !inRange()) return;
          const target = currentIndex();
          if (Math.abs(window.scrollY - stepY(target)) > 2) scrollToIndex(target);
        };

        const move = gsap.to(track, {
          x: () => -last * window.innerWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * STEP_VH * last),
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActiveIndex(Math.round(self.progress * last));
              if (progressFillRef.current) {
                gsap.set(progressFillRef.current, { scaleX: self.progress });
              }
              clearTimeout(settleTimer);
              settleTimer = setTimeout(settle, SETTLE_MS);
            },
          },
        });

        const onWheel = (e: WheelEvent) => {
          if (!inRange()) return;

          const now = performance.now();
          const gap = now - lastWheelAt;
          lastWheelAt = now;

          if (busy || gap < QUIET_MS) {
            e.preventDefault();
            return;
          }

          const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          if (Math.abs(d) < WHEEL_MIN) {
            e.preventDefault();
            return;
          }

          const next = currentIndex() + (d > 0 ? 1 : -1);
          if (next < 0 || next > last) return;
          e.preventDefault();
          scrollToIndex(next);
        };

        const onTouchStart = (e: TouchEvent) => {
          if (inRange()) touchStartY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
          if (!inRange()) return;
          const dy = touchStartY - e.touches[0].clientY;
          const next = currentIndex() + (dy > 0 ? 1 : -1);
          if (next < 0 || next > last) return;
          e.preventDefault();
        };
        const onTouchEnd = (e: TouchEvent) => {
          if (!inRange() || busy) return;
          const dy = touchStartY - e.changedTouches[0].clientY;
          if (Math.abs(dy) < SWIPE_MIN) return;
          const next = currentIndex() + (dy > 0 ? 1 : -1);
          if (next >= 0 && next <= last) scrollToIndex(next);
        };

        const onKey = (e: KeyboardEvent) => {
          if (!inRange()) return;
          const tag = (e.target as HTMLElement | null)?.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
          let dir = 0;
          if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) dir = 1;
          else if (["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) dir = -1;
          if (!dir) return;
          const next = currentIndex() + dir;
          if (next < 0 || next > last) return;
          e.preventDefault();
          if (!busy) scrollToIndex(next);
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("keydown", onKey);

        gotoRef.current = (i: number) => {
          if (busy || i < 0 || i > last || i === currentIndex()) return;
          scrollToIndex(i);
        };

        return () => {
          gotoRef.current = null;
          clearTimeout(settleTimer);
          scrollTween?.kill();
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", onTouchEnd);
          window.removeEventListener("keydown", onKey);
        };
      }
    );

    return () => mm.revert();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isDesktop) {
        gotoRef.current?.(index);
      } else if (mobileScrollRef.current) {
        const container = mobileScrollRef.current;
        const card = container.children[index] as HTMLElement;
        if (card) {
          card.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
        setActiveIndex(index);
      }
    },
    [isDesktop]
  );

  const handleMobileScroll = () => {
    if (isDesktop || !mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth || 300;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < EXPLAINER_SLIDES.length) {
      setActiveIndex(newIdx);
    }
  };

  return (
    <section
      id="explainer-slides"
      ref={sectionRef}
      className="relative z-0 w-full overflow-x-clip min-[901px]:overflow-hidden select-none bg-[#F8FAFD]"
      aria-label="Tech Engi Explainer Slides"
    >
      {/* Scroll Progress Line (Desktop) */}
      <div className="hidden min-[901px]:block absolute top-[76px] inset-x-0 h-1 bg-black/5 z-10">
        <div
          ref={progressFillRef}
          className="h-full bg-gradient-to-r from-[#5B74F0] via-[#F0B31E] to-[#F2548A] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Frosted Glass Top Bar (Desktop) */}
      <div className="hidden min-[901px]:flex absolute top-[92px] inset-x-0 z-10 justify-between items-center px-8 lg:px-14 xl:px-20 max-w-[1600px] mx-auto pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(5,10,48,0.06)] rounded-full px-5 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#050A30] text-[#F0B31E] flex items-center justify-center font-black text-xs shadow-sm">
            {"{ }"}
          </div>
          <div className="font-extrabold text-sm tracking-tight text-[#0B1638]">
            TECH <span className="text-[#D39B12]">ENGI</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#14865A] animate-pulse ml-1" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#050A30]">
            How It Works
          </span>
          <span className="text-xs text-[#6B7596] font-semibold pl-2.5 border-l border-black/10">
            {EXPLAINER_SLIDES[activeIndex].number} / 08
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(5,10,48,0.06)] rounded-full px-4 py-2">
          <button
            type="button"
            onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="p-1.5 rounded-full text-[#0B1638] hover:bg-[#050A30]/8 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {EXPLAINER_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 font-bold text-xs rounded-full px-2.5 py-1 cursor-pointer ${
                  activeIndex === i
                    ? "bg-[#050A30] text-white shadow-sm"
                    : "text-[#6B7596] hover:text-[#0B1638] hover:bg-black/5"
                }`}
              >
                {slide.number}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              goToSlide(Math.min(EXPLAINER_SLIDES.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === EXPLAINER_SLIDES.length - 1}
            className="p-1.5 rounded-full text-[#0B1638] hover:bg-[#050A30]/8 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DESKTOP: Full-Height Horizontal Screen Slider */}
      <div
        ref={trackRef}
        className="hidden min-[901px]:flex flex-row h-screen w-max items-center will-change-transform"
      >
        {EXPLAINER_SLIDES.map((slide, index) => (
          <FullScreenSlide
            key={slide.id}
            slide={slide}
            index={index}
            isActive={activeIndex === index}
          />
        ))}
      </div>

      {/* MOBILE / TABLET: Compact Touch Snap Slider */}
      <div className="min-[901px]:hidden w-full flex flex-col pb-3 relative z-0">
        <div className="flex justify-between items-center px-5 py-2.5 bg-white/80 border-b border-black/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#050A30] text-[#F0B31E] flex items-center justify-center font-extrabold text-[10px]">
              {"{ }"}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#050A30]">
              How Tech Engi Works
            </span>
          </div>
          <span className="text-xs font-bold text-[#4A5578] bg-black/5 px-2.5 py-0.5 rounded-full">
            {EXPLAINER_SLIDES[activeIndex].number} / 08
          </span>
        </div>

        {/* Scrollable Mobile Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none w-full items-start"
        >
          {EXPLAINER_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="w-screen shrink-0 snap-center flex"
            >
              <FullScreenSlide
                slide={slide}
                index={index}
                isActive={activeIndex === index}
                isMobile
              />
            </div>
          ))}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="mx-4 mt-1 flex justify-between items-center p-2.5 rounded-full bg-white/90 shadow-[0_8px_28px_rgba(5,10,48,0.10)] border border-white/70">
          <div className="flex items-center gap-1.5 pl-2">
            {EXPLAINER_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === i
                    ? "w-6 h-2 bg-[#050A30]"
                    : "w-2 h-2 bg-[#B9C3E0]"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-2 rounded-full bg-black/5 text-[#0B1638] disabled:opacity-25"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                goToSlide(
                  Math.min(EXPLAINER_SLIDES.length - 1, activeIndex + 1)
                )
              }
              disabled={activeIndex === EXPLAINER_SLIDES.length - 1}
              className="p-2 rounded-full bg-[#050A30] text-white disabled:opacity-25 shadow-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FullScreenSlide({
  slide,
  index,
  isActive,
  isMobile = false,
}: {
  slide: ExplainerSlide;
  index: number;
  isActive: boolean;
  isMobile?: boolean;
}) {
  return (
    <article
      className={
        isMobile
          ? "relative w-full shrink-0 flex flex-col justify-start overflow-hidden border-none px-5 pt-4 pb-2 gap-3"
          : "relative w-screen h-screen shrink-0 flex flex-col justify-between overflow-hidden border-none px-10 lg:px-16 xl:px-24 pt-[160px] pb-10"
      }
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: slide.ambientGlow,
        }}
      />

      <div
        className={
          isMobile
            ? "relative z-0 w-full max-w-[1560px] mx-auto grid grid-cols-1 min-[901px]:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.15fr] items-center gap-3.5"
            : "relative z-0 w-full max-w-[1560px] mx-auto my-auto grid grid-cols-1 min-[901px]:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.15fr] items-center gap-8 lg:gap-14 xl:gap-20"
        }
      >
        <div className="flex flex-col justify-center gap-3 sm:gap-6 max-w-[640px]">
          <h2 className="text-[22px] sm:text-3xl lg:text-4xl xl:text-[46px] 2xl:text-[50px] font-black text-[#0B1638] leading-[1.15] tracking-tight">
            {slide.title}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg xl:text-[19px] text-[#4A5578] font-normal leading-relaxed">
            {slide.desc}
          </p>

          {slide.checklist && slide.checklist.length > 0 && (
            <div className="flex flex-col gap-2 pt-0.5">
              {slide.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-base font-semibold text-[#0B1638]"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#14865A]/15 text-[#14865A] flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {slide.badge && (
            <div className="relative z-0 flex items-center gap-2 bg-white/90 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 w-fit shadow-[0_8px_20px_rgba(5,10,48,0.04)] border border-white/60">
              {slide.badge.type === "green" && (
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#14865A] shrink-0" />
              )}
              {slide.badge.type === "amber" && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F0B31E] animate-ping shrink-0" />
              )}
              {slide.badge.type === "pink" && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2548A] animate-ping shrink-0" />
              )}
              {slide.badge.type === "blue" && (
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F6BEA] shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold text-[#0B1638]">
                {slide.badge.text}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center w-full">
          <div
            className={
              isMobile
                ? "relative z-0 w-full flex items-center justify-center max-w-[380px] aspect-[16/10] max-h-[210px] sm:max-h-[300px]"
                : "relative z-0 w-full max-w-[640px] xl:max-w-[700px] h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[540px] 2xl:h-[580px] flex items-center justify-center"
            }
          >
            <Image
              fill
              src={slide.image}
              alt={`Slide ${slide.number} illustration`}
              className="w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(5,10,48,0.08)]"
              priority={index <= 1}
            />
          </div>
        </div>
      </div>

      <div
        className={
          isMobile
            ? "relative z-0 flex justify-between items-center w-full pt-1 text-[11px] text-[#7D8AA8] font-medium border-none"
            : "relative z-0 flex justify-between items-center w-full max-w-[1560px] mx-auto pt-2 text-[11px] sm:text-sm text-[#7D8AA8] font-medium border-none"
        }
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#050A30]" />
          <span className="font-bold text-[#050A30] tracking-wider uppercase text-[11px] sm:text-xs">
            techengi.in
          </span>
        </div>
        <span className="text-right tracking-wide">{slide.footerTag}</span>
      </div>
    </article>
  );
}