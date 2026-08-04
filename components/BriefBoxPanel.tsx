import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

/**
 * Tech Engi — Project Brief Box
 * Single-file React + TypeScript + Tailwind conversion of the original
 * static HTML/CSS/JS component. Drop <BriefBox /> anywhere.
 *
 * Light/dark mode: uses Tailwind's `dark:` variant, driven by the standard
 * class strategy — add/remove a `dark` class on <html> or a parent element
 * (e.g. via next-themes or a manual toggle). Requires `darkMode: "class"`
 * in tailwind.config (Tailwind's default in most setups).
 *
 * Color tokens:
 *              Light        Dark (original design system)
 *   page bg    gray-50      #0d1117
 *   card       white        #161b27
 *   input-bg   gray-100     #1c2333
 *   border     gray-200     #2a3550
 *   amber      #E07B00      #E07B00  (accent stays constant)
 *   teal       #00A88F      #00C9A7  (accent stays constant)
 *   text       gray-900     #f0f6ff
 *   muted      gray-500     #6b7a99
 */

const DOMAINS = [
  { id: "ai", label: "AI / ML", emoji: "🤖" },
  { id: "iot", label: "IoT", emoji: "📡" },
  { id: "pcb", label: "PCB Design", emoji: "🔲" },
  { id: "sw", label: "Software", emoji: "💻" },
  { id: "fw", label: "Firmware", emoji: "⚙️" },
  { id: "rob", label: "Robotics", emoji: "🦾" },
  { id: "cloud", label: "Cloud / DevOps", emoji: "☁️" },
  { id: "emb", label: "Embedded", emoji: "🔧" },
  { id: "other", label: "Other", emoji: "+" },
] as const;

const MAX_CHARS = 1000;

export default function BriefBox() {
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDomains.size === 0) {
      toast.error("Please select at least one engineering domain.");
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          domains: Array.from(selectedDomains),
          brief: brief.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit brief.");
      }

      toast.success("Brief submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      console.error("Brief submission error:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full font-sans transition-colors">
      <div className="relative w-full overflow-hidden rounded-[14px] border border-gray-200 dark:border-[#2a3550] bg-white dark:bg-[#161b27] shadow-sm dark:shadow-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#E07B00] before:content-['']">
        {!submitted ? (
          <>
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 dark:border-[#2a3550] px-6 pb-[18px] pt-[22px]">
              <div>
                <div className="mb-[5px] flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[2px] text-[#E07B00] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#E07B00] before:shadow-[0_0_8px_rgba(224,123,0,0.25)] before:content-['']">
                  Start your project
                </div>
                <div className="text-[22px] font-bold leading-tight tracking-[-0.4px] text-gray-900 dark:text-[#f0f6ff]">
                  What are you building?
                </div>
              </div>
              <div className="flex-shrink-0 whitespace-nowrap rounded-full border border-[#00A88F]/25 dark:border-[#00C9A7]/25 bg-[#00A88F]/10 dark:bg-[#00C9A7]/10 px-[11px] py-[5px] text-[11px] font-semibold tracking-[0.3px] text-[#00A88F] dark:text-[#00C9A7]">
                ⚡ 24hr Match
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col gap-[18px] px-6 pb-6 pt-[22px]">
              {/* DOMAIN TAGS */}
              <div>
                <span className="mb-[10px] block text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 dark:text-[#6b7a99]">
                  Your engineering domain
                </span>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map((d) => {
                    const active = selectedDomains.has(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => toggleDomain(d.id)}
                        className={`inline-flex select-none items-center gap-[5px] rounded-md border px-[13px] py-[7px] text-[13px] font-medium tracking-[0.2px] transition-all duration-150 ${
                          active
                            ? "border-[#E07B00] bg-[#E07B00] font-bold text-black shadow-[0_0_12px_rgba(224,123,0,0.25)]"
                            : "border-gray-200 dark:border-[#2a3550] bg-gray-100 dark:bg-[#1c2333] text-gray-500 dark:text-[#6b7a99] hover:border-[#E07B00] hover:bg-[#E07B00]/[0.12] hover:text-gray-900 dark:hover:text-[#f0f6ff]"
                        }`}
                      >
                        {d.emoji} {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FORM */}
              <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
                {/* TEXTAREA */}
                <div>
                  <span className="mb-[10px] block text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 dark:text-[#6b7a99]">
                    Describe your project or problem
                  </span>
                  <div className="relative">
                    <textarea
                      className="min-h-[130px] w-full resize-y rounded-lg border border-gray-200 dark:border-[#2a3550] bg-gray-100 dark:bg-[#1c2333] px-4 py-[14px] text-[14.5px] leading-[1.65] text-gray-900 dark:text-[#f0f6ff] outline-none transition-colors duration-200 caret-[#E07B00] placeholder:text-sm placeholder:text-gray-500 dark:placeholder:text-[#6b7a99] focus:border-[#E07B00] focus:shadow-[0_0_0_3px_rgba(224,123,0,0.12)]"
                      placeholder="Tell us what you're building, what problem needs solving, or what you want to launch. The more detail you share, the better we can match you with the right engineer."
                      maxLength={MAX_CHARS}
                      required
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                    />
                    <span
                      className={`pointer-events-none absolute bottom-[10px] right-3 text-[11px] tabular-nums ${
                        brief.length > 50 ? "text-[#E07B00]" : "text-gray-500 dark:text-[#6b7a99]"
                      }`}
                    >
                      {brief.length} / {MAX_CHARS}
                    </span>
                  </div>
                </div>

                {/* NAME + CONTACT */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 dark:text-[#6b7a99]">
                      Your name
                    </span>
                    <input
                      type="text"
                      placeholder="Tarun K"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg border border-gray-200 dark:border-[#2a3550] bg-gray-100 dark:bg-[#1c2333] px-[14px] py-3 text-sm text-gray-900 dark:text-[#f0f6ff] outline-none transition-colors duration-200 caret-[#E07B00] placeholder:text-gray-500 dark:placeholder:text-[#6b7a99] focus:border-[#E07B00] focus:shadow-[0_0_0_3px_rgba(224,123,0,0.12)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 dark:text-[#6b7a99]">
                      WhatsApp or Email
                    </span>
                    <input
                      type="text"
                      placeholder="+91 98765 or email"
                      required
                      autoComplete="off"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="rounded-lg border border-gray-200 dark:border-[#2a3550] bg-gray-100 dark:bg-[#1c2333] px-[14px] py-3 text-sm text-gray-900 dark:text-[#f0f6ff] outline-none transition-colors duration-200 caret-[#E07B00] placeholder:text-gray-500 dark:placeholder:text-[#6b7a99] focus:border-[#E07B00] focus:shadow-[0_0_0_3px_rgba(224,123,0,0.12)]"
                    />
                  </div>
                </div>

                {/* TIMELINE HINT */}
                <div className="flex items-center gap-2.5 rounded-lg border border-[#E07B00]/[0.18] bg-[#E07B00]/[0.06] px-[14px] py-[11px]">
                  <span className="flex-shrink-0 text-lg">⏱</span>
                  <span className="text-[13px] leading-[1.5] text-gray-600 dark:text-white/65">
                    <strong className="text-gray-900 dark:text-[#f0f6ff]">What happens next:</strong> We review your
                    brief and match you with a verified engineer within 24 hours. You'll be
                    contacted on WhatsApp or email directly.
                  </span>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#E07B00] px-6 py-4 text-[15px] font-bold uppercase tracking-[0.5px] text-black transition-all duration-150 hover:-translate-y-px hover:bg-[#f08c10] hover:shadow-[0_4px_20px_rgba(224,123,0,0.25)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Get Matched in 24 Hours"}
                  {!submitting && (
                    <span className="text-lg transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                {/* TRUST STRIP */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11.5px] text-gray-500 dark:text-[#6b7a99]">
                    🔒 NDA Protected
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-gray-200 dark:bg-[#2a3550]" />
                  <span className="flex items-center gap-1 text-[11.5px] text-gray-500 dark:text-[#6b7a99]">
                    ✓ Free to post
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-gray-200 dark:bg-[#2a3550]" />
                  <span className="flex items-center gap-1 text-[11.5px] text-gray-500 dark:text-[#6b7a99]">
                    No commitment required
                  </span>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="flex flex-col items-center justify-center gap-[14px] px-8 py-12 text-center">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-[#00A88F] dark:border-[#00C9A7] bg-[#00A88F]/[0.12] dark:bg-[#00C9A7]/[0.12] text-2xl text-[#00A88F] dark:text-[#00C9A7] animate-pulse">
              ✓
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-[#f0f6ff]">Brief received.</div>
            <div className="max-w-[360px] text-sm leading-[1.6] text-gray-500 dark:text-[#6b7a99]">
              We've got your project details. A verified engineer match will reach out to you
              within 24 hours.
            </div>
            <div className="mt-2 flex w-full max-w-[360px] flex-col gap-2">
              {[
                { time: "Now", desc: "Brief reviewed by Tech Engi team" },
                { time: "2–4 hrs", desc: "Matched with a verified engineer" },
                { time: "24 hrs", desc: "Engineer contacts you on WhatsApp or email" },
              ].map((row) => (
                <div
                  key={row.time}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-[#2a3550] bg-gray-100 dark:bg-[#1c2333] px-[14px] py-[11px] text-left"
                >
                  <span className="min-w-[50px] whitespace-nowrap text-[11px] font-semibold tabular-nums text-[#E07B00]">
                    {row.time}
                  </span>
                  <span className="text-[13px] text-gray-600 dark:text-white/65">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}