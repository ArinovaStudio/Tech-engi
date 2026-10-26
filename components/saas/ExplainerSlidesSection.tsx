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
    desc: "Talk to your engineer and the Tech Engi admin in one thread. Live progress, email updates, and milestone payments after the 40% upfront.",
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

export default function ExplainerSlidesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rangeRef = useRef<{ start: number; end: number } | null>(null);

  // Desktop horizontal scroll triggered by vertical scroll
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

        // Total scrollable distance = (total slides - 1) * viewport width
        const distance = () => track.scrollWidth - window.innerWidth;

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: reduce ? true : 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = Math.min(
                Math.floor(p * EXPLAINER_SLIDES.length + 0.05),
                EXPLAINER_SLIDES.length - 1
              );
              setActiveIndex(idx);
              if (progressFillRef.current) {
                gsap.set(progressFillRef.current, { scaleX: p });
              }
            },
          },
        });

        const st = move.scrollTrigger;
        if (st) {
          rangeRef.current = {
            get start() {
              return st.start;
            },
            get end() {
              return st.end;
            },
          };
        }

        return () => {
          rangeRef.current = null;
        };
      }
    );

    return () => mm.revert();
  }, []);

  // Jump to specific slide
  const goToSlide = useCallback((index: number) => {
    const r = rangeRef.current;
    if (r && window.innerWidth >= 901) {
      const targetScroll =
        r.start + (r.end - r.start) * (index / (EXPLAINER_SLIDES.length - 1));
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
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
  }, []);

  // Handle mobile horizontal scroll
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current || window.innerWidth >= 901) return;
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
      className="relative w-full overflow-hidden select-none bg-[#F8FAFD]"
      aria-label="Tech Engi Explainer Slides"
    >
      {/* Scroll Progress Line: Flush with the bottom of the sticky 76px navbar */}
      <div className="hidden min-[901px]:block absolute top-[76px] inset-x-0 h-1 bg-black/5 z-30">
        <div
          ref={progressFillRef}
          className="h-full bg-gradient-to-r from-[#5B74F0] via-[#F0B31E] to-[#F2548A] origin-left transition-transform duration-75"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Frosted Glass Top Bar (Desktop): Positioned at top-[92px] so it is completely visible below the 76px navbar and above the slider content */}
      <div className="hidden min-[901px]:flex absolute top-[92px] inset-x-0 z-30 justify-between items-center px-8 lg:px-14 xl:px-20 max-w-[1600px] mx-auto pointer-events-none">
        {/* Left: Brand Pill with frosted glass */}
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

        {/* Right: Step Indicator Pills & Navigation Chevrons with frosted glass */}
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

      {/* MOBILE / TABLET: Full-Height Touch Snap Slider */}
      <div className="min-[901px]:hidden w-full flex flex-col">
        {/* Mobile Sticky Header below the 64px mobile navbar */}
        <div className="sticky top-[64px] z-30 flex justify-between items-center px-5 py-3 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm">
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

        {/* Scrollable Full-Screen Mobile Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none w-full"
        >
          {EXPLAINER_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="w-screen min-h-[100dvh] shrink-0 snap-center"
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

        {/* Mobile Floating Bottom Navigation */}
        <div className="fixed bottom-5 inset-x-4 z-40 flex justify-between items-center p-2.5 rounded-full bg-white/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(5,10,48,0.12)] border border-white/60">
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

// -------------------------------------------------------------
// FULL-SCREEN SLIDE COMPONENT (NO BORDERS, SEAMLESS AMBIENT GLOW)
// -------------------------------------------------------------
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
      className={`relative w-screen h-screen shrink-0 flex flex-col justify-between overflow-hidden border-none ${
        isMobile
          ? "px-6 pt-10 pb-24"
          : "px-10 lg:px-16 xl:px-24 pt-[160px] pb-10"
      }`}
    >
      {/* Smooth Seamless Ambient Radial Glow: Mathematically fades 100% to transparent with zero edges or boundaries */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: slide.ambientGlow,
        }}
      />

      {/* Main Slide Body Grid */}
      <div className="relative z-10 w-full max-w-[1560px] mx-auto my-auto grid grid-cols-1 min-[901px]:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.15fr] items-center gap-8 lg:gap-14 xl:gap-20">
        {/* LEFT COLUMN: Large Typography, Badges, Explanations */}
        <div className="flex flex-col justify-center gap-4 sm:gap-6 max-w-[640px]">
          {/* Step Pill */}

          {/* Large Expressive Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[46px] 2xl:text-[50px] font-black text-[#0B1638] leading-[1.12] tracking-tight">
            {slide.title}
          </h2>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base lg:text-lg xl:text-[19px] text-[#4A5578] font-normal leading-relaxed">
            {slide.desc}
          </p>

          {/* Checklist items if available */}
          {slide.checklist && slide.checklist.length > 0 && (
            <div className="flex flex-col gap-2.5 pt-1">
              {slide.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm sm:text-base font-semibold text-[#0B1638]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#14865A]/15 text-[#14865A] flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Feature Badge if available */}
          {slide.badge && (
            <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xl rounded-2xl px-4 py-2.5 w-fit shadow-[0_8px_20px_rgba(5,10,48,0.04)] border border-white/60">
              {slide.badge.type === "green" && (
                <ShieldCheck className="w-5 h-5 text-[#14865A] shrink-0" />
              )}
              {slide.badge.type === "amber" && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F0B31E] animate-ping shrink-0" />
              )}
              {slide.badge.type === "pink" && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2548A] animate-ping shrink-0" />
              )}
              {slide.badge.type === "blue" && (
                <Sparkles className="w-5 h-5 text-[#4F6BEA] shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold text-[#0B1638]">
                {slide.badge.text}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 3D Blender Illustration Render with smooth depth and zero card border */}
        <div className="flex justify-center items-center w-full">
          <div className="relative w-full max-w-[640px] xl:max-w-[700px] h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[540px] 2xl:h-[580px] flex items-center justify-center">
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

      {/* FOOTER BAR (Clean, borderless, bottom attribution) */}
      <div className="relative z-10 flex justify-between items-center w-full max-w-[1560px] mx-auto pt-3 text-xs sm:text-sm text-[#7D8AA8] font-medium border-none">
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