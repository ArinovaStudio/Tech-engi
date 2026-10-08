import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BadgeCheck,
  Check,
  Clock3,
  FileSignature,
  Flag,
  Ghost,
  Lock,
  MessageCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Timer,
  TrendingDown,
  UserX,
  Wallet,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/how-to-avoid-scammer-freelancers/page.tsx

   SEO BRIEF
   - Primary keyword : how to avoid freelancer scams
   - Secondary       : freelance scam red flags, hire freelancer safely India
   - Slug            : /blog/how-to-avoid-scammer-freelancers
   - Meta title      : <= 60 chars (52 used)
   - Meta description: <= 155 chars (143 used)
   - Use the primary keyword in the H1, the first paragraph, one H2 and the FAQ.
   - Add a 1200x630 image at public/og/how-to-avoid-scammer-freelancers.png
   - Internal links: link to /blog and the register CTAs; add 2-3 related
     blog links once those posts exist.
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.tsquarey.tech";
const PATH = "/blog/how-to-avoid-scammer-freelancers";
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = "/og/how-to-avoid-scammer-freelancers.png";

const META_TITLE = "How to Avoid Scammer Freelancers (Red Flags + Fixes)";
const META_DESCRIPTION =
  "Lost money to a freelancer who vanished mid-project? Here's how to spot scammer freelancers before you pay — and how to hire safely every time.";
const H1_TITLE =
  "How to Avoid Scammer or Cheating Freelancers (Before They Cost You)";

const PUBLISHED = "2026-10-08";
const MODIFIED = "2026-10-08";
const PUBLISHED_LABEL = "8 October 2026";
const READ_TIME = "5 min read";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "how to avoid freelancer scams",
    "freelance scam red flags",
    "hire freelancer safely India",
    "scammer freelancers",
    "escrow payments freelancers",
    "freelance scope creep",
    "Tech Engi",
  ],
  authors: [{ name: "Tech Engi" }],
  alternates: { canonical: PATH },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "article",
    url: PATH,
    siteName: "Tech Engi",
    locale: "en_IN",
    title: META_TITLE,
    description: META_DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["Tech Engi"],
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: H1_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/* ===============================================================
   CONTENT
=============================================================== */

const toc = [
  { id: "patterns", label: "Common scam patterns" },
  { id: "red-flags", label: "Red flags checklist" },
  { id: "protect", label: "How to protect yourself" },
  { id: "tech-engi", label: "Built to prevent this" },
  { id: "faq", label: "FAQ" },
];

const patterns = [
  {
    n: "1",
    title: "The Vanishing Act",
    body: "You pay an upfront deposit. Work starts slow, communication gets vaguer, and then — nothing. No replies, no delivery, no refund. This is the single most common freelance scam, and it almost always follows the same setup:",
    strong: "full payment requested before any work begins, with no milestone structure.",
  },
  {
    n: "2",
    title: "The Portfolio That Isn't Theirs",
    body: "Scammers often lift real developers' GitHub projects, Behance portfolios, or case studies and present them as their own. If a freelancer's portfolio looks too polished for their quoted price, verify it — ask specific questions about a project's implementation details that only the actual builder would know.",
  },
  {
    n: "3",
    title: "The Fake Urgency Close",
    body: "\u201CI have three other clients waiting, I need the deposit today to lock in your slot.\u201D Real professionals don't need to pressure you into skipping due diligence. Urgency is one of the oldest manipulation tactics in any scam, freelance or otherwise — treat it as a red flag by default.",
  },
  {
    n: "4",
    title: "The Scope Creep Trap (the \u201Clegal\u201D version of cheating)",
    body: "Not every bad freelance experience is outright fraud — sometimes it's a freelancer who quotes low, then slowly expands the ask (\u201Cthat's a separate feature, that'll cost extra\u201D) until the final bill is unrecognizable from the quote. This isn't illegal, but it's dishonest, and it's just as costly.",
  },
  {
    n: "5",
    title: "No Real Identity Behind the Profile",
    body: "A profile with no verifiable history, a brand-new account, stock-photo-looking avatar, and no reviews isn't automatically a scam — everyone starts somewhere — but it is a risk you should price in. Treat an unverified freelancer as higher-risk, not as guilty, but don't skip the verification step just because they seem nice on a call.",
  },
];

const redFlags = [
  { icon: Banknote, text: "Full payment requested upfront, with no milestone-based structure" },
  { icon: FileSignature, text: "Refuses to sign an NDA or even discuss one" },
  { icon: Search, text: "No verifiable past work, reviews, or references" },
  { icon: MessageCircle, text: "Pushes you to move communication off-platform immediately (so there's no record)" },
  { icon: ShieldAlert, text: "Can't clearly answer technical questions about their own stated experience" },
  { icon: Timer, text: "Pressures you to decide or pay today" },
  { icon: TrendingDown, text: "Price is dramatically lower than every other quote you've received, with no clear reason why" },
];

const techEngi = [
  { icon: BadgeCheck, lead: "Verified engineers only", text: "every engineer is screened before they're eligible to take on a project, so you're not gambling on an unverifiable stranger" },
  { icon: FileSignature, lead: "NDA signed before any code or company detail is shared", text: "non-negotiable, every engagement" },
  { icon: Lock, lead: "Escrow-protected payments", text: "your money is held securely and released only once work is delivered and approved. No upfront-and-vanish risk, because the freelancer only gets paid for confirmed, completed work" },
  { icon: Flag, lead: "Milestone-based structure", text: "scope and payment are tied together from the start, which closes off both the vanishing-act scam and the slow scope-creep problem" },
];

const faqs = [
  {
    q: "How do I avoid freelancer scams?",
    a: "Never pay 100% upfront, use escrow instead of direct transfer, sign an NDA before sharing code or business details, verify past work instead of trusting a good call, and keep communication and payment on one platform.",
  },
  {
    q: "What are the biggest freelance scam red flags?",
    a: "Full payment requested before any work begins, pressure to pay today, no verifiable past work or reviews, refusing an NDA, pushing you off-platform, and a price far below every other quote.",
  },
  {
    q: "Is it safe to pay a freelancer upfront?",
    a: "Paying 100% upfront with no milestones is the setup behind the most common freelance scam. Structure the engagement around milestones, with a portion on start and the rest tied to specific, verifiable deliverables.",
  },
  {
    q: "How does escrow protect me when I hire a freelancer?",
    a: "Escrow holds your funds securely and releases them only once the work is approved. It removes the biggest point of failure in freelance hiring: trusting a stranger with money before they've proven anything.",
  },
  {
    q: "How can I hire a freelancer safely in India?",
    a: "Use a platform that screens engineers, requires an NDA, holds payments in escrow and ties scope to milestones. Avoid moving to WhatsApp and UPI transfers outside any protected system.",
  },
];

/* ===============================================================
   STRUCTURED DATA (JSON-LD)
=============================================================== */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${URL_FULL}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": URL_FULL },
      headline: H1_TITLE,
      description: META_DESCRIPTION,
      image: [`${SITE_URL}${OG_IMAGE}`],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      inLanguage: "en-IN",
      author: { "@type": "Organization", name: "Tech Engi", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Tech Engi", url: SITE_URL },
      keywords:
        "how to avoid freelancer scams, freelance scam red flags, hire freelancer safely India",
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

export default function AvoidScammerFreelancersPage() {
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
                <li>
                  <Link href="/" className="transition hover:text-[#1257e8]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition hover:text-[#1257e8]">
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="mt-9 text-[30px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[40px] lg:text-[46px]">
              How to Avoid Scammer or Cheating Freelancers{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                (Before They Cost You)
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Freelance scams follow a predictable shape, and once you know what
              to look for, most of them are avoidable before you ever send money.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
              <span className="font-semibold text-[#050a30]">By the Tech Engi team</span>
              <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {READ_TIME}
              </span>
            </div>
          </div>

          <figure>
            <ScamMock />
            <figcaption className="sr-only">
              Illustration of a risky freelance proposal with three red flags:
              full upfront payment, pay-today pressure and an off-platform chat.
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ============================ BODY ============================ */}

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-28">
        <article className="min-w-0">
          {/* Intro */}

          <p className={`${TEXT} text-[18px] leading-[1.75] text-[#050a30] sm:text-[19px]`}>
            If you&apos;ve ever hired a freelancer and watched them go silent
            after the first payment, you&apos;re not alone — and it&apos;s not
            bad luck. It&apos;s a pattern. Freelance scams follow a predictable
            shape, and once you know what to look for, most of them are
            avoidable before you ever send money.
          </p>

          <p className={`${TEXT} ${P} mt-9`}>
            Here&apos;s exactly what to check, what to avoid, and what actually
            protects you.
          </p>

          <blockquote className={`${TEXT} mt-7 border-l-[4px] border-amber-500 pl-6 sm:pl-8`}>
            <p className="text-[22px] font-bold leading-[1.2] tracking-[-0.03em] sm:text-[28px]">
              Hiring a freelancer shouldn&apos;t mean hoping you got lucky.{" "}
              <span className="text-[#1257e8]">
                It should mean the system protects you either way.
              </span>
            </p>
          </blockquote>

          {/* Key takeaways */}

          <aside className={`${TEXT} mt-16 rounded-[24px] bg-amber-100 p-7 sm:p-10`}>
            <h2 className="text-[17px] font-bold">Key takeaways</h2>
            <ul className="mt-7 space-y-5">
              {[
                "Most freelance scams start the same way: full payment upfront, no milestones, and pressure to hurry.",
                "Never pay 100% upfront. Tie every payment to specific, verifiable deliverables.",
                "Escrow, an NDA and verified engineers protect you whether you got lucky or not.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3.5 text-[14.5px] leading-7 text-slate-800">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </aside>

          {/* ---------------- PATTERNS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="patterns">The Most Common Freelancer Scam Patterns</H2>
            </div>

            {patterns.map((p) => (
              <div key={p.n} className="mt-20">
                <div className={TEXT}>
                  <H3 n={p.n}>{p.title}</H3>
                  <p className={`${P} mt-5`}>
                    {p.body}
                    {p.strong && <strong className="text-[#050a30]"> {p.strong}</strong>}
                  </p>
                </div>
                <figure className="mt-12">
                  {p.n === "1" && <VanishFlow />}
                  {p.n === "2" && (
                    <Versus
                      badTitle="Lifted portfolio"
                      bad={["Looks too polished for the quoted price", "Vague about how it was actually built"]}
                      goodTitle="Real builder"
                      good={["Answers implementation questions in detail", "Can walk you through their own decisions"]}
                    />
                  )}
                  {p.n === "3" && <UrgencyChat />}
                  {p.n === "4" && <ScopeCreep />}
                  {p.n === "5" && <ProfileRisk />}
                </figure>
              </div>
            ))}
          </section>

          {/* ---------------- RED FLAGS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="red-flags">Red Flags Checklist — Before You Pay Anyone</H2>
            </div>

            <ul className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
              {redFlags.map(({ icon: Icon, text }) => (
                <li key={text} className="border-t border-slate-200 pt-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 text-[15px] leading-7 text-slate-700">{text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- PROTECT ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="protect">How to Actually Protect Yourself</H2>
            </div>

            <div className="mt-16">
              <div className={TEXT}>
                <H3 n="1">Never pay 100% upfront.</H3>
                <p className={`${P} mt-5`}>
                  Structure every engagement around milestones — a portion on
                  start, the rest tied to specific, verifiable deliverables.
                </p>
              </div>
              <figure className="mt-12"><MilestoneBars /></figure>
            </div>

            <div className="mt-20">
              <div className={TEXT}>
                <H3 n="2">Use escrow, not direct transfer.</H3>
                <p className={`${P} mt-5`}>
                  If a platform offers escrow-protected payment — funds held
                  securely and released only once work is approved — use it. It
                  removes the single biggest point of failure in freelance
                  hiring: trusting a stranger with money before they&apos;ve
                  proven anything.
                </p>
              </div>
              <figure className="mt-12"><EscrowFlow /></figure>
            </div>

            <div className="mt-20">
              <div className={TEXT}>
                <H3 n="3">Insist on an NDA before sharing real code or business details.</H3>
                <p className={`${P} mt-5`}>
                  A legitimate freelancer won&apos;t hesitate. Someone who
                  resists is telling you something.
                </p>
              </div>
              <figure className="mt-12">
                <Versus
                  badTitle="Resists"
                  bad={["Refuses to sign an NDA or even discuss one"]}
                  goodTitle="Legitimate"
                  good={["Signs before any code or business detail is shared"]}
                />
              </figure>
            </div>

            <div className="mt-20">
              <div className={TEXT}>
                <H3 n="4">Verify, don&apos;t just vibe-check.</H3>
                <p className={`${P} mt-5`}>
                  A good conversation isn&apos;t proof of competence. Ask for
                  referenceable past work, or — better — hire through a platform
                  that screens engineers before they&apos;re even eligible to
                  take projects.
                </p>
              </div>
              <figure className="mt-12">
                <Versus
                  badTitle="Vibe check"
                  bad={["A friendly call", "No references, no way to confirm"]}
                  goodTitle="Verification"
                  good={["Referenceable past work", "Engineers screened before they can take projects"]}
                />
              </figure>
            </div>

            <div className="mt-20">
              <div className={TEXT}>
                <H3 n="5">Keep communication and payment on one platform.</H3>
                <p className={`${P} mt-5`}>
                  The moment someone pushes you to WhatsApp and a UPI transfer
                  outside any protected system, you&apos;ve lost every safety
                  net a platform would have given you.
                </p>
              </div>
              <figure className="mt-12">
                <Versus
                  badTitle="Off-platform"
                  bad={["WhatsApp chat + UPI transfer", "No record, no safety net"]}
                  goodTitle="One platform"
                  good={["Messages and payments in one place", "Protected payment with a record of everything"]}
                />
              </figure>
            </div>
          </section>

          {/* ---------------- TECH ENGI ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="tech-engi">Why This Is Exactly What Tech Engi Was Built to Prevent</H2>
              <p className={`${P} mt-7`}>
                Every protection listed above isn&apos;t a theoretical best
                practice on Tech Engi — it&apos;s built into how the platform
                works by default:
              </p>
            </div>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2">
              {techEngi.map(({ icon: Icon, lead, text }, i) => (
                <li
                  key={lead}
                  className={`rounded-[24px] p-7 ${i % 3 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 3 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[16px] font-bold leading-6">{lead}</p>
                  <p className="mt-2.5 text-[14px] leading-6 text-slate-700">{text}</p>
                </li>
              ))}
            </ul>

            <p className={`${TEXT} ${P} mt-14`}>
              Hiring a freelancer shouldn&apos;t mean hoping you got lucky. It
              should mean the system protects you whether you got lucky or not
              — and that&apos;s the actual difference between a freelance gig
              board and a platform built around trust by design.
            </p>

            <div className="mt-16">
              <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
                <div className="relative max-w-md">
                  <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                    Hire a verified engineer, with your payment protected from day one.
                  </p>
                  <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/register/client"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                    >
                      Start a Project
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
   HEADINGS + TOC
=============================================================== */

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-[24px] font-bold leading-[1.18] tracking-[-0.035em] sm:text-[31px]"
    >
      {children}
    </h2>
  );
}

function H3({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h3 className="flex scroll-mt-28 items-start gap-4 text-[19px] font-bold leading-[1.25] tracking-[-0.025em] sm:text-[22px]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-[#050a30]">
        {n}
      </span>
      <span className="pt-1">{children}</span>
    </h3>
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
   VISUALS (pure HTML/Tailwind, no image files needed)
=============================================================== */

/* Hero: a risky proposal card with red flags */
function ScamMock() {
  const rows = [
    { label: "Payment", value: "100% upfront" },
    { label: "Deadline", value: "Pay today" },
    { label: "Chat", value: "Move to WhatsApp" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">Freelancer proposal</p>
            <p className="mt-0.5 text-[15px] font-bold">Website build</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-[11px] font-semibold text-red-700">
            <Flag size={13} />3 red flags
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
              <span className="text-[12px] text-slate-500">{r.label}</span>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-red-700">
                {r.value}
                <ShieldAlert size={14} />
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-[#050a30] p-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#050a30]">
            <Lock size={17} />
          </span>
          <div>
            <p className="text-[13px] font-semibold">Safer: escrow + milestones</p>
            <p className="mt-0.5 text-[11px] text-white/60">Paid only on approved work</p>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <UserX size={15} className="text-red-600" />
        Unverified profile
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <ShieldCheck size={15} className="text-amber-600" />
        No escrow
      </div>
    </div>
  );
}

/* Pattern 1: deposit paid, then fading contact, then silence */
function VanishFlow() {
  const steps = [
    { icon: Wallet, title: "Deposit paid", text: "Full amount, upfront", o: "opacity-100" },
    { icon: Timer, title: "Work starts slow", text: "Progress is thin", o: "opacity-90" },
    { icon: MessageCircle, title: "Replies get vague", text: "Answers shrink", o: "opacity-75" },
    { icon: Ghost, title: "Silence", text: "No delivery, no refund", o: "opacity-100" },
  ];
  return (
    <ol className="relative grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-amber-400 sm:block"
      />
      {steps.map(({ icon: Icon, title, text, o }, i) => (
        <li key={title} className={`relative flex items-center gap-4 sm:flex-col sm:text-center ${o}`}>
          <span
            className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
              i === 3 ? "bg-red-600 text-white" : "bg-[#1257e8] text-white"
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

/* Pattern 3: pressure message in a chat bubble */
function UrgencyChat() {
  return (
    <div className="max-w-[560px] rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[12px] font-bold text-white">
          ?
        </span>
        <div className="rounded-2xl rounded-tl-sm bg-white p-4 text-[14px] leading-6 text-slate-700 shadow-sm">
          I have three other clients waiting, I need the deposit today to lock
          in your slot.
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5 pl-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1.5 text-[12px] font-semibold text-red-700">
          <Timer size={13} />
          Fake urgency
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-3.5 py-1.5 text-[12px] font-semibold text-amber-900">
          <Flag size={13} />
          Red flag by default
        </span>
      </div>
    </div>
  );
}

/* Pattern 4: the bill grows away from the quote */
function ScopeCreep() {
  const bars = [
    { label: "Quote", base: 40, extra: 0 },
    { label: "\u201CSeparate feature, costs extra\u201D", base: 40, extra: 22 },
    { label: "Final bill", base: 40, extra: 50 },
  ];
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <ul className="space-y-6">
        {bars.map((b) => (
          <li key={b.label}>
            <p className="text-[13px] font-semibold text-slate-600">{b.label}</p>
            <div className="mt-2 flex h-5 w-full overflow-hidden rounded-full bg-white">
              <span className="h-full bg-[#1257e8]" style={{ width: `${b.base}%` }} />
              <span className="h-full bg-amber-500" style={{ width: `${b.extra}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-4 text-[12px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1257e8]" /> Quoted scope
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Added later
        </span>
        <span>Illustrative</span>
      </p>
    </div>
  );
}

/* Pattern 5: an unverified profile, priced in as risk */
function ProfileRisk() {
  const checks = [
    { t: "Verifiable history", ok: false },
    { t: "Account age", ok: false },
    { t: "Real profile photo", ok: false },
    { t: "Reviews", ok: false },
  ];
  return (
    <div className="grid items-stretch gap-5 md:grid-cols-[1.2fr_1fr]">
      <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-400">
            <UserX size={21} />
          </span>
          <p className="text-[15px] font-bold">New, unverified profile</p>
        </div>
        <ul className="mt-6 space-y-3">
          {checks.map((c) => (
            <li key={c.t} className="flex items-center gap-3 text-[14px] text-slate-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-500">
                <X size={13} strokeWidth={3} />
              </span>
              {c.t}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-center rounded-[24px] bg-amber-100 p-7 sm:p-8">
        <p className="text-[13px] font-semibold text-amber-900/70">How to treat it</p>
        <p className="mt-3 text-[20px] font-bold leading-[1.25] tracking-[-0.02em]">
          Higher-risk, not guilty.
        </p>
        <p className="mt-3 text-[13.5px] leading-6 text-slate-700">
          Price the risk in, and still run the verification step.
        </p>
      </div>
    </div>
  );
}

/* Protect 1: never 100% upfront vs milestones */
function MilestoneBars() {
  const parts = ["On start", "Deliverable 1", "Deliverable 2", "Final approval"];
  return (
    <div className="space-y-7 rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <div>
        <p className="flex items-center gap-2 text-[13px] font-semibold text-red-600">
          <X size={14} strokeWidth={3} /> 100% upfront
        </p>
        <div className="mt-2.5 h-9 w-full rounded-xl bg-red-500" />
      </div>
      <div>
        <p className="flex items-center gap-2 text-[13px] font-semibold text-[#1257e8]">
          <Check size={14} strokeWidth={3} /> Milestone-based
        </p>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {parts.map((p, i) => (
            <div
              key={p}
              className={`flex h-9 items-center justify-center rounded-xl px-1 text-center text-[11px] font-semibold ${
                i === 0 ? "bg-amber-500 text-[#050a30]" : "bg-[#1257e8] text-white"
              }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Protect 2: how escrow moves money */
function EscrowFlow() {
  const steps = [
    { icon: Wallet, title: "Funds held", text: "Securely in escrow" },
    { icon: Flag, title: "Work delivered", text: "Against the milestone" },
    { icon: Check, title: "You approve", text: "Only when satisfied" },
    { icon: BadgeCheck, title: "Released", text: "Freelancer is paid" },
  ];
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
              i === 3 ? "bg-amber-500 text-[#050a30]" : "bg-[#1257e8] text-white"
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

/* Reusable bad-vs-good comparison */
function Versus({
  badTitle,
  bad,
  goodTitle,
  good,
}: {
  badTitle: string;
  bad: string[];
  goodTitle: string;
  good: string[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
        <p className="text-[13px] font-semibold text-slate-400">{badTitle}</p>
        <ul className="mt-7 space-y-4">
          {bad.map((t) => (
            <li key={t} className="flex items-center gap-3.5 text-[14px] text-slate-500">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-red-500">
                <X size={13} strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[24px] bg-[#1257e8] p-7 text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)] sm:p-8">
        <p className="text-[13px] font-semibold text-amber-300">{goodTitle}</p>
        <ul className="mt-7 space-y-4">
          {good.map((t) => (
            <li key={t} className="flex items-center gap-3.5 text-[14px] font-medium">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                <Check size={13} strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}