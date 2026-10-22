import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  Clock3,
  Cloud,
  Cpu,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe,
  KeyRound,
  Lock,
  Palette,
  Smartphone,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/developer-left-unfinished-project/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "developer-left-unfinished-project";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "My Developer Left and the Project Is Unfinished: How to Get It Finished";
const META_TITLE = "Developer Left, Project Unfinished? How to Finish It | Tech Engi";
const META_DESCRIPTION =
  "Your developer disappeared mid-project. What to secure in the first 48 hours, how to judge finish vs rebuild, what to hand the next engineer, and how to find someone to finish it in India.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-10-31";
const MODIFIED = "2026-10-31";
const PUBLISHED_LABEL = "31 October 2026";
const READ_TIME = "7 min read";

const KEYWORDS = [
  "developer left project unfinished",
  "who can finish my project",
  "find a developer to finish my app",
  "take over unfinished website",
  "project rescue India",
  "developer not responding what to do",
  "finish existing code",
  "software project takeover",
  "freelancer disappeared",
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
  { id: "happens", label: "It happens often" },
  { id: "48-hours", label: "The first 48 hours" },
  { id: "finish-or-rebuild", label: "Finish or rebuild?" },
  { id: "handover", label: "What to hand over" },
  { id: "who", label: "Who can finish it?" },
  { id: "never-again", label: "Never again" },
  { id: "faq", label: "FAQ" },
];

const assets = [
  { icon: GitBranch, name: "Code repository (GitHub, GitLab, Bitbucket)", check: "You're the owner, not just a collaborator", why: "Without it, you don't have your product" },
  { icon: Cloud, name: "Hosting / cloud (AWS, Vercel, Hostinger, etc.)", check: "Login, billing and admin access are yours", why: "They can take the site down" },
  { icon: Globe, name: "Domain name", check: "Registered in your name, with your email", why: "Losing it means losing your address" },
  { icon: Database, name: "Database", check: "Admin access plus a fresh backup", why: "Your customer data lives here" },
  { icon: KeyRound, name: "API keys and third-party accounts (payments, email, maps, SMS)", check: "Rotate the keys and move accounts to your email", why: "Old keys are a security risk" },
  { icon: Smartphone, name: "App store accounts (Google Play, Apple)", check: "Published under your developer account", why: "Apps under someone else's account are hard to move" },
  { icon: Palette, name: "Design files and documents", check: "Figma, specs, credentials list", why: "Saves weeks for the next developer" },
];

const finishIf = [
  "The code runs, and the core features mostly work",
  "It uses a common, current stack (React, Node, Python, Laravel, Flutter and similar)",
  "The structure is readable and there's at least some organisation",
];
const rebuildIf = [
  "Nothing runs, or no one can get it to build",
  "Every fix breaks something else",
  "It's built on an outdated or unusual framework that few engineers know",
  "There are obvious security problems (passwords in the code, no input validation)",
];

const template = [
  "Project: [name + one-line description]",
  "Stack: [e.g. React + Node + MongoDB, hosted on AWS]",
  "Repo: [link — access granted to new engineer]",
  "Staging / test environment: [link + test login]",
  "What works: [list]",
  "What's broken: [list, with screenshots]",
  "What's missing: [features still to build]",
  "Deadline: [date + what must be live by then]",
  "Budget: [₹ amount]",
  "Old developer's notes or docs: [link, if any]",
];

const options = [
  { name: "The old developer, if reachable", good: "Fastest handover", watch: "They left once already" },
  { name: "An agency", good: "Large projects with a big budget", watch: "Minimum project sizes, slower start" },
  { name: "Bidding platforms", good: "Many options", watch: "Sorting proposals, unclear quality" },
  { name: "Hiring full-time", good: "Long-term product", watch: "Weeks to hire, notice periods" },
  { name: "Tech Engi", good: "Takeovers of existing code", watch: "Needs repo access and the handover note above", hero: true },
];

const never = [
  { icon: KeyRound, lead: "Keep every account in your name.", t: "Developers get access; they don't get ownership." },
  { icon: Wallet, lead: "Pay by milestone, not upfront in full.", t: "Escrow means money moves only as work is delivered." },
  { icon: FileText, lead: "Ask for a short handover note at every milestone:", t: "what changed and how to run it." },
  { icon: Eye, lead: "Insist on a staging environment,", t: "so you can see progress yourself." },
  { icon: GitBranch, lead: "Keep the code in your repository from day one,", t: "not on someone's laptop." },
];

const faqs = [
  { q: "What should I do if my developer left the project unfinished?", a: "Secure your code repository, hosting, domain, database and API keys in your own name, change all passwords, take a backup, then have an experienced engineer review the code before deciding to finish or rebuild." },
  { q: "Can another developer finish someone else's code?", a: "Yes, in most cases. An experienced engineer reviews the code first, keeps what works, fixes what's broken and completes the missing features. Very messy or outdated code may need parts rebuilt." },
  { q: "How do I find a developer to finish my project in India?", a: "Post the project with your stack, a handover note and budget on a platform like Tech Engi (techengi.in), where an AI matches you to a verified engineer who knows your technology, and payment is released by milestone through escrow." },
  { q: "Should I finish or rebuild an unfinished app?", a: "Finish it if the code runs and uses a common, current stack. Consider rebuilding parts if nothing runs, every fix breaks something else, or there are serious security problems." },
  { q: "How do I stop a developer from disappearing again?", a: "Keep all accounts in your name, pay by milestone through escrow, use a staging environment, and ask for a short handover note at each milestone." },
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

export default function DeveloperLeftUnfinishedProjectPage() {
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
              My Developer Left and the Project Is Unfinished:{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                How to Get It Finished
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              This is fixable. But the first 48 hours matter.
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
              An app that is 80% done with an unresponsive developer, and the
              first things to secure: repository, hosting, domain and keys.
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
              <Rich t="First, secure everything you own: code repository, hosting, domain, database, API keys and app store accounts. Then get the code reviewed to see what works, what's broken and what's missing, and decide whether to finish or rebuild. Hand the next engineer a clear handover note, and pay by milestone so it doesn't happen again. On **Tech Engi**, you post the project as a takeover, an AI matches you to a verified engineer who knows your stack, and you pay through escrow as each milestone is done." />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your project to a verified engineer by tech stack, skills and budget, and an experienced human engineer does the work." />
            </p>
          </aside>

          {/* ---------------- HAPPENS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="happens">It happens more than you think</H2>
              <Para t="The freelancer stopped replying. The agency moved on. Your only developer took a new job. The app is \u201C80% done\u201D, the launch date hasn't moved, and nobody knows where the passwords are." />
              <Para t="This is fixable. But the first 48 hours matter." />
            </div>

            <figure className="mt-12">
              <StalledBar />
              <figcaption className="sr-only">An app at 80% with the launch date unchanged.</figcaption>
            </figure>
          </section>

          {/* ---------------- 48 HOURS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="48-hours">The first 48 hours: secure what you own</H2>
              <Para t="Before anything else, make sure **you** control these, in **your** name or your company's:" />
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {assets.map(({ icon: Icon, name, check, why }, i) => (
                <li
                  key={name}
                  className={`rounded-[24px] p-7 ${i === assets.length - 1 ? "md:col-span-2" : ""} ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                      <Icon size={21} className={i % 2 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                    </span>
                    <p className="pt-1 text-[16px] font-bold leading-6">{name}</p>
                  </div>
                  <dl className="mt-5 space-y-2.5 text-[13.5px] leading-6 text-slate-700">
                    <div><dt className="inline font-bold text-[#050a30]">What to check: </dt><dd className="inline">{check}</dd></div>
                    <div><dt className="inline font-bold text-[#050a30]">Why it matters: </dt><dd className="inline">{why}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className={`${TEXT} mt-8 flex items-start gap-4 rounded-[24px] bg-[#050a30] p-6 text-white sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                <Lock size={19} />
              </span>
              <p className="text-[14.5px] leading-7 text-white/85">
                <Rich t="Then **change every password** the old developer knew, and **don't let anyone push changes** until you have a backup." />
              </p>
            </div>
          </section>

          {/* ---------------- FINISH OR REBUILD ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="finish-or-rebuild">Finish or rebuild?</H2>
              <Para t="Ask a new, experienced engineer to spend a few hours reviewing the code before you decide." />
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#1257e8] p-7 text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)] sm:p-8">
                <p className="text-[13px] font-semibold text-amber-300">Finish it if:</p>
                <ul className="mt-7 space-y-4">
                  {finishIf.map((t) => (
                    <li key={t} className="flex items-start gap-3.5 text-[14px] font-medium leading-6">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
                <p className="text-[13px] font-semibold text-slate-400">Consider rebuilding parts if:</p>
                <ul className="mt-7 space-y-4">
                  {rebuildIf.map((t) => (
                    <li key={t} className="flex items-start gap-3.5 text-[14px] leading-6 text-slate-600">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-red-500">
                        <X size={13} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <figure className="mt-5">
              <Spectrum />
              <figcaption className="sr-only">Most projects land between finishing and rebuilding.</figcaption>
            </figure>

            <div className={`${TEXT} mt-8 flex items-start gap-4 rounded-[24px] bg-amber-100 p-6 sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
                <BadgeCheck size={19} />
              </span>
              <p className="text-[14.5px] leading-7 text-slate-700">
                <Rich t="**Tip:** booking a " />
                <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] underline">
                  Tech Engi co-worker for a day (₹3,480)
                </Link>{" "}
                is a simple way to get a full day of code review and a finish-or-rebuild plan before committing to the full project.
              </p>
            </div>
          </section>

          {/* ---------------- HANDOVER ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="handover">What to hand the next engineer</H2>
              <Para t="Copy this and fill it in:" />
            </div>

            <figure className="mt-12 overflow-hidden rounded-[24px] bg-[#050a30] text-white">
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[12px] text-white/50">handover-note.txt</span>
              </div>
              <pre className="overflow-x-auto px-6 py-6 text-[13px] leading-7 text-white/90">
                {template.map((line) => {
                  const i = line.indexOf(":");
                  return (
                    <span key={line} className="block whitespace-pre-wrap">
                      <span className="font-bold text-amber-400">{line.slice(0, i + 1)}</span>
                      {line.slice(i + 1)}
                    </span>
                  );
                })}
              </pre>
            </figure>
          </section>

          {/* ---------------- WHO ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="who">Who can finish my project?</H2>
            </div>

            <ul className="mt-12 space-y-4">
              {options.map((o) => (
                <li
                  key={o.name}
                  className={`grid gap-3 rounded-[22px] p-6 sm:grid-cols-[1.1fr_1fr_1fr] sm:items-center sm:gap-6 ${
                    o.hero ? "bg-[#1257e8] text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)]" : "bg-slate-50"
                  }`}
                >
                  <p className="flex items-center gap-2.5 text-[15px] font-bold">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${o.hero ? "bg-amber-500 text-[#050a30]" : "bg-white text-slate-400"}`}>
                      {o.hero ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                    </span>
                    {o.name}
                  </p>
                  <p className={`text-[13.5px] leading-6 ${o.hero ? "text-white" : "text-slate-600"}`}>
                    <span className={`block text-[11px] font-semibold uppercase tracking-wide ${o.hero ? "text-amber-300" : "text-slate-400"}`}>Good for</span>
                    {o.good}
                  </p>
                  <p className={`text-[13.5px] leading-6 ${o.hero ? "text-white" : "text-slate-600"}`}>
                    <span className={`block text-[11px] font-semibold uppercase tracking-wide ${o.hero ? "text-amber-300" : "text-slate-400"}`}>Watch out for</span>
                    {o.watch}
                  </p>
                </li>
              ))}
            </ul>

            <div className={`${TEXT} mt-14`}>
              <p className="text-[19px] font-bold tracking-[-0.025em]">How it works on Tech Engi:</p>
            </div>

            <figure className="mt-8">
              <Flow
                steps={[
                  { icon: ClipboardList, title: "Post as a takeover", text: "With the stack, the handover note and your budget" },
                  { icon: Wallet, title: "Pay 25% upfront", text: "To confirm" },
                  { icon: Cpu, title: "AI matches you", text: "To a verified engineer whose stack fits your codebase" },
                  { icon: UserCheck, title: "Reviews, then finishes", text: "In milestones, with escrow released as each is done" },
                ]}
              />
              <figcaption className="sr-only">The four steps of a takeover on Tech Engi.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="You track progress live and release payment through escrow as each milestone is done. Every Tech Engi engineer is verified with Aadhaar, PAN and proof of experience before taking work." />
            </div>
          </section>

          {/* ---------------- NEVER AGAIN ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="never-again">How to make sure it never happens again</H2>
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {never.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 2 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[15.5px] leading-6">
                    <strong className="font-bold">{lead}</strong>{" "}
                    <span className="text-slate-700">{t}</span>
                  </p>
                </li>
              ))}
              <li className="flex items-center rounded-[24px] bg-[#050a30] p-7 text-white">
                <p className="text-[15px] font-bold leading-6">
                  Developer gone, project stuck? Post it as a takeover.
                </p>
              </li>
            </ul>
          </section>

          {/* ---------------- CTA ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
              <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
              <div className="relative max-w-md">
                <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                  Developer gone, project stuck?
                </p>
                <p className="mt-4 text-[14.5px] leading-7 text-white/85">
                  Post it as a takeover at techengi.in. AI matches. Humans fix.
                </p>
                <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href="/register/client"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                  >
                    Post a Takeover
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/register/engineer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                  >
                    Join as Builder
                  </Link>
                </div>
              </div>
            </div>

            <p className={`${TEXT} mt-10 text-[14px] leading-7 text-slate-600`}>
              <em>Read next:</em>{" "}
              <Link href="/blog/cost-to-hire-developer-fix-bug-india" className="font-semibold text-[#1257e8] hover:underline">
                How much does it cost to hire a developer or fix a bug in India? →
              </Link>
            </p>
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
=============================================================== */

function Rich({ t }: { t: string }) {
  return (
    <>
      {t.split("**").map((s, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-[#050a30]">{s}</strong>
        ) : (
          <span key={i}>{s}</span>
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

/* Hero: a stalled project and the first things to secure */
function HeroCard() {
  const secure = ["Code repository in your name", "Hosting and domain", "API keys rotated"];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">Project status</p>
            <p className="mt-0.5 text-[15px] font-bold">Your app</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-[11px] font-semibold text-red-700">
            <AlertTriangle size={13} />
            Developer not responding
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between text-[12.5px]">
            <span className="font-semibold">&ldquo;80% done&rdquo;</span>
            <span className="text-slate-500">Launch date hasn&apos;t moved</span>
          </div>
          <div className="mt-2.5 flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <span className="h-full rounded-full bg-[#1257e8]" style={{ width: "80%" }} />
          </div>
        </div>

        <p className="mt-6 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">Secure in 48 hours</p>
        <ul className="mt-3 space-y-3">
          {secure.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[13px] font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1257e8] text-white">
                <Check size={12} strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-[#050a30] p-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#050a30]">
            <UserCheck size={17} />
          </span>
          <p className="text-[12px] font-semibold leading-5">Reviewed by a verified engineer</p>
        </div>
      </div>

      <div className="absolute -left-4 top-28 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Lock size={15} className="text-[#1257e8]" />
        Change passwords
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Wallet size={15} className="text-amber-600" />
        Pay by milestone
      </div>
    </div>
  );
}

/* Story: the app that never quite finishes */
function StalledBar() {
  const stuck = ["The freelancer stopped replying", "The agency moved on", "Your only developer took a new job", "Nobody knows where the passwords are"];
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <div className="flex items-baseline justify-between gap-4 text-[13px]">
        <span className="font-semibold text-slate-700">The app is &ldquo;80% done&rdquo;</span>
        <span className="text-slate-500">Launch date hasn&apos;t moved</span>
      </div>
      <div className="relative mt-3 h-6 w-full overflow-hidden rounded-full bg-white">
        <span className="block h-full rounded-full bg-[#1257e8]" style={{ width: "80%" }} />
        <span
          className="absolute inset-y-0 right-0 border-l-2 border-dashed border-red-400"
          style={{ width: "20%" }}
        />
      </div>
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {stuck.map((t) => (
          <li key={t} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[13px] text-slate-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X size={11} strokeWidth={3} />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Finish <-> rebuild spectrum */
function Spectrum() {
  return (
    <div className="rounded-[24px] bg-[#e6eeff] p-7 sm:p-8">
      <div className="flex items-center justify-between text-[12.5px] font-bold">
        <span className="text-[#1257e8]">Finish it</span>
        <span className="text-slate-500">Rebuild it</span>
      </div>
      <div className="relative mt-3 h-4 w-full rounded-full bg-gradient-to-r from-[#1257e8] via-amber-400 to-slate-300">
        <span className="absolute left-[55%] top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#050a30] shadow-md" />
      </div>
      <p className="mt-5 text-[13.5px] leading-6 text-slate-700">
        <strong className="text-[#050a30]">Most projects land somewhere in between:</strong>{" "}
        keep what works, rebuild the worst parts.
      </p>
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