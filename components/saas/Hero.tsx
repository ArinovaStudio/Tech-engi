"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { gsap } from "@/components/saas/gsapClient";
import HeroTiles from "@/components/saas/HeroTiles";

type ViewKey = "client" | "engineer";

type PillIconName = "bug" | "wrench" | "handshake" | "rocket" | "flag" | "users" | "search";

// A pill either fills the message box with its label, or (upload: true) opens the file picker
type Suggestion = {
  label: string;
  icon?: PillIconName;
  upload?: boolean;
  action?: () => void;
};

type View = {
  line1: string;
  line2: string;
  sub: string;
  placeholder: string;
  suggestions: Suggestion[];
  primary: { label: string; href: string };
};

const VIEWS: Record<ViewKey, View> = {
  client: {
    line1: "You imagine it.",
    line2: "We ship it.",
    sub: "Tech Engi brings clients, engineers and students into one workspace. Start a project from zero, or hand over one that stalled halfway.",
    placeholder: "Describe your project…",
    suggestions: [
      { label: "Build my idea from scratch", icon: "rocket" },
      { label: "Take over my stalled project and finish it", icon: "flag" },
      { label: "Put a small team on my build", icon: "users" },
    ],
    primary: { label: "Start a project", href: "#leads" },
  },
  engineer: {
    line1: "Get work that fits.",
    line2: "Finish what you started.",
    sub: "Find leads that match your skills, join a team, or bring in a partner to finish your own unfinished build.",
    placeholder: "What do you build best?",
    suggestions: [
      { label: "Help me to Find leads", icon: "search" },
      { label: "Add me to a team on a live project", icon: "users" },
      { label: "Find a partner to finish my unfinished build", icon: "handshake" },
    ],
    primary: { label: "Browse leads", href: "#leads" },
  }
  // bug: {
  //   line1: "Your bug doesn't wait for Monday.",
  //   line2: "Neither do we.",
  //   sub: "Keep your daily dose. Don’t let temporary bugs ruin your forever.",
  //   placeholder: "What's broken right now?",
  //   suggestions: [
  //     { label: "Debug my project", icon: "wrench", action: () => (window.open("https://techengi.in/login", "_blank")) },
  //     { label: "Work as my coworker for today, ₹3,480", icon: "handshake", action: () => (window.open("https://techengi.in/login", "_blank")) },
  //   ],
  //   primary: { label: "Post your first task", href: "#leads" },
  // },
};

const ORDER: ViewKey[] = ["client", "engineer"];

const CIRCLE = 44; // button diameter (px)
const LABEL_PAD = 40; // horizontal padding around the label (px)
const MIN_H = 44; // one line of text field (px)
const MAX_H = 116; // four lines, then it scrolls (px)
const HIDE_PILLS_AFTER = 10; // characters

// Attachments: each file up to 20 MB, a zip up to 50 MB, never more than 50 MB in total.
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_ZIP_BYTES = 50 * 1024 * 1024;
const MAX_TOTAL_BYTES = MAX_ZIP_BYTES;

// Allowed types, checked by file extension. The file dialog's own filter (accept) is only a
// hint and can be switched to "All files", so addPicked() enforces the rules again.
const FILE_EXTS = [".docx", ".pdf", ".png", ".jpg", ".jpeg"];
const FILE_ACCEPT = [
  ...FILE_EXTS,
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

const extOf = (name: string) => name.slice(name.lastIndexOf(".")).toLowerCase();
const isZip = (f: File) => extOf(f.name) === ".zip";
const isAllowedFile = (f: File) => FILE_EXTS.includes(extOf(f.name));

type Attachment = {
  id: string;
  kind: "file" | "image" | "zip";
  name: string;
  size: number;
  file: File;
};

const totalBytes = (list: Attachment[]) => list.reduce((n, a) => n + a.size, 0);

const fmtSize = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 * 1024
      ? `${Math.round(n / 1024)} KB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;

const PANEL_CLS =
  "rounded-[28px] bg-white/75 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(15,27,61,.10),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_14px_32px_-14px_rgba(15,27,61,.28),0_0_0_1px_rgba(15,27,61,.06)]";

// Same glass as the panel, with a smaller radius for the little "+" menu
const MENU_CLS = PANEL_CLS.replace("rounded-[28px]", "rounded-2xl");

const FIELD_CLS =
  "h-11 w-full rounded-full border-0 bg-[rgba(238,242,250,.75)] px-4 text-[14px] text-saas-ink outline-none ring-0 transition-shadow placeholder:text-saas-mut focus:outline-none focus:ring-0 shadow-[inset_0_2px_6px_rgba(15,27,61,.2),inset_0_1px_2px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.95),0_1px_0_rgba(255,255,255,.95)] focus:shadow-[inset_0_2px_6px_rgba(15,27,61,.22),inset_0_1px_2px_rgba(15,27,61,.14),0_0_0_3px_rgba(110,168,255,.3)]";

const GREEN_AT = 100; // characters until the border is fully green

// Focus glow for the box. With the progress border showing, the blue ring is left out.
const FOCUS_RING =
  "focus-within:shadow-[inset_0_2px_6px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_18px_40px_-14px_rgba(110,120,255,.45),0_0_0_3px_rgba(110,168,255,.28)]";
const FOCUS_PLAIN =
  "focus-within:shadow-[inset_0_2px_6px_rgba(15,27,61,.12),inset_0_-1px_1px_rgba(255,255,255,.9),0_1px_0_rgba(255,255,255,.95),0_18px_40px_-14px_rgba(15,27,61,.3)]";

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

// Small outline icon wrapper (same stroke style as the other icons in this file)
function Ico({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
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

const FileGlyph = ({ className }: { className?: string }) => (
  <Ico className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <path d="M14 2v6h6" />
  </Ico>
);

// Used for zip archives
const ZipGlyph = ({ className }: { className?: string }) => (
  <Ico className={className}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </Ico>
);

const ImageGlyph = ({ className }: { className?: string }) => (
  <Ico className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
  </Ico>
);

function PillIcon({ name }: { name: PillIconName }) {
  if (name === "handshake") {
    return (
      <span aria-hidden="true" className="text-[13px] leading-none">
        🤝
      </span>
    );
  }
  return (
    <Ico className="h-3.5 w-3.5">
      {name === "bug" && (
        <>
          <path d="m8 2 1.88 1.88" />
          <path d="M14.12 3.88 16 2" />
          <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
          <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
          <path d="M12 20v-9" />
          <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
          <path d="M6 13H2" />
          <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
          <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
          <path d="M22 13h-4" />
          <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </>
      )}
      {name === "wrench" && (
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      )}
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
  const [view, setView] = useState<ViewKey>("engineer");
  const [values, setValues] = useState<Record<ViewKey, string>>({
    client: "",
    engineer: "",
    // bug: "",
  });
  // Attachments are kept per tab, like the message text
  const [attachments, setAttachments] = useState<Record<ViewKey, Attachment[]>>({
    client: [],
    engineer: [],
    // bug: [],
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [attachMsg, setAttachMsg] = useState<{ text: string; error: boolean } | null>(null);
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
  const taRef = useRef<HTMLTextAreaElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  const v = VIEWS[view];
  const value = values[view];
  const attached = attachments[view];
  const hasText = value.trim().length > 0;
  const hasFiles = attached.length > 0;
  // The message can be sent with text, files, or both
  const ready = hasText || hasFiles;
  const pillW = (labelW || 140) + LABEL_PAD;
  const isCompose = step === "compose";
  const showPills = isCompose && value.length <= HIDE_PILLS_AFTER;
  // Border colour: orange -> yellow -> green (hue 24 -> 140) as the message gets longer
  const progress = Math.min(value.trim().length / GREEN_AT, 1);
  const hue = Math.round(24 + progress * 116);
  const ringOn = isCompose && hasText;
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

  useEffect(() => {
    if (isCompose && taRef.current) taRef.current.scrollTop = 0;
  }, [isCompose]);

  // Switching tab closes the "+" menu and clears any attachment notice
  useEffect(() => {
    setMenuOpen(false);
    setAttachMsg(null);
  }, [view]);

  // "+" menu: close on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (plusRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const goStep = (next: Step) => {
    setAnimH(true); // animate the container height only while switching steps
    setStep(next);
    window.setTimeout(() => setAnimH(false), 450);
  };

  const toggle = () => {
    const root = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Always step forward from the latest state (never from a stale `view`)
    const advance = (prev: ViewKey) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];

    if (!root || reduced) {
      setView(advance);
      setStep("compose");
      return;
    }

    const targets = root.querySelectorAll(".line-text, .hero-sub, .hero-cta");

    // Ignore clicks while the switch animation is still running
    if (gsap.isTweening(targets)) return;

    gsap
      .timeline()
      .to(targets, { y: -14, opacity: 0, duration: 0.2, stagger: 0.03 })
      .add(() => {
        setView(advance);
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
    if (!ready) {
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

  // Step 2: email + 10-digit phone required, name optional -> POST /api/new-request (multipart)
  const handleDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget; // grab it now, it is gone after the await
    const fd = new FormData(form); // already holds name, email and phone
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    if (!EMAIL_RE.test(email)) return showError("Please enter a valid email address.");
    if (!/^\d{10}$/.test(phone)) return showError("Phone number must be exactly 10 digits.");

    // Same size rule as the picker, checked again right before sending
    if (totalBytes(attached) > MAX_TOTAL_BYTES) {
      return showError(`Attachments are limited to ${fmtSize(MAX_TOTAL_BYTES)} in total.`);
    }

    fd.set("role", view); // "client" | "engineer" | "bug"
    fd.set("message", value.trim());
    attached.forEach((a) => fd.append("attachments", a.file, a.name));

    setFormError("");
    setSending(true);
    try {
      // No Content-Type header: the browser adds the multipart boundary itself
      const res = await fetch("/api/new-request", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.status === 413) {
        throw new Error("Your files are too large for the server. Try a smaller zip.");
      }
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

      form.reset();
      goStep("done");
      window.setTimeout(() => {
        setValue("");
        setAttached([]);
        setAttachMsg(null);
        goStep("compose");
      }, 3200);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const setValue = (text: string) => setValues((s) => ({ ...s, [view]: text }));
  const setAttached = (list: Attachment[]) => setAttachments((s) => ({ ...s, [view]: list }));

  // Add files (several at once, max 20 MB each) or a zip (max 50 MB)
  const addPicked = (list: FileList | null, zipOnly: boolean) => {
    if (!list || list.length === 0) return;
    const problems: string[] = [];
    const incoming: Attachment[] = [];

    for (const f of Array.from(list)) {
      const zip = isZip(f);
      if (zipOnly) {
        if (!zip) {
          problems.push(`${f.name} is not a .zip file`);
          continue;
        }
      } else if (!isAllowedFile(f)) {
        problems.push(
          zip
            ? `${f.name} is a zip. Use "Upload a zip" instead`
            : `${f.name} is not allowed (DOCX, PDF, PNG or JPG only)`
        );
        continue;
      }
      const limit = zip ? MAX_ZIP_BYTES : MAX_FILE_BYTES;
      if (f.size > limit) {
        problems.push(`${f.name} is over ${fmtSize(limit)}`);
        continue;
      }
      incoming.push({
        id: `${f.name}:${f.size}:${f.lastModified}`,
        kind: zip ? "zip" : /\.(png|jpe?g)$/i.test(f.name) ? "image" : "file",
        name: f.name,
        size: f.size,
        file: f,
      });
    }

    // Re-adding the same file replaces it instead of duplicating it
    const ids = new Set(incoming.map((a) => a.id));
    const next = [...attached.filter((a) => !ids.has(a.id)), ...incoming];

    if (totalBytes(next) > MAX_TOTAL_BYTES) {
      setAttachMsg({
        text: `Attachments are limited to ${fmtSize(MAX_TOTAL_BYTES)} in total.`,
        error: true,
      });
      return;
    }

    setAttached(next);
    setAttachMsg(problems.length ? { text: `${problems.join(". ")}.`, error: true } : null);
  };

  const removeAttachment = (id: string) => {
    setAttached(attached.filter((a) => a.id !== id));
    setAttachMsg(null);
  };

  const openPicker = (zip: boolean) => {
    setMenuOpen(false);
    (zip ? zipInputRef : fileInputRef).current?.click();
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
              aria-label="Switch between client, engineer and Fix a bug view"
              onClick={toggle}
              className="view-switch hero-entrance hero-entrance-delay-2"
              data-view={view}
            >
              <span>Client</span>
              <span>Engineer</span>
              {/* <span>Fix a Bug</span> */}
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
            {/* Hidden pickers: files/images (20 MB each), and a zip (50 MB) */}
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_ACCEPT}
              multiple
              hidden
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                addPicked(e.target.files, false);
                e.target.value = ""; // lets the same file be picked again
              }}
            />
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip"
              hidden
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                addPicked(e.target.files, true);
                e.target.value = "";
              }}
            />

            {/* One box that morphs: short input -> full width -> contact-details card */}
            <div
              className="relative"
              style={{
                paddingBottom: narrow && isCompose && !ready ? CIRCLE + 10 : 0,
                transition: "padding-bottom 380ms cubic-bezier(.7,0,.2,1)",
              }}
            >
              <div
                className={`relative overflow-hidden ${PANEL_CLS} ${ringOn ? FOCUS_PLAIN : FOCUS_RING}`}
                style={{
                  width: ready || narrow || !isCompose ? "100%" : `calc(100% - ${pillW + 12}px)`,
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
                  className="absolute inset-x-0 top-0 flex items-start p-1.5 pl-5"
                  style={{
                    ...composeLayer,
                    paddingRight: ready ? CIRCLE + 12 : 20,
                    transition: `${composeLayer.transition}, padding-right 380ms cubic-bezier(.7,0,.2,1)`,
                  }}
                >
                  {/* "+" : add files or a zip */}
                  <button
                    ref={plusRef}
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Add files or a zip"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="-ml-3.5 mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/80 text-saas-ink transition hover:bg-white active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(15,27,61,.08),0_6px_14px_-6px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.08)]"
                  >
                    <Ico className="h-[18px] w-[18px]">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </Ico>
                  </button>

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
                      ref={taRef}
                      rows={1}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (ready) e.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder={v.placeholder}
                      aria-label={v.placeholder}
                      autoComplete="off"
                      className="block h-full w-full resize-none overflow-y-auto border-0 bg-transparent p-0 py-2.5 text-sm leading-6 text-saas-ink outline-none ring-0 [scrollbar-width:none] placeholder:text-saas-mut focus:outline-none focus:ring-0 [&::-webkit-scrollbar]:hidden"
                    />
                  </div>
                </form>

                {/* Content 2: contact details (or confirmation) */}
                <div ref={detailsRef} className="absolute inset-x-0 top-0" style={detailsLayer}>
                  {step === "done" ? (
                    <div className="flex items-center gap-3 p-3 pb-0">
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
                    <form onSubmit={handleDetails} className="p-3">
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

                      <p className="mt-3 px-2 pb-1 text-[11px] leading-snug text-saas-mut">
                        We don&apos;t store any of your data. It&apos;s only sent to our team by email.
                      </p>
                    </form>
                  )}
                </div>

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

              {/* "+" menu: sits outside the box (which clips its content) */}
              {menuOpen && isCompose && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-label="Add files or a zip"
                  className={`absolute left-0 top-full z-10 mt-2 w-60 p-1.5 ${MENU_CLS}`}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openPicker(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] text-saas-ink transition hover:bg-white"
                  >
                    <FileGlyph className="h-4 w-4 shrink-0 text-saas-mut" />
                    Upload files (20MB max)
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openPicker(true)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] text-saas-ink transition hover:bg-white"
                  >
                    <ZipGlyph className="h-4 w-4 shrink-0 text-saas-mut" />
                    Upload a zip (50MB max)
                  </button>
                </div>
              )}

              {/* Send button for step 1: rides along while the box morphs, then fades out */}
              <button
                type="submit"
                form={formId}
                tabIndex={isCompose ? 0 : -1}
                aria-hidden={!isCompose}
                aria-label={ready ? "Send" : v.primary.label}
                className="hero-send absolute h-11 overflow-hidden rounded-full bg-saas-ink text-sm font-medium text-white hover:brightness-110 active:scale-95"
                style={{
                  width: ready ? CIRCLE : pillW,
                  right: ready ? 6 : 0,
                  bottom: ready || !narrow ? 6 : 0,
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
                    ready ? "scale-90 opacity-0" : "scale-100 opacity-100 delay-100"
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
                    ready
                      ? "rotate-0 scale-100 opacity-100 delay-100"
                      : "-rotate-45 scale-50 opacity-0"
                  }`}
                >
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                </svg>
              </button>
            </div>

            {/* Attached files: chips under the box, each with a remove button */}
            {hasFiles && step !== "done" && (
              <ul className="flex flex-wrap items-center gap-2 pl-2 pr-3 pt-3" aria-label="Attachments">
                {attached.map((a) => (
                  <li
                    key={a.id}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/65 py-1 pl-3 pr-1 text-[13px] text-saas-ink backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_6px_14px_-8px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.06)]"
                  >
                    {a.kind === "zip" ? (
                      <ZipGlyph className="h-3.5 w-3.5 shrink-0 text-saas-mut" />
                    ) : a.kind === "image" ? (
                      <ImageGlyph className="h-3.5 w-3.5 shrink-0 text-saas-mut" />
                    ) : (
                      <FileGlyph className="h-3.5 w-3.5 shrink-0 text-saas-mut" />
                    )}
                    <span className="max-w-[160px] truncate">{a.name}</span>
                    <span className="shrink-0 text-saas-mut">{fmtSize(a.size)}</span>
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => removeAttachment(a.id)}
                      aria-label={`Remove ${a.name}`}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-saas-mut transition hover:bg-white hover:text-saas-ink disabled:opacity-50"
                    >
                      <Ico className="h-3 w-3">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </Ico>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {attachMsg && step !== "done" && (
              <p
                role={attachMsg.error ? "alert" : "status"}
                className={`px-2 pt-2 text-[13px] ${attachMsg.error ? "text-red-600" : "text-saas-mut"}`}
              >
                {attachMsg.text}
              </p>
            )}

            {/* Pills: sit below the input, floating; they collapse away once the message passes 10 characters */}
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
                      key={`${view}-${s.label}`}
                      className="hero-chip"
                      style={{
                        marginTop: [0, 6, 2][i % 3], // small fixed stagger
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + i * 0.7}s`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => (s.action ? s.action() : setValue(s.label))}
                        className={`rounded-full bg-white/65 px-3.5 py-1.5 text-[13px] text-saas-mut backdrop-blur transition-all duration-300 hover:bg-white hover:text-saas-ink shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_6px_14px_-8px_rgba(15,27,61,.3),0_0_0_1px_rgba(15,27,61,.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_18px_-8px_rgba(15,27,61,.35),0_0_0_1px_rgba(15,27,61,.1)]${
                          s.icon ? " inline-flex items-center gap-1.5" : ""
                        }`}
                      >
                        {s.icon && <PillIcon name={s.icon} />}
                        {s.label}
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