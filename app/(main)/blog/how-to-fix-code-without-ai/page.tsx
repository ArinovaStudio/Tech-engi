import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BookOpen,
  Briefcase,
  Bug,
  Clock3,
  Coffee,
  FileText,
  FolderOpen,
  GitCommit,
  GraduationCap,
  Lock,
  MessageCircle,
  Repeat,
  Rocket,
  Scissors,
  Eye,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/how-to-fix-code-without-ai/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "how-to-fix-code-without-ai";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "How to Fix Your Code Without AI: A Human Debugging Method That Actually Works";
const META_TITLE = "How to Fix Code Without AI Help: Step-by-Step Debugging | Tech Engi";
const META_DESCRIPTION =
  "No ChatGPT, no Copilot. A 9-step human debugging method, the right tools for Python, JavaScript, React, Node, SQL and embedded, and when to call a human expert.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-10-22";
const MODIFIED = "2026-10-22";
const PUBLISHED_LABEL = "22 October 2026";
const READ_TIME = "8 min read";

const KEYWORDS = [
  "how to fix code without AI",
  "how do I fix my code",
  "how to debug code step by step",
  "debugging without ChatGPT",
  "fix code myself",
  "rubber duck debugging",
  "git bisect",
  "python debugging pdb",
  "javascript debugging devtools",
  "how to find a bug in code",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: AUTHOR }],
  alternates: { canonical: URL_FULL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "article",
    url: URL_FULL,
    siteName: "Tech Engi",
    locale: "en_IN",
    title: H1_TITLE,
    description: META_DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: [AUTHOR],
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: H1_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: H1_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/* ===============================================================
   CONTENT   (**bold**, *italic*, `code`)
=============================================================== */

const toc = [
  { id: "why", label: "Why fix code without AI?" },
  { id: "method", label: "The 9-step method" },
  { id: "tools", label: "Free tools by language" },
  { id: "first-check", label: "First thing to check" },
  { id: "call-human", label: "When to call a human" },
  { id: "faq", label: "FAQ" },
];

const why = [
  { icon: GraduationCap, lead: "You actually learn.", t: "If AI fixes it, you'll hit the same bug next week. If you fix it, you won't." },
  { icon: Briefcase, lead: "Interviews, vivas and exams don't allow AI.", t: "The skill has to be yours." },
  { icon: Lock, lead: "Some companies restrict pasting code into AI tools", t: "to protect source code and customer data." },
  { icon: Bot, lead: "AI is often \u201Calmost right\u201D.", t: "In Stack Overflow's 2025 Developer Survey, 66% of developers said that was their biggest frustration with AI tools, and 45% said debugging AI-generated code takes more time." },
];

const steps = [
  { icon: BookOpen, title: "Read the whole error, top to bottom", t: "The first line says *what* broke. The stack trace below it says *where*. Find the first line in the trace that points to **your** file, not a library. That's where you start.", extra: "trace" },
  { icon: Repeat, title: "Reproduce it on purpose", t: "Write down the exact steps that trigger the bug. If you can't make it happen on demand, you can't prove you fixed it." },
  { icon: Scissors, title: "Isolate it", t: "Cut the problem in half. Comment out half the code, or skip half the steps. Does the bug still happen? Keep halving until only a few lines are left. This is the fastest way to find a bug in code you don't understand.", extra: "halving" },
  { icon: Eye, title: "Look at the actual values", t: "Most bugs are a variable holding something you didn't expect: undefined, null, an empty list, a string instead of a number. Print or log the values right before the crash: `console.log()`, `print()`, `System.out.println()`." },
  { icon: Bug, title: "Use a real debugger", t: "Set a breakpoint, run the code, and step through it line by line while watching every variable. It feels slow the first time. After that, it's the most powerful tool you have." },
  { icon: GitCommit, title: "Ask \u201Cwhat changed?\u201D", t: "If it worked yesterday, something changed. Run `git diff`. Check package versions, `.env` files and recent deploys. If you can't spot it, `git bisect` will find the exact commit that broke it." },
  { icon: MessageCircle, title: "Explain it out loud (rubber duck debugging)", t: "Explain the code line by line to a friend, a colleague, or a rubber duck on your desk. Halfway through, you'll often hear yourself say the bug." },
  { icon: FileText, title: "Read the docs, not just the answers", t: "Check the official documentation and changelog for the function or library you're using. Many \u201Cbugs\u201D are a parameter that changed in the last version." },
  { icon: Coffee, title: "Take a 15-minute break", t: "After two hours, your brain stops seeing what's in front of it. Walk away, come back, and the obvious thing often jumps out." },
];

const tools = [
  { stack: "JavaScript", values: "console.log(), console.table()", step: "Chrome DevTools → Sources → breakpoints", changed: "git diff" },
  { stack: "React / Next.js", values: "React DevTools (props, state)", step: "Breakpoints in DevTools; debugger; statement", changed: "git bisect" },
  { stack: "Node.js", values: "console.log(), logging library", step: "node --inspect + Chrome DevTools or VS Code", changed: "npm ls for versions" },
  { stack: "Python", values: "print(), logging", step: "breakpoint() / pdb, VS Code debugger", changed: "pip freeze to compare versions" },
  { stack: "Java", values: "System.out.println(), logger", step: "IntelliJ / Eclipse / VS Code debugger", changed: "git bisect" },
  { stack: "SQL", values: "Run each part of the query separately", step: "EXPLAIN / EXPLAIN ANALYZE", changed: "Compare with a known-good query" },
  { stack: "Embedded / IoT", values: "Serial monitor prints", step: "Hardware debugger (JTAG/SWD), logic analyzer", changed: "Multimeter on power and signal lines" },
];

const errors = [
  { e: "Cannot read properties of undefined", c: "Which variable is undefined, and where was it supposed to be set?" },
  { e: "ModuleNotFoundError / Cannot find module", c: "Is it installed in *this* environment? Is the import path spelled right?" },
  { e: "blocked by CORS policy", c: "The **server's** CORS settings, not the frontend" },
  { e: "500 Internal Server Error", c: "The **server logs**: the real error is there, not in the browser" },
  { e: "npm ERR! ERESOLVE", c: "Which two packages want different versions of the same dependency" },
  { e: "Hydration failed", c: "Something rendering differently on server and browser (dates, random values, window)" },
  { e: "Works locally, fails on server", c: "Environment variables, Node/Python version, file paths, case-sensitive filenames" },
  { e: "ESP32 keeps resetting", c: "Power supply first (brownout), then watchdog timers" },
];

const triggers = [
  { icon: Clock3, lead: "You've been stuck for more than 2–3 hours", t: "with no new clues." },
  { icon: Rocket, lead: "The bug is blocking a release, a client or production.", t: "" },
  { icon: Repeat, lead: "It only happens sometimes", t: "(race conditions, load-related bugs)." },
  { icon: FolderOpen, lead: "It's in legacy code", t: "nobody on the team understands." },
];

const faqs = [
  { q: "How do I fix my code without using AI?", a: "Read the full error, reproduce the bug, isolate it by removing code until it disappears, print the values involved, step through with a debugger, check what changed with git diff, explain it out loud, read the docs, and take a break if you're stuck." },
  { q: "How do beginners debug code?", a: "Start with the error message and the line number it points to, then add print or console.log statements to see what each variable holds just before the error. Once that's comfortable, learn your editor's debugger." },
  { q: "What is rubber duck debugging?", a: "Explaining your code line by line to someone, or something, like a rubber duck. Saying each step out loud often reveals the mistake." },
  { q: "What is git bisect?", a: "A Git command that finds the exact commit that introduced a bug by testing commits between a known-good and a known-bad version, halving the range each time." },
  { q: "Who can fix my code if I can't?", a: "A colleague, a community like Stack Overflow, or a verified engineer through Tech Engi (techengi.in), where an AI matches your bug to an experienced human engineer who fixes it." },
];

/* ===============================================================
   STRUCTURED DATA (JSON-LD): Article + Breadcrumb + FAQPage
=============================================================== */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${URL_FULL}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": URL_FULL },
      headline: H1_TITLE,
      description: META_DESCRIPTION,
      image: [`${SITE_URL}${OG_IMAGE}`],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      inLanguage: "en-IN",
      keywords: KEYWORDS.join(", "),
      author: {
        "@type": "Person",
        name: AUTHOR,
        jobTitle: "Founder",
        worksFor: { "@type": "Organization", name: "Tech Engi", url: SITE_URL },
      },
      publisher: { "@type": "Organization", name: "Tech Engi", url: SITE_URL },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: H1_TITLE, item: URL_FULL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/* ===============================================================
   LAYOUT TOKENS
=============================================================== */

const TEXT = "w-full max-w-[640px]";
const P = "text-[16px] leading-[1.85] text-slate-600";

/* ===============================================================
   PAGE
=============================================================== */

export default function HowToFixCodeWithoutAiPage() {
  return (
    <main className="bg-white text-[#050a30]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ============================ HERO ============================ */}

      <header className="relative overflow-hidden bg-[#fff3d6]">
        <div className="pointer-events-none absolute -left-32 top-48 h-72 w-72 rounded-full bg-[#1257e8]/[0.06]" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-20 px-6 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Breadcrumb" className="text-[13px] text-slate-600">
              <ol className="flex items-center gap-2.5">
                <li><Link href="/" className="transition hover:text-[#1257e8]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="transition hover:text-[#1257e8]">Blog</Link></li>
              </ol>
            </nav>

            <h1 className="mt-9 text-[30px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[40px] lg:text-[44px]">
              How to Fix Your Code Without AI:{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                A Human Debugging Method
              </span>{" "}
              That Actually Works
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              No ChatGPT, no Copilot. Nine steps, the right free tools for your
              stack, and when to call a human.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
              <span className="font-semibold text-[#050a30]">By {AUTHOR}, Founder of Tech Engi</span>
              <span>Chennai</span>
              <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {READ_TIME}
              </span>
            </div>
          </div>

          <figure>
            <HeroCard />
            <figcaption className="sr-only">
              The nine steps of the method: read, reproduce, isolate, values,
              debugger, what changed, rubber duck, docs, break.
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ============================ BODY ============================ */}

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-28">
        <article className="min-w-0">
          {/* TL;DR */}

          <aside className={`${TEXT} rounded-[24px] bg-amber-100 p-7 sm:p-10`}>
            <h2 className="text-[17px] font-bold">TL;DR</h2>
            <p className="mt-5 text-[15px] leading-7 text-slate-800">
              <Rich t="You can fix most bugs without AI by following one method: read the full error, reproduce it, isolate it, inspect the values, use a real debugger, check what changed, explain it out loud, read the docs, and take a break. Each language has free tools for this, from Chrome DevTools to Python's `breakpoint()`. If you're still stuck after a few hours, get a fresh pair of human eyes. That's what **Tech Engi** does: **AI matches. Humans fix.**" />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your bug to a verified engineer by tech stack, skills and budget, and an experienced human engineer fixes it." />
            </p>
          </aside>

          {/* ---------------- WHY ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="why">Why fix code without AI?</H2>
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {why.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 2 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[15px] leading-6">
                    <strong className="font-bold">{lead}</strong>{" "}
                    <span className="text-slate-700">{t}</span>
                  </p>
                </li>
              ))}
            </ul>

            <figure className="mt-5">
              <SurveyBars />
              <figcaption className="sr-only">Stack Overflow 2025: 66% and 45%.</figcaption>
            </figure>
          </section>

          {/* ---------------- METHOD ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="method">The 9-step human debugging method</H2>
            </div>

            <ol className="mt-12 space-y-5">
              {steps.map(({ icon: Icon, title, t, extra }, i) => (
                <li key={title} className="rounded-[24px] bg-slate-50 p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-[#050a30]">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="pt-1.5 text-[18px] font-bold leading-[1.25] tracking-[-0.025em]">{title}</h3>
                      <p className="mt-3 text-[14.5px] leading-7 text-slate-600">
                        <Rich t={t} />
                      </p>
                    </div>
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1257e8] sm:flex">
                      <Icon size={19} />
                    </span>
                  </div>
                  {extra === "trace" && <TraceMock />}
                  {extra === "halving" && <HalvingBars />}
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- TOOLS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="tools">Free debugging tools by language (no AI needed)</H2>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {tools.map((tl, i) => (
                <li key={tl.stack} className="rounded-[24px] border border-slate-200 bg-white p-7">
                  <p className="inline-flex rounded-full bg-[#e6eeff] px-3.5 py-1.5 text-[13px] font-bold text-[#1257e8]">
                    {tl.stack}
                  </p>
                  <dl className="mt-5 space-y-3.5 text-[13.5px] leading-6">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Look at values</dt>
                      <dd className="font-mono text-[12.5px] text-slate-700">{tl.values}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Step through code</dt>
                      <dd className="font-mono text-[12.5px] text-slate-700">{tl.step}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Find what changed</dt>
                      <dd className="font-mono text-[12.5px] text-slate-700">{tl.changed}</dd>
                    </div>
                  </dl>
                  <span className={`mt-5 block h-1.5 rounded-full ${i % 2 === 0 ? "bg-[#1257e8]" : "bg-amber-500"}`} />
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- FIRST CHECK ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="first-check">First thing to check for common errors</H2>
            </div>

            <ul className="mt-12 space-y-3.5">
              {errors.map((r) => (
                <li
                  key={r.e}
                  className="grid items-center gap-3 rounded-[20px] bg-slate-50 p-5 md:grid-cols-[1fr_auto_1.4fr] md:gap-5"
                >
                  <p className="rounded-xl bg-[#050a30] px-4 py-3 font-mono text-[12.5px] leading-5 text-red-300">
                    {r.e}
                  </p>
                  <ArrowRight size={18} className="hidden text-amber-500 md:block" />
                  <p className="text-[14px] leading-6 text-slate-700">
                    <Rich t={r.c} />
                  </p>
                </li>
              ))}
            </ul>

            <div className={TEXT}>
              <p className={`${P} mt-8`}>
                For a deeper look at each bug type, read{" "}
                <Link href="/blog/common-coding-bugs-why-hard-to-fix" className="font-semibold text-[#1257e8] underline">
                  The 14 bugs that break code every day
                </Link>
                .
              </p>
            </div>
          </section>

          {/* ---------------- CALL A HUMAN ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="call-human">When to stop and call a human</H2>
              <Para t="Fixing it yourself is the goal, but not at any cost. Get help when:" />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {triggers.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 2 === 0 ? "bg-amber-100" : "bg-[#e6eeff]"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 2 === 0 ? "text-amber-600" : "text-[#1257e8]"} />
                  </span>
                  <p className="mt-6 text-[15px] leading-6">
                    <strong className="font-bold">{lead}</strong> <span className="text-slate-700">{t}</span>
                  </p>
                </li>
              ))}
            </ul>

            <div className={TEXT}>
              <Para t="**On Tech Engi:** post the bug, pay 25% upfront to confirm, and an AI matches you to a verified engineer whose stack and experience fit. A **human** engineer fixes it, and if you ask, explains the fix so you learn it too. You track progress live and pay by milestone through escrow." />
              <p className={`${P} mt-6`}>
                <strong className="text-[#050a30]">Need someone for the whole day?</strong> Book a{" "}
                <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] underline">
                  verified co-worker for a day at ₹3,480
                </Link>
                .
              </p>
            </div>

            <div className="mt-16">
              <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
                <div className="relative max-w-md">
                  <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                    Stuck right now?
                  </p>
                  <p className="mt-4 text-[14.5px] leading-7 text-white/85">
                    Post your bug at techengi.in. AI matches. Humans fix.
                  </p>
                  <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                    >
                      Post Your Bug
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                    >
                      Join as Builder
                    </Link>
                  </div>
                </div>
              </div>

              <p className={`${TEXT} mt-10 text-[14px] leading-7 text-slate-600`}>
                <em>Read next:</em>{" "}
                <Link href="/blog/who-can-fix-my-code-how-soon" className="font-semibold text-[#1257e8] hover:underline">
                  Who can fix my code, and how soon? →
                </Link>
              </p>
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="faq">Frequently asked questions</H2>
              <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold leading-7 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-200 text-lg leading-none text-amber-800 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 pr-10 text-[14.5px] leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>

              <h3 className="mt-16 text-[17px] font-bold">Sources</h3>
              <a
                href="https://venturebeat.com/ai/stack-overflow-data-reveals-the-hidden-productivity-tax-of-almost-right-ai-code"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-4 inline-flex items-start gap-2 text-[14px] leading-6 text-slate-600 transition hover:text-[#1257e8]"
              >
                <ArrowUpRight size={15} className="mt-1 shrink-0" />
                Stack Overflow 2025 Developer Survey coverage — VentureBeat
              </a>
            </div>
          </section>

          {/* ---------------- AUTHOR ---------------- */}

          <section className={`${TEXT} mt-20 flex items-start gap-5 rounded-[24px] bg-slate-50 p-7`}>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1257e8] text-[16px] font-bold text-white">
              TP
            </span>
            <div>
              <p className="text-[15px] font-bold">{AUTHOR}</p>
              <p className="text-[12.5px] text-slate-500">{AUTHOR_ROLE}</p>
              <p className="mt-3 text-[14px] leading-6 text-slate-600">
                About the author: {AUTHOR} is the founder of Tech Engi and
                TSquareY1 OPC Private Limited (Chennai), with about 3 years of
                hands-on work in embedded systems, PCB design, robotics and IoT.
              </p>
            </div>
          </section>
        </article>

        {/* ------------------- SIDEBAR ------------------- */}

        <aside className="order-first lg:order-none">
          <details className="rounded-2xl bg-amber-100 p-5 lg:hidden">
            <summary className="cursor-pointer text-[13px] font-semibold">In this article</summary>
            <TocList />
          </details>
          <div className="sticky top-28 hidden lg:block">
            <p className="text-[11px] font-semibold text-slate-500">In this article</p>
            <TocList />
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ===============================================================
   HELPERS
   Rich: **bold**, *italic*, `code`
=============================================================== */

function Rich({ t }: { t: string }) {
  const parts = t.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((s, i) => {
        if (s.startsWith("**")) return <strong key={i} className="font-bold text-[#050a30]">{s.slice(2, -2)}</strong>;
        if (s.startsWith("`")) return <code key={i} className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.88em] text-[#1257e8]">{s.slice(1, -1)}</code>;
        if (s.startsWith("*")) return <em key={i}>{s.slice(1, -1)}</em>;
        return <span key={i}>{s}</span>;
      })}
    </>
  );
}

function Para({ t }: { t: string }) {
  return (
    <p className={`${P} mt-6`}>
      <Rich t={t} />
    </p>
  );
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-[24px] font-bold leading-[1.18] tracking-[-0.035em] sm:text-[31px]"
    >
      {children}
    </h2>
  );
}

function TocList() {
  return (
    <ol className="mt-5 space-y-3.5 border-l-2 border-amber-300 pl-4 text-[12.5px] leading-5">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="text-slate-600 transition hover:text-[#1257e8]">
            {t.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/* ===============================================================
   VISUALS (pure HTML/Tailwind, no image files)
=============================================================== */

/* Hero: the nine steps as a grid */
function HeroCard() {
  const labels = ["Read", "Reproduce", "Isolate", "Values", "Debugger", "What changed", "Rubber duck", "Docs", "Break"];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_30px_80px_rgba(5,10,48,0.12)]">
        <div className="bg-[#050a30] p-5 font-mono text-[12px] leading-6 text-white sm:p-6">
          <p className="text-white/50">$ node --inspect app.js</p>
          <p className="text-emerald-300">Debugger attached.</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-2.5 py-1 font-sans text-[10.5px] font-bold text-[#050a30]">
            No AI needed
          </p>
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-[14px] font-bold">The 9-step method</p>
          <ol className="mt-4 grid grid-cols-3 gap-2.5">
            {labels.map((l, i) => (
              <li
                key={l}
                className={`rounded-xl p-3 text-center ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}
              >
                <p className="text-[18px] font-bold leading-none text-[#1257e8]">{i + 1}</p>
                <p className="mt-1.5 text-[10.5px] font-semibold leading-4 text-slate-700">{l}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="absolute -left-4 top-36 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Bug size={15} className="text-[#1257e8]" />
        Real debugger
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Coffee size={15} className="text-amber-600" />
        15-minute break
      </div>
    </div>
  );
}

/* Why: Stack Overflow 2025 numbers */
function SurveyBars() {
  const rows = [
    { v: 66, l: "Biggest frustration with AI tools: \u201Calmost right, but not quite\u201D", c: "bg-[#1257e8]" },
    { v: 45, l: "Say debugging AI-generated code takes more time", c: "bg-amber-500" },
  ];
  return (
    <div className="rounded-[24px] bg-[#050a30] p-7 text-white sm:p-8">
      <p className="text-[12.5px] font-semibold text-amber-300">Stack Overflow 2025 Developer Survey</p>
      <ul className="mt-6 space-y-6">
        {rows.map((r) => (
          <li key={r.l}>
            <div className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className="font-semibold text-white/85">{r.l}</span>
              <span className="text-[22px] font-bold tracking-[-0.03em]">{r.v}%</span>
            </div>
            <div className="mt-2.5 h-4 w-full overflow-hidden rounded-full bg-white/10">
              <span className={`block h-full rounded-full ${r.c}`} style={{ width: `${r.v}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Step 1: where to start in a stack trace (illustration) */
function TraceMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-[#050a30] font-mono text-[12px] leading-6 text-white">
      <div className="space-y-1.5 p-5">
        <p className="flex flex-wrap items-center gap-x-3">
          <span className="text-red-300">TypeError: Cannot read properties of undefined</span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-sans text-[10.5px] font-semibold">what broke</span>
        </p>
        <p className="text-white/40">&nbsp;&nbsp;at render (node_modules/some-lib/render.js:42)</p>
        <p className="flex flex-wrap items-center gap-x-3 text-amber-300">
          <span>&nbsp;&nbsp;at ProfileCard (src/ProfileCard.js:18)</span>
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 font-sans text-[10.5px] font-bold text-[#050a30]">your file: start here</span>
        </p>
      </div>
      <p className="border-t border-white/10 px-5 py-2.5 font-sans text-[11px] text-white/45">Illustration</p>
    </div>
  );
}

/* Step 3: halving until a few lines are left */
function HalvingBars() {
  const rows = [
    { l: "All the code", w: 100 },
    { l: "Half", w: 50 },
    { l: "Half again", w: 25 },
    { l: "A few lines left", w: 10, found: true },
  ];
  return (
    <div className="mt-6 space-y-3 rounded-2xl bg-white p-5">
      {rows.map((r) => (
        <div key={r.l} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-[12px] font-semibold text-slate-600">{r.l}</span>
          <div className="h-3.5 flex-1 rounded-full bg-slate-100">
            <span
              className={`flex h-full items-center justify-end rounded-full ${r.found ? "bg-red-500" : "bg-[#1257e8]"}`}
              style={{ width: `${r.w}%` }}
            />
          </div>
          {r.found && <Bug size={16} className="text-red-500" />}
        </div>
      ))}
      <p className="pt-1 text-[11.5px] text-slate-400">Illustration: each round, check whether the bug still happens.</p>
    </div>
  );
}