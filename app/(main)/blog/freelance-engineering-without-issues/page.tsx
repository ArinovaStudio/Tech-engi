import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Check,
  Clock3,
  Expand,
  FileSignature,
  Flag,
  Layers,
  Lock,
  Scale,
  ShieldAlert,
  ShieldCheck,
  User,
  UserX,
  Users,
  Wallet,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/freelance-engineering-without-issues/page.tsx
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.tsquarey.tech";
const PATH = "/blog/freelance-engineering-without-issues";
const URL_FULL = `${SITE_URL}${PATH}`;

// Add a 1200x630 image at public/og/freelance-engineering-without-issues.png
const OG_IMAGE = "/og/freelance-engineering-without-issues.png";

const META_TITLE = "Tech Engi: Freelance Engineering Work, Without the Chaos"; // 56 chars
const META_DESCRIPTION =
  "Tired of ghosted clients, scope creep, and chasing payments? See how Tech Engi helps freelance engineers in India find real work and get paid on time.";
const H1_TITLE =
  "How Tech Engi Helps Freelance Engineers Finish Work Without the Usual Chaos";

const PUBLISHED = "2026-10-06";
const MODIFIED = "2026-10-06";
const PUBLISHED_LABEL = "6 October 2026";
const READ_TIME = "5 min read";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "freelance work without issues",
    "freelance platform India",
    "how to get freelance clients as an engineer",
    "freelance engineers India",
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
  { id: "problems", label: "The real problems" },
  { id: "escrow", label: "NDA and escrow" },
  { id: "verified", label: "Verified on both sides" },
  { id: "layers", label: "Three layers" },
  { id: "leads", label: "Leads with milestones" },
  { id: "portfolio", label: "Verifiable portfolio" },
  { id: "bottom-line", label: "The bottom line" },
  { id: "faq", label: "FAQ" },
];

const problems = [
  {
    icon: Expand,
    text: "Scope that quietly expands after the contract is signed, with no mechanism to push back",
  },
  {
    icon: UserX,
    text: "Clients who vanish mid-project, leaving partial work and no payment",
  },
  {
    icon: ShieldAlert,
    text: "No real way to prove your work is trustworthy to a client who's never met you",
  },
  {
    icon: Scale,
    text: "Payment terms that favor the client entirely, with the freelancer carrying all the risk",
  },
];

const faqs = [
  {
    q: "How do I get freelance clients as an engineer in India?",
    a: "Finding leads is only step one. Instead of cold-pitching every “looking for a developer” post on LinkedIn, projects posted on Tech Engi come with defined scope, milestones and payment structure already built in, so you see the terms before you ever say yes.",
  },
  {
    q: "How can I do freelance work without issues like ghosted clients or scope creep?",
    a: "Those problems are solved by structure, not by more leads. On Tech Engi every project starts with an NDA, payments move through escrow and are released at each approved milestone, and scope is defined up front, so neither side can quietly disappear once money is in motion.",
  },
  {
    q: "How does escrow protect my payment on Tech Engi?",
    a: "Payments are held safely in escrow and released only once the work is approved at each milestone. That removes the situation where a freelancer delivers partial work and never gets paid.",
  },
  {
    q: "Are engineers and clients verified on Tech Engi?",
    a: "Yes. Every engineer is screened before being matched to a project, and clients are verified too, so engineers aren't bidding blind against an anonymous, unverifiable client.",
  },
  {
    q: "What are Layer 1, Layer 2 and Layer 3 projects?",
    a: "Layer 1 is the marketplace: one engineer hired directly for a focused, single-scope project. Layer 2 is managed teams: a small coordinated team for multi-discipline work, with Tech Engi handling coordination. Layer 3 is product delivery: full ownership handed to Tech Engi's network for clients who want to step back entirely.",
  },
  {
    q: "Does working through Tech Engi help me build a portfolio?",
    a: "Yes. Work delivered through Tech Engi becomes a showcase-ready, verifiable project you can point to when pitching your next client.",
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
        "freelance work without issues, freelance platform India, how to get freelance clients as an engineer",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
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
   Content sits on the left; "In this article" sidebar on the right.
=============================================================== */

const TEXT = "w-full max-w-[640px]";
const P = "text-[16px] leading-[1.85] text-slate-600";

/* ===============================================================
   PAGE
=============================================================== */

export default function FreelanceEngineeringWithoutIssuesPage() {
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
                  <Link
                    href="/blog"
                    className="transition hover:text-[#1257e8]"
                  >
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="mt-9 text-[30px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[40px] lg:text-[46px]">
              How Tech Engi Helps Freelance Engineers Finish Work{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                Without the Usual Chaos
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Ghosted clients, scope creep and late payments aren&apos;t a
              coding problem. They&apos;re a structure problem, and structure
              is fixable.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
              <span className="font-semibold text-[#050a30]">
                By the Tech Engi team
              </span>
              <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {READ_TIME}
              </span>
            </div>
          </div>

          <figure>
            <ProjectMock />
            <figcaption className="sr-only">
              Illustration of a Tech Engi project: NDA signed, payment held in
              escrow, and milestones released as work is approved.
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ============================ BODY ============================ */}

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-28">
        {/* ------------------------ ARTICLE (left) ------------------------ */}

        <article className="min-w-0">
          {/* Intro */}

          <p className={`${TEXT} text-[18px] leading-[1.75] text-[#050a30] sm:text-[19px]`}>
            If you&apos;ve freelanced as a developer or engineer in India for
            more than a few months, you already know the real job isn&apos;t
            the code. It&apos;s everything around the code — chasing leads on
            LinkedIn, negotiating with a client who disappears after the
            kickoff call, wondering if that first payment milestone will
            actually land on time, and hoping the next project doesn&apos;t
            turn into unpaid scope creep.
          </p>

          <p className={`${TEXT} ${P} mt-9`}>
            Tech Engi was built around a simple observation:
          </p>

          <blockquote
            className={`${TEXT} mt-7 border-l-[4px] border-amber-500 pl-6 sm:pl-8`}
          >
            <p className="text-[22px] font-bold leading-[1.2] tracking-[-0.03em] sm:text-[28px]">
              Freelance engineers don&apos;t fail because they can&apos;t
              code.{" "}
              <span className="text-[#1257e8]">
                They fail because the system around the code is broken.
              </span>
            </p>
          </blockquote>

          {/* Key takeaways */}

          <aside className={`${TEXT} mt-16 rounded-[24px] bg-amber-100 p-7 sm:p-10`}>
            <h2 className="text-[17px] font-bold">Key takeaways</h2>
            <ul className="mt-7 space-y-5">
              {[
                "Scope creep, ghosting and payment risk are structural problems. More leads don't fix them.",
                "NDA-protected, escrow-backed projects mean neither side can quietly disappear once money is in motion.",
                "Verified engineers, verified clients and clear milestones let you finish work without a fight.",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3.5 text-[14.5px] leading-7 text-slate-800"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </aside>

          {/* ---------------- PROBLEMS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="problems">
                The Real Problems Freelancers Deal With (Not Just
                &ldquo;Finding Clients&rdquo;)
              </H2>

              <p className={`${P} mt-7`}>
                Most freelance platforms treat the problem as a discovery
                problem — just find more leads, bid on more jobs. But if
                you&apos;ve actually worked a few freelance contracts, you
                know discovery is only step one. The things that actually
                derail a freelance engagement are:
              </p>
            </div>

            <ul className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
              {problems.map(({ icon: Icon, text }) => (
                <li key={text} className="border-t border-slate-200 pt-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-200 text-amber-700">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 text-[15px] leading-7 text-slate-700">
                    {text}
                  </p>
                </li>
              ))}
            </ul>

            <p className={`${TEXT} mt-14 text-[18px] font-bold leading-[1.4] tracking-[-0.02em]`}>
              None of these are solved by &ldquo;more leads.&rdquo;{" "}
              <span className="text-[#1257e8]">
                They&apos;re solved by structure.
              </span>
            </p>
          </section>

          {/* ---------------- HOW IT FIXES ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2>How Tech Engi Actually Fixes This</H2>
            </div>

            {/* 1. Escrow */}

            <div className={`${TEXT} mt-16`}>
              <H3 id="escrow" n="1">
                NDA-Protected, Escrow-Backed Projects
              </H3>
              <p className={`${P} mt-5`}>
                Every project on Tech Engi starts with an NDA, and payments
                move through escrow — held safely and released only once work
                is approved at each milestone. This isn&apos;t a
                nice-to-have; it&apos;s the single biggest difference between
                a freelance platform and a freelance marketplace with teeth.
                Neither side can quietly disappear once money is in motion.
              </p>
            </div>

            <figure className="mt-14">
              <EscrowFlow />
              <figcaption className="sr-only">
                How a Tech Engi project moves from NDA to released payment.
              </figcaption>
            </figure>

            {/* 2. Verified */}

            <div className={`${TEXT} mt-28`}>
              <H3 id="verified" n="2">
                Verified Engineers, Verified Clients
              </H3>
              <p className={`${P} mt-5`}>
                Every engineer on Tech Engi is screened before they&apos;re
                matched to a project. That verification cuts both ways —
                clients trust the engineer they&apos;re matched with, and
                engineers aren&apos;t bidding blind against an anonymous,
                unverifiable client. Trust stops being something you have to
                build from zero on every single project.
              </p>
            </div>

            <figure className="mt-14">
              <div className="grid gap-5 sm:grid-cols-2">
                <VerifyCard
                  tone="blue"
                  icon={User}
                  title="Engineers"
                  line="Screened before they're matched to a project"
                />
                <VerifyCard
                  tone="amber"
                  icon={Users}
                  title="Clients"
                  line="Verified, so you're not bidding blind against an unknown"
                />
              </div>
              <figcaption className="sr-only">
                Verification cuts both ways: engineers and clients are both
                checked.
              </figcaption>
            </figure>

            {/* 3. Layers */}

            <div className={`${TEXT} mt-28`}>
              <H3 id="layers" n="3">
                Three Layers, Matched to the Actual Work
              </H3>
              <p className={`${P} mt-5`}>
                Not every project is the same shape, and Tech Engi
                doesn&apos;t pretend it is:
              </p>
            </div>

            <figure className="mt-14">
              <div className="grid gap-5 md:grid-cols-3">
                <LayerCard
                  tone="white"
                  tag="Layer 1"
                  name="Marketplace"
                  dots={1}
                  text="One engineer, hired directly, for a focused, single-scope project"
                />
                <LayerCard
                  tone="blue"
                  tag="Layer 2"
                  name="Managed Teams"
                  dots={4}
                  text="A small coordinated team for multi-discipline work, with Tech Engi handling coordination so you're not managing four Slack threads"
                />
                <LayerCard
                  tone="navy"
                  tag="Layer 3"
                  name="Product Delivery"
                  dots={9}
                  text="Full ownership handed to Tech Engi's network, for clients who want to step back entirely"
                />
              </div>
              <figcaption className="sr-only">
                From a single engineer to a full delivery network.
              </figcaption>
            </figure>

            <p className={`${TEXT} ${P} mt-12`}>
              For freelancers, this matters because you&apos;re matched to
              work that fits your actual capacity — not shoehorned into a
              generic &ldquo;gig&rdquo; that doesn&apos;t match what you do.
            </p>

            {/* 4. Leads */}

            <div className={`${TEXT} mt-28`}>
              <H3 id="leads" n="4">
                Leads That Come to You, With Real Milestone Structure
              </H3>
              <p className={`${P} mt-5`}>
                Instead of cold-pitching every &ldquo;looking for a
                developer&rdquo; post on LinkedIn, projects posted on Tech
                Engi come with defined scope, milestones, and payment
                structure already built in — before you ever say yes. That
                alone removes most of the scope-creep risk that kills
                freelance relationships elsewhere.
              </p>
            </div>

            <figure className="mt-14">
              <LeadCompare />
              <figcaption className="sr-only">
                A cold-pitched post versus a project that arrives with its
                structure built in.
              </figcaption>
            </figure>

            {/* 5. Portfolio */}

            <div className={`${TEXT} mt-28`}>
              <H3 id="portfolio" n="5">
                Every Project Becomes Verifiable Portfolio
              </H3>
              <p className={`${P} mt-5`}>
                Work delivered through Tech Engi isn&apos;t just a payment —
                it&apos;s a showcase-ready, verifiable project you can point
                to for the next client. Certificates and one-off freelance
                gigs don&apos;t do this. Real, delivered work does.
              </p>
            </div>

            <figure className="mt-14">
              <PortfolioMock />
              <figcaption className="sr-only">
                Delivered work becomes a verifiable project you can show the
                next client.
              </figcaption>
            </figure>
          </section>

          {/* ---------------- BOTTOM LINE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="bottom-line">The Bottom Line</H2>
              <p className={`${P} mt-7`}>
                Freelancing shouldn&apos;t mean carrying all the risk —
                chasing payment, hoping the client doesn&apos;t ghost,
                proving your credibility from scratch every time. Tech Engi
                exists to put real structure around freelance engineering
                work in India: verified matches, protected payments, and
                projects scoped clearly enough to actually finish without a
                fight.
              </p>
            </div>

            <div className="mt-16">
              <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />

                <div className="relative max-w-md">
                  <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                    If you&apos;re an engineer tired of the chaos,
                    that&apos;s exactly the gap Tech Engi was built to close.
                  </p>

                  <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/register/engineer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                    >
                      Join as Builder
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/register/client"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                    >
                      Start a Project
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
                    <p className="mt-4 pr-10 text-[14.5px] leading-7 text-slate-600">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </article>

        {/* ------------------- SIDEBAR (right) ------------------- */}

        <aside className="order-first lg:order-none">
          <details className="rounded-2xl bg-amber-100 p-5 lg:hidden">
            <summary className="cursor-pointer text-[13px] font-semibold">
              In this article
            </summary>
            <TocList />
          </details>

          <div className="sticky top-28 hidden lg:block">
            <p className="text-[11px] font-semibold text-slate-500">
              In this article
            </p>
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

function H2({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-[24px] font-bold leading-[1.18] tracking-[-0.035em] sm:text-[31px]"
    >
      {children}
    </h2>
  );
}

function H3({
  id,
  n,
  children,
}: {
  id: string;
  n: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="flex scroll-mt-28 items-start gap-4 text-[19px] font-bold leading-[1.25] tracking-[-0.025em] sm:text-[22px]"
    >
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
          <a
            href={`#${t.id}`}
            className="text-slate-600 transition hover:text-[#1257e8]"
          >
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

function ProjectMock() {
  const milestones = [
    { label: "Milestone 1", state: "Approved · released", done: true },
    { label: "Milestone 2", state: "In review", done: false },
    { label: "Milestone 3", state: "Upcoming", done: false },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      {/* solid colour shapes behind the card */}
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">Project</p>
            <p className="mt-0.5 text-[15px] font-bold">Web platform build</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-3 py-1.5 text-[11px] font-semibold text-amber-900">
            <FileSignature size={13} />
            NDA signed
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-[#050a30] p-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-[#050a30]">
            <Lock size={17} />
          </span>
          <div>
            <p className="text-[13px] font-semibold">Payment held in escrow</p>
            <p className="mt-0.5 text-[11px] text-white/60">
              Released at each approved milestone
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {milestones.map((m) => (
            <li key={m.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    m.done
                      ? "bg-[#1257e8] text-white"
                      : "border border-slate-300 text-transparent"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-[13px] font-semibold">{m.label}</span>
              </div>
              <span className="text-[11px] text-slate-500">{m.state}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute -left-4 top-28 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <BadgeCheck size={15} className="text-[#1257e8]" />
        Verified engineer
      </div>
      <div className="absolute -right-3 bottom-12 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <ShieldCheck size={15} className="text-amber-600" />
        Payment protected
      </div>
    </div>
  );
}

function EscrowFlow() {
  const steps = [
    { icon: FileSignature, title: "NDA signed", text: "Every project starts here" },
    { icon: Wallet, title: "Escrow funded", text: "Money held safely" },
    { icon: Flag, title: "Milestone delivered", text: "Work is submitted" },
    { icon: ShieldCheck, title: "Approved & released", text: "Paid on approval" },
  ];

  return (
    <ol className="relative grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-amber-400 sm:block"
      />
      {steps.map(({ icon: Icon, title, text }, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={title}
            className="relative flex items-center gap-4 sm:flex-col sm:gap-4 sm:text-center"
          >
            <span
              className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
                last
                  ? "bg-amber-500 text-[#050a30]"
                  : "bg-[#1257e8] text-white"
              }`}
            >
              <Icon size={21} />
            </span>
            <div>
              <p className="text-[14px] font-bold leading-5">{title}</p>
              <p className="mt-1 text-[12.5px] leading-5 text-slate-500">
                {text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function VerifyCard({
  tone,
  icon: Icon,
  title,
  line,
}: {
  tone: "blue" | "amber";
  icon: React.ElementType;
  title: string;
  line: string;
}) {
  const isBlue = tone === "blue";
  return (
    <div
      className={`rounded-[24px] p-7 sm:p-8 ${
        isBlue ? "bg-[#e6eeff]" : "bg-amber-100"
      }`}
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white">
        <Icon size={21} className={isBlue ? "text-[#1257e8]" : "text-amber-600"} />
        <BadgeCheck
          size={20}
          className={`absolute -bottom-1 -right-1 rounded-full bg-white ${
            isBlue ? "text-[#1257e8]" : "text-amber-600"
          }`}
        />
      </span>
      <p className="mt-7 text-[17px] font-bold">{title}</p>
      <p className="mt-2.5 text-[14px] leading-6 text-slate-700">{line}</p>
    </div>
  );
}

function LayerCard({
  tone,
  tag,
  name,
  text,
  dots,
}: {
  tone: "white" | "blue" | "navy";
  tag: string;
  name: string;
  text: string;
  dots: number;
}) {
  const navy = tone === "navy";
  const box =
    tone === "white"
      ? "border border-slate-200 bg-white"
      : tone === "blue"
        ? "bg-[#e6eeff]"
        : "bg-[#050a30] text-white";

  return (
    <div className={`flex flex-col rounded-[24px] p-7 ${box}`}>
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
            navy ? "text-amber-500" : "text-[#1257e8]"
          }`}
        >
          <Layers size={15} />
          {tag}
        </span>

        <span aria-hidden="true" className="grid w-[48px] grid-cols-3 gap-1.5">
          {Array.from({ length: dots }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full ${
                navy ? "bg-amber-500" : "bg-[#1257e8]"
              }`}
            />
          ))}
        </span>
      </div>

      <h4 className="mt-9 text-[17px] font-bold">{name}</h4>
      <p
        className={`mt-2.5 text-[13.5px] leading-6 ${
          navy ? "text-white/70" : "text-slate-600"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function LeadCompare() {
  const rows = ["Defined scope", "Milestones", "Payment structure"];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
        <p className="text-[13px] font-semibold text-slate-400">
          Cold-pitched post
        </p>
        <ul className="mt-7 space-y-4">
          {rows.map((t) => (
            <li key={t} className="flex items-center gap-3.5 text-[14px] text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-400">
                <X size={13} strokeWidth={3} />
              </span>
              {t}: not specified
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[24px] bg-[#1257e8] p-7 text-white shadow-[0_20px_50px_rgba(18,87,232,0.22)] sm:p-8">
        <p className="text-[13px] font-semibold text-amber-300">
          Project on Tech Engi
        </p>
        <ul className="mt-7 space-y-4">
          {rows.map((t) => (
            <li key={t} className="flex items-center gap-3.5 text-[14px] font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                <Check size={13} strokeWidth={3} />
              </span>
              {t}: built in before you say yes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PortfolioMock() {
  return (
    <div className="grid items-stretch gap-5 md:grid-cols-[1fr_1.3fr]">
      <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
        <p className="text-[13px] font-semibold text-slate-400">
          Certificates &amp; one-off gigs
        </p>
        <p className="mt-5 text-[14px] leading-6 text-slate-500">
          Hard for the next client to verify. Easy to ignore.
        </p>
      </div>

      <div className="rounded-[24px] bg-amber-100 p-7 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12.5px] text-amber-900/70">
              Delivered via Tech Engi
            </p>
            <p className="mt-1 text-[17px] font-bold">Showcase-ready project</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1257e8] px-3 py-1.5 text-[11px] font-semibold text-white">
            <BadgeCheck size={13} />
            Verified
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {["Delivered work", "Milestones approved", "Point clients here"].map(
            (t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-slate-700"
              >
                <Award size={13} className="text-amber-600" />
                {t}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}