import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  FileSignature,
  Flag,
  Lock,
  ShieldAlert,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/page.tsx
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.tsquarey.tech";
const PATH = "/blog";

const META_TITLE = "Tech Engi Blog: Freelance Safety, Hiring and Engineering";
const META_DESCRIPTION =
  "Guides for clients and freelance engineers in India: spot scammer freelancers, get paid on time, and run projects with NDAs, escrow and milestones.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PATH,
    siteName: "Tech Engi",
    locale: "en_IN",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

/* ===============================================================
   BLOG DATA (static for now)
   The FIRST item becomes the top banner. Newest first.
   `visual` is the HTML/Tailwind-coded cover image.
=============================================================== */

type Post = {
  title: string;
  description: string;
  href: string;
  date: string; // ISO
  dateLabel: string;
  readTime: string;
  visual: ReactNode;
};

const posts: Post[] = [
  {
    title: "How to Avoid Scammer or Cheating Freelancers (Before They Cost You)",
    description:
      "Freelance scams follow a predictable shape. Learn the red flags, the common scam patterns, and the protections that keep your money safe before you ever pay.",
    href: "/blog/how-to-avoid-scammer-freelancers",
    date: "2026-10-08",
    dateLabel: "8 October 2026",
    readTime: "5 min read",
    visual: <ScamCover />,
  },
  {
    title: "How Tech Engi Helps Freelance Engineers Finish Work Without the Usual Chaos",
    description:
      "Ghosted clients, scope creep and late payments aren't a coding problem. They're a structure problem, and structure is fixable.",
    href: "/blog/freelance-engineering-without-issues",
    date: "2026-10-06",
    dateLabel: "6 October 2026",
    readTime: "5 min read",
    visual: <StructureCover />,
  },
];

/* ===============================================================
   STRUCTURED DATA
=============================================================== */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: META_TITLE,
  description: META_DESCRIPTION,
  url: `${SITE_URL}${PATH}`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${p.href}`,
      name: p.title,
    })),
  },
};

/* ===============================================================
   PAGE
=============================================================== */

export default function BlogIndexPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="bg-white text-[#050a30]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ====================== TOP BANNER (post #1) ====================== */}

      <header className="relative overflow-hidden bg-[#fff3d6]">
        <div className="pointer-events-none absolute -left-32 top-48 h-72 w-72 rounded-full bg-[#1257e8]/[0.06]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20">
          <nav aria-label="Breadcrumb" className="text-[13px] text-slate-600">
            <ol className="flex items-center gap-2.5">
              <li>
                <Link href="/" className="transition hover:text-[#1257e8]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#050a30]">
                Blog
              </li>
            </ol>
          </nav>

          <h1 className="mt-9 text-[30px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[40px]">
            The Tech Engi{" "}
            <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
              Blog
            </span>
          </h1>

          <Link
            href={featured.href}
            className="group mt-12 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20"
          >
            <div>
              <span className="inline-flex rounded-full bg-amber-500 px-3.5 py-1.5 text-[12px] font-bold text-[#050a30]">
                Latest
              </span>
              <h2 className="mt-6 text-[26px] font-bold leading-[1.15] tracking-[-0.035em] transition group-hover:text-[#1257e8] sm:text-[34px]">
                {featured.title}
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-7 text-slate-700">
                {featured.description}
              </p>
              <Meta post={featured} className="mt-8" />
              <span className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#1257e8] px-6 py-3 text-[13px] font-bold text-white transition group-hover:-translate-y-0.5 group-hover:shadow-xl">
                Read the article
                <ArrowRight size={16} />
              </span>
            </div>

            <div className="relative">
              <div className="absolute -right-4 -top-4 h-full w-full rounded-[32px] bg-amber-300/80" />
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] bg-[#e6eeff] p-6">
                {featured.visual}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* ====================== CARDS GRID ====================== */}

      <section
        aria-labelledby="all-posts"
        className="mx-auto w-full max-w-6xl px-6 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28"
      >
        <h2
          id="all-posts"
          className="text-[24px] font-bold leading-[1.18] tracking-[-0.035em] sm:text-[31px]"
        >
          More articles
        </h2>

        {rest.length === 0 ? (
          <p className="mt-10 text-[16px] leading-7 text-slate-600">
            More articles are on the way.
          </p>
        ) : (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.href}>
                <Link
                  href={post.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,10,48,0.10)]"
                >
                  <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-amber-100 p-5">
                    {post.visual}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[19px] font-bold leading-[1.25] tracking-[-0.025em] transition group-hover:text-[#1257e8]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-7 text-slate-600">
                      {post.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-7">
                      <Meta post={post} />
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-amber-800 transition group-hover:bg-[#1257e8] group-hover:text-white">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

/* ===============================================================
   SMALL PIECES
=============================================================== */

function Meta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-slate-500 ${className}`}>
      <time dateTime={post.date}>{post.dateLabel}</time>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 size={13} />
        {post.readTime}
      </span>
    </div>
  );
}

/* ===============================================================
   COVER VISUALS (pure HTML/Tailwind, no image files)
=============================================================== */

function ScamCover() {
  const rows = ["100% upfront", "Pay today", "Move to WhatsApp"];
  return (
    <div className="w-full max-w-[300px] rounded-[22px] bg-white p-5 shadow-[0_20px_50px_rgba(5,10,48,0.12)]" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold">Freelancer proposal</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-700">
          <Flag size={11} />3 red flags
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r} className="flex items-center justify-between rounded-xl bg-red-50 px-3.5 py-2.5 text-[12px] font-semibold text-red-700">
            {r}
            <ShieldAlert size={13} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#050a30] p-3 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-[#050a30]">
          <Lock size={14} />
        </span>
        <p className="text-[11.5px] font-semibold">Safer: escrow + milestones</p>
      </div>
    </div>
  );
}

function StructureCover() {
  const ms = [
    { t: "Milestone 1", done: true },
    { t: "Milestone 2", done: false },
    { t: "Milestone 3", done: false },
  ];
  return (
    <div className="w-full max-w-[300px] rounded-[22px] bg-white p-5 shadow-[0_20px_50px_rgba(5,10,48,0.12)]" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold">Web platform build</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-semibold text-amber-900">
          <FileSignature size={11} />
          NDA signed
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#050a30] p-3 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-[#050a30]">
          <Lock size={14} />
        </span>
        <p className="text-[11.5px] font-semibold">Payment held in escrow</p>
      </div>
      <ul className="mt-4 space-y-2.5">
        {ms.map((m) => (
          <li key={m.t} className="flex items-center gap-2.5 text-[12px] font-semibold">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                m.done ? "bg-[#1257e8] text-white" : "border border-slate-300 text-transparent"
              }`}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            {m.t}
          </li>
        ))}
      </ul>
    </div>
  );
}