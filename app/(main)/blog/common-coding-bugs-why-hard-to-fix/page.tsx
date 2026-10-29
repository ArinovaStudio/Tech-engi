import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ClipboardList,
  Clock3,
  Cpu,
  Eye,
  FolderOpen,
  Repeat,
  Shuffle,
  UserCheck,
  Wallet,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/common-coding-bugs-why-hard-to-fix/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "common-coding-bugs-why-hard-to-fix";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "The 14 Bugs That Break Code Every Day (And Why Even Senior Engineers Get Stuck)";
const META_TITLE = "Common Coding Bugs & Why They're Hard to Fix | Tech Engi";
const META_DESCRIPTION =
  "From 'Cannot read properties of undefined' to race conditions and legacy code: the bugs that stall students and senior engineers alike, and when to call a human expert.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-10-21";
const MODIFIED = "2026-10-21";
const PUBLISHED_LABEL = "21 October 2026";
const READ_TIME = "8 min read";

const KEYWORDS = [
  "common coding bugs and how to fix them",
  "why is debugging so hard",
  "cannot read properties of undefined fix",
  "CORS error fix",
  "works on my machine",
  "race condition bug",
  "memory leak",
  "legacy code bug",
  "AI generated code bugs",
  "bug fixing service India",
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
   CONTENT   (**double asterisks** render as bold)
=============================================================== */

const toc = [
  { id: "why", label: "Why debugging is hard" },
  { id: "scale", label: "The difficulty scale" },
  { id: "families", label: "The 14 bug families" },
  { id: "seniors", label: "Why seniors get stuck" },
  { id: "expert", label: "When to call an expert" },
  { id: "tech-engi", label: "How Tech Engi fixes bugs" },
  { id: "faq", label: "FAQ" },
];

const LEVELS = ["Easy", "Medium", "Hard", "Nightmare"] as const;
const LEVEL_STYLE = [
  { bar: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800" },
  { bar: "bg-amber-500", chip: "bg-amber-200 text-amber-900" },
  { bar: "bg-orange-500", chip: "bg-orange-200 text-orange-900" },
  { bar: "bg-red-600", chip: "bg-red-100 text-red-700" },
];

const scale = [
  { feel: "Clear error message, points to the line", take: "Minutes" },
  { feel: "Error is clear, cause isn't", take: "An hour to a few hours" },
  { feel: "No error, wrong behaviour, or only in production", take: "A day or more" },
  { feel: "Happens \u201Csometimes\u201D, or lives in code nobody understands", take: "Days to weeks" },
];

// from/to are 0-3 indexes into LEVELS
const bugs = [
  { title: "\u201CCannot read properties of undefined\u201D / NullPointerException", from: 0, to: 1,
    what: "your code expects data that isn't there yet, or isn't there at all.",
    who: "everyone, from first-year students to staff engineers.",
    why: "the line that crashes is rarely the line that's wrong. The real bug is upstream, where the data should have been set." },
  { title: "Dependency hell (npm ERR! ERESOLVE, ModuleNotFoundError)", from: 1, to: 1,
    what: "packages and versions that refuse to work together.",
    who: "MERN and Python developers, anyone who just ran an update.",
    why: "fixing one version conflict breaks two others." },
  { title: "CORS errors (\u201Cblocked by CORS policy\u201D)", from: 1, to: 1,
    what: "the browser blocks your frontend from talking to your backend.",
    who: "full-stack and MERN developers, especially at first deployment.",
    why: "the fix lives on the server, but the error shows up in the browser, so people debug the wrong side." },
  { title: "\u201CIt works on my machine\u201D", from: 1, to: 2,
    what: "code runs locally, fails on the server or a teammate's laptop.",
    who: "every team without identical environments.",
    why: "the difference is invisible — an environment variable, a Node or Python version, a missing file, an OS path." },
  { title: "500 Internal Server Error", from: 1, to: 1,
    what: "the backend crashed, and the user sees a generic error page.",
    who: "backend developers, founders whose site \u201Cjust stopped working\u201D.",
    why: "without proper logging, you're debugging blind." },
  { title: "Frontend rendering bugs (infinite re-renders, hydration mismatch)", from: 1, to: 1,
    what: "\u201CMaximum update depth exceeded\u201D, \u201CHydration failed\u201D, screens that flicker or freeze.",
    who: "React and Next.js developers.",
    why: "the framework's rules are subtle, and the stack trace points into framework code, not yours." },
  { title: "Authentication and session bugs", from: 1, to: 2,
    what: "users logged out randomly, JWT \u201Cexpired\u201D errors, OAuth redirect loops.",
    who: "any app with login.",
    why: "it often works for you and fails for one customer in another timezone or browser." },
  { title: "Database bugs (slow queries, deadlocks, connection limits)", from: 2, to: 2,
    what: "pages that get slower every week, \u201Ctoo many connections\u201D, requests that hang.",
    who: "growing startups, corporate apps with real traffic.",
    why: "it only appears under load, so it never shows up in testing." },
  { title: "Deployment and build failures", from: 1, to: 1,
    what: "\u201CBuild failed\u201D on Vercel, Netlify, AWS or your CI pipeline.",
    who: "everyone shipping on a deadline (usually Friday evening).",
    why: "logs are long, and the real error is buried on line 400." },
  { title: "Memory leaks", from: 2, to: 2,
    what: "the app slowly uses more memory until it crashes or gets restarted.",
    who: "long-running backends, mobile apps, embedded devices.",
    why: "nothing is \u201Cwrong\u201D at any single moment. It only breaks after hours or days." },
  { title: "Race conditions and async bugs", from: 3, to: 3,
    what: "two things happen in the wrong order, sometimes.",
    who: "senior backend engineers, payment and booking systems, real-time apps.",
    why: "you can't reproduce it on demand. Adding a log line can make it disappear." },
  { title: "Embedded and IoT bugs (resets, hangs, sensor glitches)", from: 2, to: 3,
    what: "an ESP32 that keeps rebooting, I2C/SPI devices that stop responding, firmware that hangs after a few hours.",
    who: "robotics and IoT teams, final-year engineering students, hardware startups.",
    why: "the bug might be in code, wiring, power supply or timing, and you need hardware experience to tell which." },
  { title: "Legacy code nobody understands", from: 3, to: 3,
    what: "a module written years ago by someone who left, with no tests and no documentation.",
    who: "corporate engineers, especially in service companies and enterprise apps.",
    why: "fixing one thing breaks something you didn't know existed." },
  { title: "\u201CAlmost right\u201D AI-generated code", from: 1, to: 2,
    what: "code from ChatGPT, Copilot or another assistant that looks correct, runs, and is subtly wrong.",
    who: "everyone now, from students to senior engineers.",
    why: "nobody on the team fully understands it, so nobody knows where to look. It's exactly the frustration 66% of developers reported in 2025." },
];

const seniors = [
  { icon: Repeat, lead: "The bug is intermittent.", t: "Race conditions and load-only bugs don't care about your title." },
  { icon: FolderOpen, lead: "The codebase isn't theirs.", t: "A new project, an acquisition, a module from another team." },
  { icon: Shuffle, lead: "They're context-switching.", t: "Five meetings, three PR reviews and a production alert, all before lunch." },
  { icon: Eye, lead: "They're too close to it.", t: "After four hours, you stop seeing the obvious. A fresh pair of eyes often spots it in twenty minutes." },
  { icon: Bot, lead: "The AI code looks fine.", t: "Reviewing code is harder than writing it." },
];

const expert = [
  { tag: "Easy", style: 0, t: "Easy bug, still stuck after an hour?", a: "Step away, then ask a colleague." },
  { tag: "Medium or hard", style: 2, t: "Medium or hard bug blocking a release, a client or production?", a: "Get an experienced engineer in now. Every hour costs more than the fix." },
  { tag: "Nightmare", style: 3, t: "Nightmare bug (intermittent, legacy, embedded)?", a: "Bring in someone who has fixed that kind of bug before. Pattern experience is the shortcut." },
];

const faqs = [
  { q: "What is the most common bug in programming?", a: "Null or undefined errors, such as \u201CCannot read properties of undefined\u201D in JavaScript or NullPointerException in Java, are among the most common. They happen when code uses data that hasn't been set." },
  { q: "Why is debugging harder than writing code?", a: "Writing code follows your intention. Debugging means finding where the computer's actual behaviour differs from that intention, often in code, config or timing you didn't write or can't see." },
  { q: "Do senior developers struggle with bugs?", a: "Yes. Intermittent bugs, unfamiliar codebases, legacy code and AI-generated code stall engineers at every level. Stack Overflow's 2025 survey found 45% of developers say debugging AI-generated code takes more time." },
  { q: "Can AI fix all bugs?", a: "No. AI tools help with simple, well-known errors, but 66% of developers in Stack Overflow's 2025 survey said AI solutions are often \u201Calmost right, but not quite\u201D. Complex, intermittent and legacy bugs still need experienced humans." },
  { q: "Where can I get a bug fixed by a human expert in India?", a: "On Tech Engi (techengi.in), an AI matches your bug to a verified human engineer by tech stack, skills and budget, and you pay through escrow by milestone." },
];

const sources = [
  ["Stack Overflow 2025 Developer Survey coverage — VentureBeat", "https://venturebeat.com/ai/stack-overflow-data-reveals-the-hidden-productivity-tax-of-almost-right-ai-code"],
  ["Insights from the 2024 Developer Survey — Stack Overflow", "https://stackoverflow.co/internal/resources/your-developers-deserve-better-insights-from-the-2024-developer-survey/"],
  ["Survey: Fixing Bugs Stealing Time from Development — DevOps.com (Rollbar/Propeller Insights, 2021)", "https://devops.com/survey-fixing-bugs-stealing-time-from-development/"],
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

export default function CommonCodingBugsPage() {
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
              The 14 Bugs That{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                Break Code Every Day
              </span>{" "}
              (And Why Even Senior Engineers Get Stuck)
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Most bugs fall into 14 families, from minutes-long undefined
              errors to race conditions that can eat a week.
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
              The four difficulty levels of bugs, from Easy (minutes) to
              Nightmare (days to weeks), across 14 bug families.
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
              <Rich t="Most bugs fall into 14 families, from simple undefined errors that take minutes to race conditions and legacy-code bugs that can eat a week. Difficulty has little to do with seniority: senior engineers get stuck on intermittent bugs, unfamiliar codebases and \u201Calmost right\u201D AI-generated code. When a bug has blocked you for hours, a fresh pair of experienced human eyes is usually the fastest fix. That's what **Tech Engi** is for: **AI matches. Humans fix.**" />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your bug to a verified engineer by tech stack, skills and budget, and an experienced human engineer fixes it." />
            </p>
          </aside>

          {/* ---------------- WHY ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="why">Why is debugging so hard, even for experienced developers?</H2>
              <Para t="Because writing code is about what you *meant*, and debugging is about what the computer *actually did*. The gap between the two hides in places you aren't looking: a library update, a timing issue, a config value on one server, a line of AI-generated code nobody read closely." />
            </div>

            <figure className="mt-12">
              <GapVisual />
              <figcaption className="sr-only">The gap between what you meant and what the computer did.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="The numbers back this up:" />
            </div>

            <figure className="mt-8">
              <SurveyBars />
              <figcaption className="sr-only">Developer survey figures on AI code, search time and time spent fixing bugs.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="Bugs aren't a beginner problem. They're everyone's daily problem." />
            </div>
          </section>

          {/* ---------------- SCALE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="scale">The difficulty scale</H2>
            </div>

            <ol className="mt-12 grid items-end gap-5 md:grid-cols-4">
              {scale.map((s, i) => (
                <li
                  key={LEVELS[i]}
                  className="flex flex-col justify-between rounded-[24px] bg-slate-50 p-6"
                  style={{ minHeight: 170 + i * 42 }}
                >
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${LEVEL_STYLE[i].chip}`}>
                      {LEVELS[i]}
                    </span>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">What it feels like</p>
                    <p className="mt-1 text-[13.5px] leading-6 text-slate-700">{s.feel}</p>
                  </div>
                  <div className="mt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Can take</p>
                    <p className="mt-1 text-[15px] font-bold">{s.take}</p>
                    <span className={`mt-3 block h-2 rounded-full ${LEVEL_STYLE[i].bar}`} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- FAMILIES ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="families">The 14 bug families</H2>
            </div>

            <ol className="mt-12 grid gap-5 lg:grid-cols-2">
              {bugs.map((b, i) => (
                <li key={b.title} className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-[#050a30]">
                      {i + 1}
                    </span>
                    <h3 className="pt-1 text-[16px] font-bold leading-[1.3] tracking-[-0.02em]">{b.title}</h3>
                  </div>

                  <Meter from={b.from} to={b.to} />

                  <dl className="mt-5 space-y-3 text-[13.5px] leading-6 text-slate-600">
                    <div><dt className="inline font-bold text-[#050a30]">What it is: </dt><dd className="inline">{b.what}</dd></div>
                    <div><dt className="inline font-bold text-[#050a30]">Who hits it: </dt><dd className="inline">{b.who}</dd></div>
                    <div><dt className="inline font-bold text-[#050a30]">Why it gets hard: </dt><dd className="inline">{b.why}</dd></div>
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- SENIORS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="seniors">Why senior engineers get stuck too</H2>
              <Para t="Experience helps you fix bugs faster. It doesn't make you immune to them. Senior and corporate engineers get stuck because:" />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {seniors.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 2 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[16px] font-bold leading-6">{lead}</p>
                  <p className="mt-2.5 text-[14px] leading-6 text-slate-700">{t}</p>
                </li>
              ))}
              <li className="flex items-center rounded-[24px] bg-[#050a30] p-7 text-white">
                <p className="text-[15px] font-bold leading-6">
                  Getting help isn&apos;t a sign of weakness. It&apos;s what good engineers do when the clock matters.
                </p>
              </li>
            </ul>
          </section>

          {/* ---------------- EXPERT ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="expert">When should you stop debugging alone and call an expert?</H2>
              <Para t="A simple rule of thumb:" />
            </div>

            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {expert.map((e, i) => (
                <li key={e.tag} className="flex flex-col rounded-[24px] bg-slate-50 p-7">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-[#050a30]">
                      {i + 1}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${LEVEL_STYLE[e.style].chip}`}>{e.tag}</span>
                  </span>
                  <p className="mt-5 text-[15px] font-bold leading-6">{e.t}</p>
                  <p className="mt-3 rounded-xl bg-[#e6eeff] px-4 py-3 text-[13.5px] font-semibold leading-6 text-[#1257e8]">
                    {e.a}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- TECH ENGI ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="tech-engi">How Tech Engi fixes bugs: AI matches, humans fix</H2>
              <Para t="Tech Engi puts bug fixing first." />
            </div>

            <figure className="mt-12">
              <Flow
                steps={[
                  { icon: ClipboardList, title: "Post your bug", text: "Title, what's happening, your tech stack and your budget" },
                  { icon: Wallet, title: "Pay 25% upfront", text: "To confirm, so engineers know the work is real" },
                  { icon: Cpu, title: "AI matches you", text: "To a verified engineer whose stack and experience fit" },
                  { icon: UserCheck, title: "A human fixes it", text: "Track progress live, pay through escrow by milestone" },
                ]}
              />
            </figure>

            <div className={TEXT}>
              <Para t="Every engineer on Tech Engi is verified with Aadhaar, PAN and proof of experience before taking work. AI does the matching. **The fixing is done by experienced humans**, because the hardest bugs on this list are exactly the ones AI still gets \u201Calmost right\u201D." />
            </div>

            <div className="mt-16">
              <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
                <div className="relative max-w-md">
                  <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                    Stuck on one of these 14?
                  </p>
                  <p className="mt-4 text-[14.5px] leading-7 text-white/85">
                    Post it at techengi.in. AI matches. Humans fix.
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
                <em>Next:</em>{" "}
                <Link href="/blog/who-can-fix-my-code-how-soon" className="font-semibold text-[#1257e8] hover:underline">
                  Who can fix my code, and how soon? →
                </Link>{" "}
                ·{" "}
                <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] hover:underline">
                  Hire a co-worker for a day at ₹3,480 →
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
              <ul className="mt-4 space-y-3 text-[14px] leading-6">
                {sources.map(([t, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-start gap-2 text-slate-600 transition hover:text-[#1257e8]"
                    >
                      <ArrowUpRight size={15} className="mt-1 shrink-0" />
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
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
   Rich: **bold** and *italic*
=============================================================== */

function Rich({ t }: { t: string }) {
  return (
    <>
      {t.split("**").map((s, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-[#050a30]">{s}</strong>
        ) : (
          <span key={i}>
            {s.split("*").map((x, j) => (j % 2 ? <em key={j}>{x}</em> : x))}
          </span>
        )
      )}
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

/* Four-segment difficulty meter with the label range ("Easy to Medium") */
function Meter({ from, to }: { from: number; to: number }) {
  const label = from === to ? LEVELS[to] : `${LEVELS[from]} to ${LEVELS[to]}`;
  return (
    <div className="mt-5 flex items-center gap-4">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {LEVELS.map((l, i) => (
          <span
            key={l}
            className={`h-2 flex-1 rounded-full ${
              i <= to ? `${LEVEL_STYLE[to].bar} ${i < from ? "opacity-40" : ""}` : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${LEVEL_STYLE[to].chip}`}>{label}</span>
    </div>
  );
}

/* Hero: the four levels as a stack */
function HeroCard() {
  const rows = [
    { l: "Easy", t: "Minutes", w: "18%" },
    { l: "Medium", t: "An hour to a few hours", w: "40%" },
    { l: "Hard", t: "A day or more", w: "68%" },
    { l: "Nightmare", t: "Days to weeks", w: "100%" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">Bug difficulty</p>
            <p className="mt-0.5 text-[15px] font-bold">14 bug families</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-[11px] font-semibold text-red-700">
            Stuck for hours?
          </span>
        </div>

        <ul className="mt-6 space-y-5">
          {rows.map((r, i) => (
            <li key={r.l}>
              <div className="flex items-baseline justify-between text-[12.5px]">
                <span className="font-bold">{r.l}</span>
                <span className="text-slate-500">{r.t}</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
                <span className={`block h-full rounded-full ${LEVEL_STYLE[i].bar}`} style={{ width: r.w }} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-[#050a30] p-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#050a30]">
            <UserCheck size={17} />
          </span>
          <p className="text-[12px] font-semibold leading-5">
            AI matches.<br />Humans fix.
          </p>
        </div>
      </div>

      <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Bot size={15} className="text-[#1257e8]" />
        &ldquo;Almost right&rdquo; AI code
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Repeat size={15} className="text-amber-600" />
        Intermittent
      </div>
    </div>
  );
}

/* What you meant vs what the computer did */
function GapVisual() {
  const hides = ["A library update", "A timing issue", "A config value on one server", "AI-generated code nobody read closely"];
  return (
    <div className="rounded-[24px] bg-[#050a30] p-7 text-white sm:p-8">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl bg-white/10 p-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">Writing code</p>
          <p className="mt-1 text-[18px] font-bold">What you meant</p>
        </div>
        <span className="mx-auto rounded-full bg-red-500 px-3.5 py-1.5 text-[11px] font-bold">THE GAP</span>
        <div className="rounded-2xl bg-white/10 p-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">Debugging</p>
          <p className="mt-1 text-[18px] font-bold">What it actually did</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        {hides.map((h) => (
          <span key={h} className="rounded-full bg-amber-500 px-3.5 py-1.5 text-[12px] font-semibold text-[#050a30]">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Survey numbers, with the source and year on each bar */
function SurveyBars() {
  const rows = [
    { v: 66, show: "66%", l: "Top frustration with AI tools: solutions that are \u201Calmost right, but not quite\u201D", src: "Stack Overflow 2025 (49,000+ developers)", c: "bg-[#1257e8]" },
    { v: 45, show: "45%", l: "Say debugging AI-generated code takes more time", src: "Stack Overflow 2025", c: "bg-[#1257e8]" },
    { v: 60, show: "60%+", l: "Spent more than 30 minutes a day just searching for answers", src: "Stack Overflow 2024", c: "bg-amber-500" },
    { v: 25, show: "~1 in 4", l: "Spent over an hour a day searching for answers", src: "Stack Overflow 2024", c: "bg-amber-500" },
    { v: 26, show: "26%", l: "Spend up to half their time fixing bugs", src: "2021 survey of 950 developers, run for Rollbar (an error-monitoring vendor)", c: "bg-emerald-500" },
  ];
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <ul className="space-y-7">
        {rows.map((r) => (
          <li key={r.l}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[13.5px] font-semibold leading-5 text-slate-700">{r.l}</span>
              <span className="shrink-0 text-[22px] font-bold tracking-[-0.03em]">{r.show}</span>
            </div>
            <div className="mt-2.5 h-4 w-full overflow-hidden rounded-full bg-white">
              <span className={`block h-full rounded-full ${r.c}`} style={{ width: `${r.v}%` }} />
            </div>
            <p className="mt-1.5 text-[11.5px] text-slate-400">{r.src}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Generic 4-step flow */
function Flow({
  steps,
}: {
  steps: { icon: React.ElementType; title: string; text: string }[];
}) {
  return (
    <ol className="relative grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-amber-400 sm:block"
      />
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li key={title} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
          <span
            className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
              i === steps.length - 1 ? "bg-amber-500 text-[#050a30]" : "bg-[#1257e8] text-white"
            }`}
          >
            <Icon size={21} />
          </span>
          <div>
            <p className="text-[14px] font-bold leading-5">{title}</p>
            <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}