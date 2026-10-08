"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { gsap } from "@/components/saas/gsapClient";
import HeroTiles from "@/components/saas/HeroTiles";

type ViewKey = "client" | "engineer" | "corporate";

type View = {
  line1: string;
  line2: string;
  sub: string;
  placeholder: string;
  suggestions: string[];
  primary: { label: string; href: string };
};

const VIEWS: Record<ViewKey, View> = {
  client: {
    line1: "Get projects built.",
    line2: "Get projects finished.",
    sub: "Tech Engi brings clients, engineers and students into one workspace. Start a project from zero, or hand over one that stalled halfway.",
    placeholder: "Describe your project…",
    suggestions: ["Get project by professional", "Finish my stalled build", "Hire a small team"],
    primary: { label: "Start a project", href: "#leads" },
  },
  engineer: {
    line1: "Get work that fits.",
    line2: "Finish what you started.",
    sub: "Find leads that match your skills, join a team, or bring in a partner to finish your own unfinished build.",
    placeholder: "What do you build best?",
    suggestions: ["Find React leads", "Join a team", "Find a partner to finish"],
    primary: { label: "Browse leads", href: "#leads" },
  },
  corporate: {
    line1: "Your bug doesn't wait for Monday.",
    line2: "Neither do we.",
    sub: "Post the problem. Get matched with a verified engineer in hours. Pay only when it's fixed — just 5% platform fee.",
    placeholder: "What's broken right now?",
    suggestions: ["Debug project", "Fix a production bug", "Get project by professional"],
    primary: { label: "Post your first task", href: "#leads" },
  },
};

const ORDER: ViewKey[] = ["client", "engineer", "corporate"];

const CIRCLE = 44; // button diameter (px)
const LABEL_PAD = 40; // horizontal padding around the label (px)
const MIN_H = 44; // one line of text field (px)
const MAX_H = 116; // four lines, then it scrolls (px)
const HIDE_PILLS_AFTER = 10; // characters

const PANEL_CLS =
  "rounded-[28px] bg-white/75 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(15,27,61,.10),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_14px_32px_-14px_rgba(15,27,61,.28),0_0_0_1px_rgba(15,27,61,.06)]";

const FIELD_CLS =
  "h-11 w-full rounded-full border-0 bg-[rgba(238,242,250,.75)] px-4 text-[14px] text-saas-ink outline-none ring-0 transition-shadow placeholder:text-saas-mut focus:outline-none focus:ring-0 shadow-[inset_0_2px_6px_rgba(15,27,61,.2),inset_0_1px_2px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.95),0_1px_0_rgba(255,255,255,.95)] focus:shadow-[inset_0_2px_6px_rgba(15,27,61,.22),inset_0_1px_2px_rgba(15,27,61,.14),0_0_0_3px_rgba(110,168,255,.3)]";

type Step = "compose" | "details" | "done";

// Content layers inside the morphing box: the box changes shape first, then the new content fades in
const layer = (on: boolean): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(6px)",
  visibility: on ? "visible" : "hidden",
  pointerEvents: on ? "auto" : "none",
  transition: `opacity ${on ? 260 : 140}ms ease ${on ? 240 : 0}ms, transform ${on ? 320 : 140}ms ease ${on ? 240 : 0}ms, visibility 0s linear ${on ? "0s" : "140ms"}`,
});

const PHONE_LEN = 10;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// same rule as EMAIL_RE, written for the HTML pattern attribute
const EMAIL_PATTERN = "[A-Za-z0-9._%+\\-]+@[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*\\.[A-Za-z]{2,}";

export default function Hero() {
  const [view, setView] = useState<ViewKey>("engineer");
  const [values, setValues] = useState<Record<ViewKey, string>>({
    client: "",
    engineer: "",
    corporate: "",
  });
  const [labelW, setLabelW] = useState(0);
  const [fieldH, setFieldH] = useState(MIN_H);
  const [narrow, setNarrow] = useState(false);
  const [step, setStep] = useState<Step>("compose");
  const [animH, setAnimH] = useState(false);
  const [detailsH, setDetailsH] = useState(0);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const formId = useId();

  const rootRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const v = VIEWS[view];
  const value = values[view];
  const hasText = value.trim().length > 0;
  const pillW = (labelW || 140) + LABEL_PAD;
  const isCompose = step === "compose";
  const showPills = isCompose && value.length <= HIDE_PILLS_AFTER;
  const composeLayer = layer(isCompose);
  const detailsLayer = layer(!isCompose);

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
        setFieldH(Math.min(MAX_H, Math.max(MIN_H, mirrorRef.current.offsetHeight)));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fieldRef.current) ro.observe(fieldRef.current);
    return () => ro.disconnect();
  }, [value, view]);

  // Track the details card height so the box can morph to it
  useLayoutEffect(() => {
    const sync = () => {
      if (detailsRef.current) setDetailsH(detailsRef.current.offsetHeight);
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (detailsRef.current) ro.observe(detailsRef.current);
    return () => ro.disconnect();
  }, []);

  const goStep = (next: Step) => {
    setAnimH(true); // animate the container height only while switching steps
    setStep(next);
    window.setTimeout(() => setAnimH(false), 450);
  };

  const toggle = () => {
    const root = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const next = ORDER[(ORDER.indexOf(view) + 1) % ORDER.length];

    if (!root || reduced) {
      setView(next);
      setStep("compose");
      return;
    }

    const targets = root.querySelectorAll(".line-text, .hero-sub, .hero-cta");

    gsap
      .timeline()
      .to(targets, { y: -14, opacity: 0, duration: 0.2, stagger: 0.03 })
      .add(() => {
        setView(next);
        setStep("compose");
      })
      .fromTo(
        targets,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" }
      );
  };

  // Step 1: send the message -> ask for contact details
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hasText) {
      window.location.href = v.primary.href;
      return;
    }
    goStep("details");
    window.setTimeout(() => emailRef.current?.focus(), 120);
  };

  const showError = (msg: string) => {
    setAnimH(true); // let the box grow smoothly to fit the message
    setFormError(msg);
    window.setTimeout(() => setAnimH(false), 450);
  };

  // Step 2: email + 10-digit phone required, name optional -> POST /api/new-request
  const handleDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget; // grab it now, it is gone after the await
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    if (!EMAIL_RE.test(email)) return showError("Please enter a valid email address.");
    if (!/^\d{10}$/.test(phone)) return showError("Phone number must be exactly 10 digits.");

    setFormError("");
    setSending(true);
    try {
      const res = await fetch("/api/new-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: view, // "client" | "engineer" | "corporate"
          message: value.trim(),
          name: name || undefined,
          email,
          phone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

      form.reset();
      goStep("done");
      window.setTimeout(() => {
        setValue("");
        goStep("compose");
      }, 3200);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const setValue = (text: string) => setValues((s) => ({ ...s, [view]: text }));

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

        /* Send button: lit from above, with a faint white glow */
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

          <p className="hero-sub hero-entrance hero-entrance-delay-2 mt-5 max-w-[520px] text-base sm:mt-6 sm:text-[1.15rem]">
            {v.sub}
          </p>

          {/* Input + morphing button + pills */}
          <div className="hero-cta hero-entrance hero-entrance-delay-3 mt-7 w-full max-w-[540px] sm:mt-8">
            {/* One box that morphs: short input -> full width -> contact-details card */}
            <div
              className="relative"
              style={{
                paddingBottom: narrow && isCompose && !hasText ? CIRCLE + 10 : 0,
                transition: "padding-bottom 380ms cubic-bezier(.7,0,.2,1)",
              }}
            >
              <div
                className={`relative overflow-hidden ${PANEL_CLS} focus-within:shadow-[inset_0_2px_6px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_18px_40px_-14px_rgba(110,120,255,.45),0_0_0_3px_rgba(110,168,255,.28)]`}
                style={{
                  width: hasText || narrow || !isCompose ? "100%" : `calc(100% - ${pillW + 12}px)`,
                  height: isCompose ? fieldH + 12 : detailsH,
                  transition: `width 380ms cubic-bezier(.7,0,.2,1), height ${
                    animH ? "380ms cubic-bezier(.7,0,.2,1)" : "260ms cubic-bezier(.4,0,.2,1)"
                  }, box-shadow 500ms ease`,
                }}
              >
                {/* Content 1: message field */}
                <form
                  id={formId}
                  onSubmit={handleSubmit}
                  className="absolute inset-0 flex items-end p-1.5 pl-5"
                  style={{
                    ...composeLayer,
                    paddingRight: hasText ? CIRCLE + 12 : 20,
                    transition: `${composeLayer.transition}, padding-right 380ms cubic-bezier(.7,0,.2,1)`,
                  }}
                >
                  <div
                    ref={fieldRef}
                    className="relative min-w-0 flex-1"
                    style={{ height: fieldH, transition: "height 260ms cubic-bezier(.4,0,.2,1)" }}
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
                      placeholder={v.placeholder}
                      aria-label={v.placeholder}
                      autoComplete="off"
                      className="block h-full w-full resize-none overflow-y-auto border-0 bg-transparent p-0 py-[12px] pt-4 text-[15px] leading-6 text-saas-ink outline-none ring-0 [scrollbar-width:none] placeholder:text-saas-mut focus:outline-none focus:ring-0 [&::-webkit-scrollbar]:hidden"
                    />
                  </div>
                </form>

                {/* Content 2: contact details (or confirmation) */}
                <div ref={detailsRef} className="absolute inset-x-0 top-0" style={detailsLayer}>
                  {step === "done" ? (
                    <div className={`flex items-center gap-3 p-3 pb-0`}>
                      <span className="hero-send grid h-11 w-11 shrink-0 place-items-center rounded-full bg-saas-ink text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px]">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <p className="text-[14px] text-saas-ink" role="status">
                        Thanks! We&apos;ll reach out shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleDetails} className={`p-3`}>
                      <p className="px-2 py-2.5 text-[13px] text-saas-mut">Where can we reach you?</p>
                      <div className="flex flex-col gap-2 py-2">
                        <input
                          name="name"
                          type="text"
                          placeholder="Name (optional)"
                          autoComplete="name"
                          className={FIELD_CLS}
                        />
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            ref={emailRef}
                            name="email"
                            type="email"
                            required
                            pattern={EMAIL_PATTERN}
                            title="Enter a valid email address"
                            placeholder="Email"
                            autoComplete="email"
                            className={FIELD_CLS}
                          />
                          <input
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            required
                            maxLength={PHONE_LEN}
                            pattern="[0-9]{10}"
                            title="Enter a 10-digit phone number"
                            placeholder="Phone number (10 digits)"
                            onChange={(e) => {
                              e.currentTarget.value = e.currentTarget.value
                                .replace(/\D/g, "")
                                .slice(0, PHONE_LEN);
                            }}
                            autoComplete="tel"
                            className={FIELD_CLS}
                          />
                        </div>
                      </div>

                      {formError && (
                        <p role="alert" className="px-2 pb-1 text-[13px] text-red-600">
                          {formError}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <button
                          type="button"
                          disabled={sending}
                          onClick={() => {
                            setFormError("");
                            goStep("compose");
                          }}
                          aria-label="Back"
                          className="grid h-11 w-11 place-items-center rounded-full bg-white/80 disabled:opacity-50 text-saas-ink transition hover:bg-white active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(15,27,61,.08),0_6px_14px_-6px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.08)]"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px]">
                            <path d="M19 12H5" />
                            <path d="m11 6-6 6 6 6" />
                          </svg>
                        </button>

                        <button
                          type="submit"
                          disabled={sending}
                          className="hero-send relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-saas-ink px-6 disabled:cursor-not-allowed disabled:opacity-70 text-sm font-medium text-white hover:brightness-110 active:scale-95"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{ background: "radial-gradient(90% 75% at 50% 0%, rgba(255,255,255,.3), transparent 70%)" }}
                          />
                          <span className="relative">{sending ? "Sending…" : "Send"}</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="relative h-4 w-4">
                            <path d="M22 2 11 13" />
                            <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Send button for step 1: rides along while the box morphs, then fades out */}
              <button
                type="submit"
                form={formId}
                tabIndex={isCompose ? 0 : -1}
                aria-hidden={!isCompose}
                aria-label={hasText ? "Send" : v.primary.label}
                className="hero-send absolute h-11 overflow-hidden rounded-full bg-saas-ink text-sm font-medium text-white hover:brightness-110 active:scale-95"
                style={{
                  width: hasText ? CIRCLE : pillW,
                  right: hasText ? 6 : 0,
                  bottom: hasText || !narrow ? 6 : 0,
                  opacity: isCompose ? 1 : 0,
                  pointerEvents: isCompose ? "auto" : "none",
                  transform: isCompose ? undefined : "scale(.8)",
                }}
              >
                {/* Light hitting the top of the button */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(90% 75% at 50% 0%, rgba(255,255,255,.3), transparent 70%)",
                  }}
                />

                {/* Label (empty state) */}
                <span
                  ref={labelRef}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-[opacity,transform] duration-200 ${
                    hasText ? "scale-90 opacity-0" : "scale-100 opacity-100 delay-100"
                  }`}
                >
                  {v.primary.label}
                </span>

                {/* Send icon (typing state) */}
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

            {/* Pills: sit below the input, floating; they collapse away once the message passes 20 characters */}
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
                <ul className="flex flex-wrap items-start gap-x-2 gap-y-2 pb-4 pl-5 pr-3 pt-4" aria-label="Suggestions">
                  {v.suggestions.map((s, i) => (
                    <li
                      key={`${view}-${s}`}
                      className="hero-chip"
                      style={{
                        marginTop: [0, 6, 2][i % 3], // small fixed stagger
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + i * 0.7}s`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setValue(s)}
                        className="rounded-full bg-white/65 px-3.5 py-1.5 text-[13px] text-saas-mut backdrop-blur transition-all duration-300 hover:bg-white hover:text-saas-ink shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_6px_14px_-8px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_18px_-8px_rgba(15,27,61,.35),0_0_0_1px_rgba(15,27,61,.1)]"
                      >
                        {s}
                      </button>
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