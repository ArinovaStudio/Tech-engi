import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Check,
  Clock3,
  Layers,
  Lock,
  Repeat,
  Timer,
  Wallet,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/cost-to-hire-developer-fix-bug-india/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "cost-to-hire-developer-fix-bug-india";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "How Much Does It Cost to Hire a Developer or Fix a Bug in India? (2026)";
const META_TITLE = "Cost to Hire a Developer or Fix a Bug in India (2026) | Tech Engi";
const META_DESCRIPTION =
  "Freelance developer rates in India by experience, what a full-time engineer costs per day, platform fees, what drives bug-fix cost, and Tech Engi's ₹3,480 co-worker day.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-11-03";
const MODIFIED = "2026-11-03";
const PUBLISHED_LABEL = "3 November 2026";
const READ_TIME = "7 min read";

const KEYWORDS = [
  "cost to hire a developer in India",
  "freelance developer rates India",
  "cost to fix a bug",
  "bug fixing cost India",
  "hire developer for a day cost",
  "software developer salary India per day",
  "freelancer vs agency cost",
  "developer hourly rate India 2026",
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
  { id: "rates", label: "Freelance rates" },
  { id: "full-time", label: "Full-time cost per day" },
  { id: "fees", label: "Platform fees" },
  { id: "bug-cost", label: "Cost to fix a bug" },
  { id: "compare", label: "Compared side by side" },
  { id: "pricing", label: "Tech Engi pricing" },
  { id: "faq", label: "FAQ" },
];

const rates = [
  { l: "Junior (1–3 years)", min: 14, max: 24 },
  { l: "Mid-level (3–6 years)", min: 20, max: 52 },
  { l: "Senior (7–10 years)", min: 30, max: 72 },
  { l: "Staff / Principal (10+ years)", min: 42, max: 95 },
];

const skills = [
  "React $21–54",
  "Python $20–52",
  "Java $20–52",
  "Mobile and Android $25–65",
  "Machine learning $28–72",
  "PHP $15–38",
];

const salaries = [
  { exp: "0–1 year", svc: "₹3.5–6 LPA", prod: "₹8–15 LPA" },
  { exp: "~3 years", svc: "₹6–10 LPA", prod: "₹20–30 LPA" },
  { exp: "6–12 years", svc: "₹10–30 LPA", prod: "₹22–60 LPA" },
];

const perDay = [
  { l: "₹6 LPA", v: 2400, show: "about ₹2,400" },
  { l: "₹12 LPA", v: 4800, show: "about ₹4,800" },
  { l: "₹20 LPA", v: 8000, show: "about ₹8,000" },
];

const factors = [
  { icon: Repeat, lead: "Can it be reproduced?", t: "A bug you can trigger on demand is far cheaper to fix than one that happens \u201Csometimes\u201D." },
  { icon: Lock, lead: "How much access is given?", t: "A staging environment and repo access save hours of guesswork." },
  { icon: Layers, lead: "How rare is the stack?", t: "A common React or Python bug is easier to staff than legacy or niche code." },
  { icon: Timer, lead: "How urgent is it?", t: "\u201CProduction is down right now\u201D costs more than \u201Csometime this week\u201D." },
  { icon: AlertTriangle, lead: "Is it one bug or a symptom?", t: "Sometimes the bug is a sign of a bigger design problem." },
];

const compareRows = ["Best for", "Time to start", "How you pay", "Who you get", "For one day of help"];
const compare = [
  { name: "Freelancer (bidding platform)", v: ["Defined small projects", "Days (after sorting proposals)", "Platform fee + quote", "You choose from bids", "Hard to arrange"] },
  { name: "Agency", v: ["Large builds", "Days to weeks", "Contract + minimum size", "Their team", "Rarely"] },
  { name: "Full-time hire", v: ["Long-term product", "Weeks to months", "Salary + overheads", "Whoever you hire", "No"] },
  { name: "Tech Engi", hero: true, v: ["Bugs, takeovers, overflow work", "Matched once you post and confirm", "Your budget, 25% upfront, milestones via escrow", "AI-matched verified engineer", "Co-worker for a day: ₹3,480"] },
];

const faqs = [
  { q: "How much does it cost to hire a freelance developer in India?", a: "Recruiter-quoted rates for 2026 are about $14–24 an hour for junior developers, $20–52 for mid-level and $30–72 for senior developers, varying by skill, city and urgency." },
  { q: "How much does a software engineer cost per day in India?", a: "In salary alone, a ₹6 LPA engineer costs about ₹2,400 per working day, ₹12 LPA about ₹4,800, and ₹20 LPA about ₹8,000, before hiring and office costs." },
  { q: "How much does it cost to fix a bug?", a: "It depends on how easily the bug can be reproduced, how much access the engineer gets, how common the stack is and how urgent it is. A clear bug report and staging access reduce the cost the most." },
  { q: "Can I hire a developer for one day in India?", a: "Yes. Tech Engi's co-worker for a day is a verified engineer who works through your agreed task list for a full working day for ₹3,480." },
  { q: "What fees do freelance platforms charge?", a: "Fiverr takes 20% from freelancers and charges buyers a 5.5% service fee. Upwork charges freelancers a variable 0–15% fee plus paid Connects to apply, and charges clients a marketplace fee. On Tech Engi, engineers keep 97% on their first project and 95% after." },
];

const sources = [
  ["Cost to Hire Freelance Developers in India — Second Talent (Oct 2026)", "https://www.secondtalent.com/cost-to-hire/india/"],
  ["Software Engineer Salary in India — Instahyre (2026)", "https://resources.instahyre.com/blog/software-engineer-salary-in-india/"],
  ["Upwork Fees Explained 2026 — goLance", "https://golance.com/blogs/upwork-fees-explained-2026"],
  ["Fiverr Fees in 2026 — VaultLeap", "https://vaultleap.com/blog/fiverr-fees-explained-2026"],
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

export default function CostToHireDeveloperPage() {
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
              How Much Does It Cost to{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                Hire a Developer or Fix a Bug
              </span>{" "}
              in India? (2026)
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Freelance rates, what a full-time engineer costs per day,
              platform fees, and what drives bug-fix cost.
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
              A snapshot of costs: freelance hourly rates by experience, about
              ₹4,800 a day for a ₹12 LPA engineer, and ₹3,480 for a Tech Engi
              co-worker day.
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
              <Rich t="Freelance developers in India are commonly quoted at about **$14–24/hour (junior)**, **$20–52 (mid-level)** and **$30–72 (senior)**. A full-time engineer on **₹12 LPA** costs about **₹4,800 per working day** in salary alone. The cost of fixing a bug depends mostly on how hard it is to reproduce and how much access the engineer gets. On **Tech Engi**, you set your budget, pay 25% upfront to confirm, and pay the rest by milestone through escrow, or book a verified **co-worker for a full day at ₹3,480**." />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your work to a verified engineer by tech stack, skills and budget, and an experienced human engineer does it." />
            </p>
          </aside>

          {/* ---------------- RATES ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="rates">Freelance developer rates in India (2026)</H2>
              <Para t="Rates quoted by Second Talent, a recruiting firm that places Indian developers (October 2026, full-stack, freelance or contract):" />
            </div>

            <figure className="mt-12">
              <RangeChart />
              <figcaption className="sr-only">Hourly rate ranges in USD by experience level.</figcaption>
            </figure>

            <div className={`${TEXT} mt-10`}>
              <p className={P}>By skill, at mid-level:</p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {skills.map((s) => (
                <li key={s} className="rounded-full bg-[#e6eeff] px-4 py-2 text-[13px] font-semibold text-[#1257e8]">
                  {s}
                </li>
              ))}
            </ul>

            <div className={`${TEXT} mt-8 flex items-start gap-4 rounded-[24px] bg-amber-100 p-6 sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
                <AlertTriangle size={19} />
              </span>
              <p className="text-[14.5px] leading-7 text-slate-700">
                <Rich t="**Read this as a range, not a price list.** Rates vary a lot by city, niche, urgency and whether you hire directly or through a platform." />
              </p>
            </div>
          </section>

          {/* ---------------- FULL-TIME ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="full-time">What does a full-time engineer cost per day?</H2>
              <Para t="Salary ranges from Instahyre's 2025–26 offer data:" />
            </div>

            <div className="mt-12 overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-3 bg-slate-50 px-6 py-4 text-[12px] font-semibold text-slate-500">
                <span>Experience</span>
                <span>IT services companies</span>
                <span>Indian product companies</span>
              </div>
              {salaries.map((s) => (
                <div key={s.exp} className="grid grid-cols-3 border-t border-slate-200 px-6 py-5 text-[14px]">
                  <span className="font-bold">{s.exp}</span>
                  <span className="text-slate-600">{s.svc}</span>
                  <span className="font-semibold text-[#1257e8]">{s.prod}</span>
                </div>
              ))}
            </div>

            <div className={TEXT}>
              <Para t="Spread across about 250 working days a year, that's roughly:" />
            </div>

            <figure className="mt-10">
              <DayCostBars />
              <figcaption className="sr-only">
                Salary-only cost per working day at ₹6, ₹12 and ₹20 LPA, against
                the ₹3,480 Tech Engi co-worker day.
              </figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="That's before recruitment, laptops, office space, benefits and the weeks it takes to hire. For a short burst of work, a full-time hire is usually the most expensive option." />
            </div>
          </section>

          {/* ---------------- FEES ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="fees">Don&apos;t forget platform fees</H2>
              <Para t="On bidding platforms, fees come out of both sides:" />
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              <li className="rounded-[24px] bg-slate-50 p-7">
                <p className="text-[16px] font-bold">Fiverr</p>
                <p className="mt-3 text-[14px] leading-6 text-slate-600">
                  <Rich t="Takes **20%** of every order from the freelancer, and buyers pay a separate **5.5%** service fee." />
                </p>
                <FeeBar keep={80} fee={20} keepLabel="80% kept" />
              </li>
              <li className="rounded-[24px] bg-slate-50 p-7">
                <p className="text-[16px] font-bold">Upwork</p>
                <p className="mt-3 text-[14px] leading-6 text-slate-600">
                  <Rich t="Charges freelancers a **variable 0–15%** fee (most report around 10%), plus **paid Connects** just to apply, and charges clients a **marketplace fee**." />
                </p>
                <FeeBar keep={90} fee={10} keepLabel="~90% kept" />
              </li>
              <li className="rounded-[24px] bg-[#1257e8] p-7 text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)]">
                <p className="text-[16px] font-bold">Tech Engi</p>
                <p className="mt-3 text-[14px] leading-6 text-white/85">
                  Engineers keep <strong className="text-white">97%</strong> of what the client pays on their first project and <strong className="text-white">95%</strong> after that, with no bidding and no paid credits to apply.
                </p>
                <FeeBar keep={97} fee={3} keepLabel="97% kept" dark />
              </li>
            </ul>

            <div className={TEXT}>
              <Para t="Freelancers price those fees into their quotes, so clients end up paying for them too." />
            </div>
          </section>

          {/* ---------------- BUG COST ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="bug-cost">How much does it cost to fix a bug?</H2>
              <Para t="There's no fixed price, because bugs aren't equal. Five things decide the cost:" />
            </div>

            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {factors.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 2 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <Icon size={21} className={i % 2 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                    </span>
                    <span className="text-[28px] font-bold leading-none text-[#050a30]/15">{i + 1}</span>
                  </div>
                  <p className="mt-6 text-[16px] font-bold leading-6">{lead}</p>
                  <p className="mt-2.5 text-[14px] leading-6 text-slate-700">{t}</p>
                </li>
              ))}
              <li className="flex flex-col justify-center rounded-[24px] bg-[#050a30] p-7 text-white">
                <p className="text-[14.5px] leading-7 text-white/85">
                  <strong className="text-amber-300">The cheapest way to cut the cost:</strong>{" "}
                  write a clear bug report (exact error, steps to reproduce,
                  what changed, staging access). Use the template in{" "}
                  <Link href="/blog/who-can-fix-my-code-how-soon" className="font-semibold text-white underline">
                    Who can fix my code, and how soon?
                  </Link>
                </p>
              </li>
            </ol>
          </section>

          {/* ---------------- COMPARE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="compare">Freelancer vs agency vs full-time vs Tech Engi</H2>
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {compare.map((c) => (
                <li
                  key={c.name}
                  className={`flex flex-col rounded-[24px] p-6 ${
                    c.hero ? "bg-[#1257e8] text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)]" : "bg-slate-50"
                  }`}
                >
                  <p className="flex items-center gap-2.5 text-[15px] font-bold leading-5">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.hero ? "bg-amber-500 text-[#050a30]" : "bg-white text-slate-400"}`}>
                      {c.hero ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                    </span>
                    {c.name}
                  </p>
                  <dl className="mt-5 space-y-4">
                    {compareRows.map((r, i) => (
                      <div key={r}>
                        <dt className={`text-[11px] font-semibold uppercase tracking-wide ${c.hero ? "text-amber-300" : "text-slate-400"}`}>{r}</dt>
                        <dd className={`mt-1 text-[13.5px] leading-5 ${c.hero ? "font-semibold text-white" : "text-slate-600"}`}>{c.v[i]}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- PRICING ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="pricing">Tech Engi pricing, simply</H2>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              <li className="rounded-[24px] bg-[#e6eeff] p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1257e8]"><Wallet size={21} /></span>
                <p className="mt-6 text-[13px] font-semibold text-[#1257e8]">For clients</p>
                <p className="mt-2 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="You set the budget when you post. Pay **25% upfront** to confirm, then the rest **by milestone through escrow**." />
                </p>
              </li>
              <li className="rounded-[24px] bg-amber-100 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600"><Briefcase size={21} /></span>
                <p className="mt-6 text-[13px] font-semibold text-amber-800">Co-worker for a day</p>
                <p className="mt-2 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="A verified engineer works through your agreed task list for a full working day for **₹3,480**. " />
                  <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] underline">
                    See how it works →
                  </Link>
                </p>
              </li>
              <li className="rounded-[24px] bg-[#050a30] p-7 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-[#050a30]"><BadgeCheck size={21} /></span>
                <p className="mt-6 text-[13px] font-semibold text-amber-300">For engineers</p>
                <p className="mt-2 text-[14.5px] leading-7 text-white/85">
                  Keep <strong className="text-white">97%</strong> on your first project and <strong className="text-white">95%</strong> on every project after. No bidding, no tokens, no fee to close a deal.
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
                  Know your budget?
                </p>
                <p className="mt-4 text-[14.5px] leading-7 text-white/85">
                  Post your bug or project at techengi.in. AI matches. Humans fix.
                </p>
                <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href="/register/client"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                  >
                    Post Your Project
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
              <Link href="/blog/developer-left-unfinished-project" className="font-semibold text-[#1257e8] hover:underline">
                My developer left and the project is unfinished →
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

/* Hero: cost snapshot */
function HeroCard() {
  const rows = [
    { l: "Junior", v: "$14–24 / hr" },
    { l: "Mid-level", v: "$20–52 / hr" },
    { l: "Senior", v: "$30–72 / hr" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">India, 2026</p>
            <p className="mt-0.5 text-[15px] font-bold">Cost snapshot</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-3 py-1.5 text-[11px] font-semibold text-[#1257e8]">
            Freelance rates
          </span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {rows.map((r) => (
            <li key={r.l} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[13px]">
              <span className="text-slate-500">{r.l}</span>
              <span className="font-bold">{r.v}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-[13px]">
          <span className="text-slate-600">₹12 LPA engineer, per day</span>
          <span className="font-bold text-red-600">~₹4,800</span>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#050a30] p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#050a30]">
              <BadgeCheck size={17} />
            </span>
            <p className="text-[12px] font-semibold leading-5">Tech Engi<br />co-worker day</p>
          </div>
          <p className="text-[24px] font-bold tracking-[-0.03em] text-amber-400">₹3,480</p>
        </div>
      </div>

      <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Wallet size={15} className="text-[#1257e8]" />
        25% upfront
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Lock size={15} className="text-amber-600" />
        Escrow milestones
      </div>
    </div>
  );
}

/* Hourly USD ranges as floating bars on a 0-100 scale */
function RangeChart() {
  const ticks = [0, 25, 50, 75, 100];
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <ul className="space-y-6">
        {rates.map((r) => (
          <li key={r.l}>
            <div className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className="font-semibold text-slate-700">{r.l}</span>
              <span className="text-[16px] font-bold tracking-[-0.02em]">${r.min}–{r.max}</span>
            </div>
            <div className="relative mt-2.5 h-4 w-full rounded-full bg-white">
              <span
                className="absolute top-0 h-full rounded-full bg-[#1257e8]"
                style={{ left: `${r.min}%`, width: `${r.max - r.min}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between text-[11px] text-slate-400">
        {ticks.map((t) => (
          <span key={t}>${t}</span>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-slate-400">Hourly rate in USD. Source: Second Talent, October 2026.</p>
    </div>
  );
}

/* Salary-only cost per working day, with the co-worker day as a reference line */
function DayCostBars() {
  const MAX = 8000;
  const REF = 3480;
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 bottom-0 z-10 border-l-2 border-dashed border-amber-500"
          style={{ left: `${(REF / MAX) * 100}%` }}
        />
        <span
          className="absolute -top-9 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-[#050a30]"
          style={{ left: `${(REF / MAX) * 100}%` }}
        >
          Tech Engi co-worker day: ₹3,480
        </span>
        <ul className="mt-12 space-y-6">
          {perDay.map((d) => (
            <li key={d.l}>
              <div className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="font-semibold text-slate-700">Annual CTC {d.l}</span>
                <span className="text-[16px] font-bold tracking-[-0.02em]">{d.show}</span>
              </div>
              <div className="mt-2.5 h-4 w-full overflow-hidden rounded-full bg-white">
                <span className="block h-full rounded-full bg-[#1257e8]" style={{ width: `${(d.v / MAX) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-[12px] text-slate-400">Cost per working day, salary only, across about 250 working days.</p>
    </div>
  );
}

/* What the freelancer keeps vs the fee */
function FeeBar({
  keep,
  fee,
  keepLabel,
  dark = false,
}: {
  keep: number;
  fee: number;
  keepLabel: string;
  dark?: boolean;
}) {
  return (
    <div className="mt-6 flex h-8 w-full overflow-hidden rounded-xl text-[11.5px] font-bold">
      <span
        className={`flex items-center justify-center ${dark ? "bg-white text-[#1257e8]" : "bg-[#1257e8] text-white"}`}
        style={{ width: `${keep}%` }}
      >
        {keepLabel}
      </span>
      <span className="bg-amber-500" style={{ width: `${fee}%` }} />
    </div>
  );
}