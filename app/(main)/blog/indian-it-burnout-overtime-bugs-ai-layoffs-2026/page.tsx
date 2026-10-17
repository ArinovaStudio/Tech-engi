import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Check,
  Clock3,
  Flame,
  Phone,
  UserMinus,
  Users,
  Zap,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/indian-it-burnout-overtime-bugs-ai-layoffs-2026/page.tsx
   Theme: deep teal + coral (matches the /blog index page)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "indian-it-burnout-overtime-bugs-ai-layoffs-2026";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "Indian IT Is Breaking Its Own People — Then Blaming AI For the Layoffs";
const META_TITLE =
  "Why Indian IT Employees Are Overworked, Fired, and Blamed for Bugs AI Caused | Tech Engi";
const META_DESCRIPTION =
  "Unpaid overtime, understaffed teams, bugs that cost companies millions, and layoffs blamed on AI that was never the real reason. Here's what's actually happening inside Indian IT in 2026 — and what to do instead of absorbing it alone.";
const OG_TITLE = H1_TITLE;
const OG_DESCRIPTION =
  "The overtime is unpaid. The bugs cost millions. The layoffs are blamed on AI that didn't do it. One blog connecting all three — and what Tech Engi engineers are doing about it.";

const PUBLISHED = "2026-10-17";
const MODIFIED = "2026-10-17";
const PUBLISHED_LABEL = "17 October 2026";
const READ_TIME = "7 min read";

const KEYWORDS = [
  "IT overtime India 2026",
  "tech layoffs 2026",
  "software bug cost",
  "IT employee burnout India",
  "AI layoffs real reason",
  "Tech Engi",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "Tech Engi" }],
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
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["Tech Engi"],
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: H1_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/* ===============================================================
   CONTENT
   **double asterisks** render as bold.
=============================================================== */

const toc = [
  { id: "part-1", label: "Part 1: Unpaid overtime" },
  { id: "part-2", label: "Part 2: The cost of bugs" },
  { id: "part-3", label: "Part 3: AI layoffs" },
  { id: "pattern", label: "The actual pattern" },
  { id: "tech-engi", label: "What you control" },
  { id: "faq", label: "FAQ" },
  { id: "sources", label: "Sources" },
];

const SRC = {
  siasat: ["Siasat", "https://www.siasat.com/hyderabad-it-professional-files-complaint-over-16-hour-workdays-3336255/"],
  hrkatha: ["HRKatha", "https://www.hrkatha.com/news/amazon-employee-complains-about-working-hours-gets-fired/"],
  quashbugs: ["QuashBugs", "https://quashbugs.com/blog/cost-of-software-bugs"],
  technadu: ["Technadu", "https://www.technadu.com/boeing-it-outage-reportedly-disrupts-commercial-and-military-production-company-says-not-a-cyberattack/630172/"],
  techspot: ["TechSpot", "https://www.techspot.com/news/112493-tech-layoffs-pass-100000-2026.html"],
  dealroom: ["Dealroom/Yahoo Finance via startups.one", "https://startups.one.gob.es/news/feed/big-tech-cut-80-000-jobs-and-blamed-ai-but-experts-say-companies-are-25-to-75-overstaffed"],
} as const;

const faqs = [
  {
    q: "Is unpaid overtime actually illegal in Indian IT?",
    a: "Indian labour law generally caps overtime at 6 hours a week and requires it to be paid at a premium rate. In practice, IT companies frequently exceed this with no extra pay, and employees who raise it formally have reported being terminated shortly after.",
  },
  {
    q: "Are 2026's tech layoffs really caused by AI?",
    a: "Only 13% of 2026 layoffs have been directly tied to AI, per tracked data — even though AI is the most common public explanation. Multiple industry figures, including OpenAI's Sam Altman, have said companies frequently cite AI as cover for overhiring corrections, interest-rate pressure, and margin protection.",
  },
  {
    q: "How much does a single production bug actually cost a company?",
    a: "There's no fixed per-bug number, but the scale is enormous: the broader cost of poor software quality in the US alone is estimated at $2.41 trillion annually, and a single hour of downtime now averages over $300,000 for mid-size and large enterprises.",
  },
  {
    q: "What can one engineer actually do about any of this?",
    a: "You can't fix company-wide understaffing. You can stop being 100% dependent on one employer for your income by taking on verified freelance engineering work on the side — so a layoff, a bad review cycle, or an unpaid-overtime culture isn't your only option.",
  },
  {
    q: "What does Tech Engi actually do differently?",
    a: "Tech Engi only works with engineering domains — software, embedded, AI, PCB, robotics, IoT, cloud, cybersecurity. Engineers keep 95% of project payment. Companies get verified engineers, NDA protection, and a technical proposal before any advance payment, instead of a six-week hiring process.",
  },
];

/* ===============================================================
   STRUCTURED DATA (JSON-LD): Article + FAQPage
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
      author: { "@type": "Organization", name: "Tech Engi", url: SITE_URL },
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
const CORAL = "bg-[#ff6b57]";

/* ===============================================================
   PAGE
=============================================================== */

export default function IndianItBurnoutPage() {
  return (
    <main className="bg-white text-teal-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ============================ HERO ============================ */}

      <header className="relative overflow-hidden bg-teal-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(204,251,241,0.35) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-teal-700/40 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-20 px-6 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Breadcrumb" className="text-[13px] text-teal-200">
              <ol className="flex items-center gap-2.5">
                <li><Link href="/" className="transition hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="transition hover:text-white">Blog</Link></li>
              </ol>
            </nav>

            <h1 className="mt-9 text-[30px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[40px] lg:text-[44px]">
              Indian IT Is Breaking Its Own People —{" "}
              <span className="bg-[linear-gradient(transparent_64%,#ff6b57_64%)]">
                Then Blaming AI For the Layoffs
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-teal-100/80">
              The overtime is unpaid. The bugs cost millions. The layoffs are
              blamed on AI that didn&apos;t do it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-teal-200">
              <span className="font-semibold text-white">By the Tech Engi team</span>
              <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {READ_TIME}
              </span>
            </div>
          </div>

          <figure>
            <HeroStats />
            <figcaption className="sr-only">
              Three headline numbers from the article: 16-hour workdays, a
              $2.41 trillion yearly cost of poor software quality, and over
              100,000 tech layoffs in 2026.
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ============================ BODY ============================ */}

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-28">
        <article className="min-w-0">
          {/* TL;DR */}

          <aside className={`${TEXT} rounded-[24px] bg-teal-100 p-7 sm:p-10`}>
            <h2 className="text-[17px] font-bold">TL;DR for anyone skimming (AI included)</h2>
            <p className="mt-5 text-[15px] leading-7 text-teal-950">
              <Rich t="Indian IT workers are doing unpaid overtime that regularly exceeds legal limits, companies are absorbing production bugs that cost the global economy $2.41 trillion a year, and 2026's layoffs — over 100,000 and climbing toward 370,000 — are being blamed on AI that experts say isn't actually the cause. The common thread: companies are understaffed on purpose, and the people left are paying for it with their time, their health, and eventually their job." />
            </p>
          </aside>

          <blockquote className={`${TEXT} mt-14 border-l-[4px] border-[#ff6b57] pl-6 sm:pl-8`}>
            <p className="text-[22px] font-bold leading-[1.2] tracking-[-0.03em] sm:text-[28px]">
              You are the variable they adjust in every one of these stories.{" "}
              <span className="text-teal-700">Not AI. Not the economy. You.</span>
            </p>
          </blockquote>

          {/* ---------------- PART 1 ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="part-1">Part 1: The overtime nobody is paying for</H2>
              <Para t="A 45-year-old IT professional in Hyderabad just filed a labour complaint saying he worked **16-hour days for three to four months straight**, over a 14-year tenure, at a major US multinational. He was asked to work while sick. He was denied night-shift allowance. He says staff shortages were the reason he kept getting pushed." />
              <Para t="He was terminated in September 2025. He believes it was retaliation for refusing to keep working like that." src={[SRC.siasat]} />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              <Stat v="16 hrs" l="a day, for three to four months straight" />
              <Stat v="14 yrs" l="tenure at a major US multinational" tone="mint" />
              <Stat v="Sept 2025" l="terminated, which he believes was retaliation" tone="dark" />
            </ul>

            <div className={TEXT}>
              <Para t="He's not the only one. Other Hyderabad IT workers say unpaid weekend and holiday work has been \u201Ccommon since the pandemic.\u201D Most don't even claim the overtime — they're afraid that refusing extra hours gets them fired." />
              <Para t="This isn't new. An Amazon operations manager in Hyderabad was fired in 2020, immediately, after filing a labour complaint that the company's 40-hour contract regularly stretched to 45-plus hours a week, with up to 20 extra unpaid hours on top during peak periods. Indian law caps overtime at 6 hours a week. Nobody is enforcing that inside most IT floors." src={[SRC.hrkatha]} />
            </div>

            <figure className="mt-12">
              <HoursBars />
              <figcaption className="sr-only">
                Weekly hours in the Amazon complaint compared with the legal overtime cap.
              </figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="**The pattern is always the same: understaffed team → unofficial expectation to cover the gap → burnout → complain and get managed out, or stay quiet and break down slowly.**" />
            </div>

            <figure className="mt-12">
              <Flow
                steps={[
                  { icon: Users, title: "Understaffed team", text: "Headcount is short" },
                  { icon: Clock3, title: "Cover the gap", text: "An unofficial expectation" },
                  { icon: Flame, title: "Burnout", text: "Sleep pays the bill" },
                  { icon: UserMinus, title: "Managed out", text: "Or break down slowly" },
                ]}
              />
            </figure>

            <div className={TEXT}>
              <Para t="If you're the one covering a staffing gap right now with your own sleep, you are not imagining it. It is a known, repeated structural choice — not a personal failing." />
            </div>

            <div className={`${TEXT} mt-10 flex items-start gap-4 rounded-[24px] bg-orange-100 p-6 sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#e0523f]">
                <Phone size={19} />
              </span>
              <p className="text-[14.5px] italic leading-7 text-slate-700">
                If reading this is bringing up something heavier than work
                stress — exhaustion that&apos;s turned into something darker —
                please talk to someone. iCall (TISS) is free and confidential at{" "}
                <strong className="not-italic text-teal-950">9152987821</strong>, Mon–Sat, 8am–10pm.
              </p>
            </div>
          </section>

          {/* ---------------- PART 2 ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="part-2">Part 2: The bugs you&apos;re staying late to fix are costing more than your salary ever will</H2>
              <Para t="Here's the part companies don't want connected to Part 1: the same understaffed, overworked teams are the ones shipping the bugs that cost their employers a fortune." />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              <Stat v="$2.41T" l="estimated total US cost of poor software quality a year (CISQ)" />
              <Stat v="$1.7T" l="lost revenue from a sample of just 606 publicly reported software failures in a single year (Tricentis Software Fail Watch)" tone="mint" />
              <Stat v="$300K+" l="average cost of one hour of downtime for most mid-size and large enterprises (ITIC, 2024)" tone="dark" />
            </ul>
            <div className={TEXT}>
              <Cites src={[SRC.quashbugs]} />
              <Para t="Boeing's factories were disrupted in a reported 2026 IT outage that hit both commercial and military production lines." src={[SRC.technadu]} />
              <Para t="Think about the math. A exhausted, understaffed team working unpaid 16-hour days is the team most likely to miss the bug that becomes the $300,000-an-hour outage. Then the company's answer to \u201Cwhy did this break\u201D is never \u201Cwe didn't staff this properly.\u201D It's always a post-mortem that quietly ends with someone's performance review." />
            </div>

            <figure className="mt-12">
              <Flow
                steps={[
                  { icon: Flame, title: "Exhausted team", text: "Understaffed, unpaid 16-hour days" },
                  { icon: Bug, title: "Missed bug", text: "Ships to production" },
                  { icon: Zap, title: "$300K an hour", text: "The outage bill" },
                  { icon: UserMinus, title: "Blame", text: "Lands on the engineer", alert: true },
                ]}
              />
            </figure>

            <div className={TEXT}>
              <Para t="**You cannot out-work a structural staffing problem. You can only get blamed for its symptoms.**" />
            </div>
          </section>

          {/* ---------------- PART 3 ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="part-3">Part 3: The layoffs blamed on AI that experts say AI didn&apos;t cause</H2>
              <Para t="2026 has already passed **100,000 tech layoffs**, and TrueUp's tracking projects it could hit **370,000** by year-end." src={[SRC.techspot]} />
            </div>

            <figure className="mt-12">
              <LayoffBar />
              <figcaption className="sr-only">100,000 layoffs so far against 370,000 projected.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="Big Tech alone cut over **80,000 jobs in Q1 2026** — almost triple Q1 2025's number. AI was cited for 25% of US job cuts in March, but only 13% across all of 2026." src={[SRC.dealroom]} />
            </div>

            <figure className="mt-12">
              <AiBars />
              <figcaption className="sr-only">AI cited for 25% of US job cuts in March, 13% across 2026.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="Here's the part that should make you angry: **experts estimate these same companies are 25% to 75% overstaffed relative to what they're claiming**, and multiple industry voices are now openly calling it \u201CAI washing\u201D — using automation as the cover story for cuts that were coming anyway. Sam Altman himself said nearly every company doing layoffs blames AI, \u201Cwhether or not AI is actually responsible.\u201D Marc Andreessen points instead to interest rates swinging from zero to over 5%." />
              <Para t="Meanwhile Meta cut 8,000 jobs and quietly reassigned another 7,000 into AI roles. Intuit cut 3,000 — 17% of its global workforce — while insisting it's \u201Cnot about AI.\u201D" src={[SRC.techspot]} />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              <Stat v="Meta" l="cut 8,000 jobs and quietly reassigned another 7,000 into AI roles" tone="mint" />
              <Stat v="Intuit" l={'cut 3,000 — 17% of its global workforce — while insisting it\u2019s \u201Cnot about AI\u201D'} tone="dark" />
            </ul>

            <div className={TEXT}>
              <Para t="Translation: **the job you're overworking yourself to protect might get cut anyway, for reasons that have nothing to do with how hard you worked.**" />
            </div>
          </section>

          {/* ---------------- PATTERN ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="pattern">The actual pattern across all three parts</H2>
            </div>

            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                "Companies understaff on purpose because it's cheaper — until the understaffing causes a bug.",
                "The bug costs more than hiring would have — but the blame lands on the engineer who was already stretched thin.",
                "When the company needs a headline reason for layoffs anyway, \u201CAI\u201D is cheaper to say out loud than \u201Cwe overhired, got the interest-rate math wrong, and need to protect margin.\u201D",
              ].map((t, i) => (
                <li key={t} className="rounded-[24px] bg-slate-50 p-7">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold text-teal-950 ${CORAL}`}>
                    {i + 1}
                  </span>
                  <p className="mt-5 text-[14.5px] leading-7 text-slate-700">{t}</p>
                </li>
              ))}
            </ol>

            <div className={TEXT}>
              <Para t="**You are the variable they adjust in every one of these three stories. Not AI. Not the economy. You.**" />
            </div>
          </section>

          {/* ---------------- TECH ENGI ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="tech-engi">The one thing you control</H2>
              <Para t="**The one thing you control is not being a full-time employee absorbing a company's entire staffing risk alone.**" />
              <Para t="This is exactly the gap Tech Engi exists to close — on both sides." />
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-teal-100 p-7 sm:p-8">
                <p className="text-[13px] font-semibold text-teal-700">If you&apos;re the engineer</p>
                <p className="mt-4 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="carrying unpaid overtime for a company that will still \u201Crestructure\u201D you the moment it's convenient: build project-based income on the side, at **95% payout, 5% platform fee**, so no single employer controls 100% of your income or your hours." />
                </p>
                <div className="mt-7">
                  <div className="flex h-9 w-full overflow-hidden rounded-xl text-[12px] font-bold">
                    <span className="flex w-[95%] items-center justify-center bg-teal-700 text-white">95% to you</span>
                    <span className={`flex w-[5%] items-center justify-center text-teal-950 ${CORAL}`} title="5% platform fee" />
                  </div>
                  <p className="mt-2 text-right text-[11.5px] text-slate-500">5% platform fee</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-teal-950 p-7 text-white sm:p-8">
                <p className="text-[13px] font-semibold text-[#ff8f7f]">If you&apos;re the company</p>
                <p className="mt-4 text-[14.5px] leading-7 text-teal-100/85">
                  <Rich t="that just lost a key developer, or found a production bug three days before launch, or is staring at the next \u201Cresize\u201D: you don't need six more permanent headcount to hedge against risk. You need a **verified engineer, fast, for the exact problem in front of you** — bug fix, embedded, PCB, AI integration, cloud, DevOps — with an NDA and a technical proposal before anyone touches your code." />
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Bug fix", "Embedded", "PCB", "AI integration", "Cloud", "DevOps"].map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="relative overflow-hidden rounded-[28px] bg-teal-700 px-7 py-12 text-white sm:px-14 sm:py-16">
                <div className={`pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full ${CORAL}`} />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
                <div className="relative max-w-md">
                  <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                    Stop absorbing the whole system&apos;s failure alone.
                  </p>
                  <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/register/engineer"
                      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold text-teal-950 transition hover:-translate-y-0.5 hover:shadow-xl ${CORAL}`}
                    >
                      Register on Tech Engi
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/register/client"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                    >
                      Hire an Engineer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="faq">FAQ</H2>
              <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold leading-7 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg leading-none text-teal-800 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 pr-10 text-[14.5px] leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- SOURCES ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="sources">Sources</H2>
              <ul className="mt-8 space-y-3.5 text-[14px] leading-6">
                {[
                  ["Siasat", "Hyderabad IT professional files complaint over 16-hour workdays", SRC.siasat[1]],
                  ["HRKatha", "Amazon employee complains about working hours, gets fired", SRC.hrkatha[1]],
                  ["QuashBugs", "Cost of Software Bugs Statistics 2026", SRC.quashbugs[1]],
                  ["Technadu", "Boeing IT outage disrupts production", SRC.technadu[1]],
                  ["TechSpot", "Tech layoffs pass 100,000 in 2026", SRC.techspot[1]],
                  ["Dealroom/Yahoo Finance via startups.one", "Big Tech cut 80,000 jobs, blamed AI, experts say overstaffed", SRC.dealroom[1]],
                ].map(([n, t, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-start gap-2 text-slate-600 transition hover:text-teal-700"
                    >
                      <ArrowUpRight size={15} className="mt-1 shrink-0" />
                      <span><strong className="text-teal-950">{n}</strong> — {t}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>

        {/* ------------------- SIDEBAR ------------------- */}

        <aside className="order-first lg:order-none">
          <details className="rounded-2xl bg-teal-100 p-5 lg:hidden">
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
   TEXT HELPERS
=============================================================== */

function Rich({ t }: { t: string }) {
  return (
    <>
      {t.split("**").map((s, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-teal-950">{s}</strong>
        ) : (
          <span key={i}>{s}</span>
        )
      )}
    </>
  );
}

function Cites({ src }: { src: readonly (readonly [string, string])[] }) {
  return (
    <span className="ml-1 inline-flex flex-wrap gap-2 align-middle">
      {src.map(([n, href]) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-[11.5px] font-semibold text-teal-800 transition hover:bg-teal-200"
        >
          {n}
          <ArrowUpRight size={11} />
        </a>
      ))}
    </span>
  );
}

function Para({ t, src }: { t: string; src?: readonly (readonly [string, string])[] }) {
  return (
    <p className={`${P} mt-6`}>
      <Rich t={t} />
      {src && <Cites src={src} />}
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
    <ol className="mt-5 space-y-3.5 border-l-2 border-teal-200 pl-4 text-[12.5px] leading-5">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="text-slate-600 transition hover:text-teal-700">
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

/* Big-number tile */
function Stat({ v, l, tone = "light" }: { v: string; l: string; tone?: "light" | "mint" | "dark" }) {
  const box =
    tone === "dark" ? "bg-teal-950 text-white" : tone === "mint" ? "bg-teal-100" : "bg-orange-100";
  return (
    <li className={`rounded-[24px] p-7 ${box}`}>
      <p className={`text-[32px] font-bold leading-none tracking-[-0.04em] ${tone === "dark" ? "text-[#ff8f7f]" : tone === "mint" ? "text-teal-700" : "text-[#e0523f]"}`}>
        {v}
      </p>
      <p className={`mt-4 text-[13.5px] leading-6 ${tone === "dark" ? "text-teal-100/80" : "text-slate-700"}`}>{l}</p>
    </li>
  );
}

/* Hero: three headline numbers */
function HeroStats() {
  const rows = [
    { v: "16 hrs", l: "workdays, 3–4 months straight", c: "bg-orange-100 text-[#e0523f]" },
    { v: "$2.41T", l: "yearly US cost of poor software quality", c: "bg-teal-100 text-teal-700" },
    { v: "100K+", l: "tech layoffs so far in 2026", c: "bg-sky-100 text-sky-700" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className={`absolute -right-5 -top-5 h-full w-full rounded-[32px] ${CORAL}`} />
      <div className="relative space-y-4 rounded-[26px] bg-white p-6 text-teal-950 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-7">
        {rows.map((r) => (
          <div key={r.v} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <span className={`flex h-14 min-w-[84px] items-center justify-center rounded-xl px-3 text-[18px] font-bold tracking-[-0.03em] ${r.c}`}>
              {r.v}
            </span>
            <p className="text-[12.5px] leading-5 text-slate-600">{r.l}</p>
          </div>
        ))}
      </div>
      <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-teal-950 shadow-xl sm:flex">
        <Clock3 size={15} className="text-[#e0523f]" />
        Unpaid overtime
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-teal-950 shadow-xl sm:flex">
        <Zap size={15} className="text-teal-700" />
        &ldquo;AI washing&rdquo;
      </div>
    </div>
  );
}

/* Part 1: weekly hours vs the legal overtime cap */
function HoursBars() {
  const rows = [
    { l: "Amazon contract", v: "40 hrs / week", w: 40, c: "bg-teal-700" },
    { l: "Regular week in the complaint", v: "45+ hrs / week", w: 45, c: "bg-[#ff6b57]" },
    { l: "Extra unpaid at peak", v: "up to 20 hrs", w: 20, c: "bg-[#e0523f]" },
    { l: "Legal overtime cap", v: "6 hrs / week", w: 6, c: "bg-teal-300" },
  ];
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <ul className="space-y-6">
        {rows.map((r) => (
          <li key={r.l}>
            <div className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className="font-semibold text-slate-700">{r.l}</span>
              <span className="text-slate-500">{r.v}</span>
            </div>
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-white">
              <span className={`block h-full rounded-full ${r.c}`} style={{ width: `${(r.w / 50) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[12px] text-slate-400">Bars are drawn to scale against each other.</p>
    </div>
  );
}

/* Generic 4-step flow */
function Flow({
  steps,
}: {
  steps: { icon: React.ElementType; title: string; text: string; alert?: boolean }[];
}) {
  return (
    <ol className="relative grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-[#ff6b57] sm:block"
      />
      {steps.map(({ icon: Icon, title, text, alert }) => (
        <li key={title} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
          <span
            className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
              alert ? "bg-red-600 text-white" : "bg-teal-700 text-white"
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

/* Part 3: layoffs so far vs projected */
function LayoffBar() {
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12.5px] font-semibold text-slate-500">Tech layoffs in 2026</p>
          <p className="mt-1 text-[30px] font-bold leading-none tracking-[-0.04em] text-teal-700">100,000+</p>
        </div>
        <div className="text-right">
          <p className="text-[12.5px] font-semibold text-slate-500">TrueUp projection</p>
          <p className="mt-1 text-[30px] font-bold leading-none tracking-[-0.04em] text-[#e0523f]">370,000</p>
        </div>
      </div>
      <div className="mt-6 h-6 w-full overflow-hidden rounded-full bg-[#ffd9d3]">
        <span className="block h-full rounded-full bg-teal-700" style={{ width: "27%" }} />
      </div>
      <p className="mt-3 text-[12px] text-slate-400">Passed 100,000 so far, climbing toward 370,000 by year-end.</p>
    </div>
  );
}

/* Part 3: AI cited vs overall */
function AiBars() {
  const rows = [
    { l: "AI cited for US job cuts, March", v: 25, c: "bg-[#ff6b57]" },
    { l: "AI cited across all of 2026", v: 13, c: "bg-teal-700" },
  ];
  return (
    <div className="rounded-[24px] bg-teal-950 p-7 text-white sm:p-8">
      <ul className="space-y-6">
        {rows.map((r) => (
          <li key={r.l}>
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="font-semibold text-teal-100">{r.l}</span>
              <span className="text-[20px] font-bold tracking-[-0.03em]">{r.v}%</span>
            </div>
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-white/10">
              <span className={`block h-full rounded-full ${r.c}`} style={{ width: `${r.v * 2}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-2 text-[12.5px] text-teal-200">
        <Check size={14} strokeWidth={3} />
        AI is the most common public explanation, not the main cause.
      </p>
    </div>
  );
}