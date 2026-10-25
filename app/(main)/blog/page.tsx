import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  Check,
  FileSignature,
  Flag,
  Lock,
  Newspaper,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import Header from "@/components/saas/Header";
import Footer from "@/components/saas/Footer";
import CtaSection from "@/components/saas/CtaSection";
import { figtree } from "@/components/saas/fonts";

import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY, type SanityPost } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import BlogListing, { type BlogPostItem } from "./BlogListing";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/page.tsx
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
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
   STATIC BLOG DATA (Preserved & Categorized)
=============================================================== */

type Post = BlogPostItem;

const staticPosts: Post[] = [
  {
    title: "How Much Does It Cost to Hire a Developer or Fix a Bug in India? (2026)",
    description:
      "Freelance developer rates in India by experience, what a full-time engineer costs per day, platform fees, what drives bug-fix cost, and Tech Engi's ₹3,480 co-worker day.",
    href: "/blog/cost-to-hire-developer-fix-bug-india",
    date: "2026-10-24",
    dateLabel: "24 October 2026",
    readTime: "7 min read",
    category: "Hiring & Costs",
    visual: <CostCover />,
  },
  {
    title: "My Developer Left and the Project Is Unfinished: How to Get It Finished",
    description:
      "Your developer disappeared mid-project. What to secure in the first 48 hours, how to judge finish vs rebuild, what to hand the next engineer, and how to find someone to finish it in India.",
    href: "/blog/developer-left-unfinished-project",
    date: "2026-10-23",
    dateLabel: "23 October 2026",
    readTime: "7 min read",
    category: "Freelance Safety",
    visual: <UnfinishedCover />,
  },
  {
    title: "How to Fix Your Code Without AI: A Human Debugging Method That Actually Works",
    description:
      "No ChatGPT, no Copilot. A 9-step human debugging method, the right tools for Python, JavaScript, React, Node, SQL and embedded, and when to call a human expert.",
    href: "/blog/how-to-fix-code-without-ai",
    date: "2026-10-22",
    dateLabel: "22 October 2026",
    readTime: "8 min read",
    category: "Bug Fixing",
    visual: <HumanDebugCover />,
  },
  {
    title: "₹3,480 for a Co-Worker Who Clears Your Task List: Hire a Verified Engineer for a Day",
    description:
      "Overloaded, behind on a sprint, or no tech team? Book a verified Tech Engi engineer as your co-worker for a full day at ₹3,480. What you get, the maths, and how it works.",
    href: "/blog/hire-coworker-for-a-day-3480",
    date: "2026-10-21",
    dateLabel: "21 October 2026",
    readTime: "6 min read",
    category: "Hiring & Costs",
    visual: <CoworkerCover />,
  },
  {
    title: "My Code Is Not Working: How to Fix It, Who Can Fix It, and How Soon",
    description:
      "Code broken and deadline close? What to try first, whether ChatGPT can fix it, who to ask, how fast a bug can be fixed, and how to share code safely.",
    href: "/blog/who-can-fix-my-code-how-soon",
    date: "2026-10-19",
    dateLabel: "19 October 2026",
    readTime: "9 min read",
    category: "Bug Fixing",
    visual: <FixCodeCover />,
  },
  {
    title: "The 14 Bugs That Break Code Every Day (And Why Even Senior Engineers Get Stuck)",
    description:
      "From undefined errors to race conditions and legacy code: the bugs that stall students and senior engineers alike, and when to call a human expert.",
    href: "/blog/common-coding-bugs-why-hard-to-fix",
    date: "2026-10-18",
    dateLabel: "18 October 2026",
    readTime: "8 min read",
    category: "Bug Fixing",
    visual: <BugsCover />,
  },
  {
    title: "Indian IT Is Breaking Its Own People — Then Blaming AI For the Layoffs",
    description:
      "Unpaid overtime, understaffed teams, bugs that cost companies millions, and layoffs blamed on AI that was never the real reason. Here's what's actually happening inside Indian IT in 2026.",
    href: "/blog/indian-it-burnout-overtime-bugs-ai-layoffs-2026",
    date: "2026-10-17",
    dateLabel: "17 October 2026",
    readTime: "7 min read",
    category: "IT & Career",
    visual: <BurnoutCover />,
  },
  {
    title: "How to Avoid Scammer or Cheating Freelancers (Before They Cost You)",
    description:
      "Freelance scams follow a predictable shape. Learn the red flags, the common scam patterns, and the protections that keep your money safe before you ever pay.",
    href: "/blog/how-to-avoid-scammer-freelancers",
    date: "2026-10-08",
    dateLabel: "8 October 2026",
    readTime: "5 min read",
    category: "Freelance Safety",
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
    category: "Freelance Safety",
    visual: <StructureCover />,
  },
];

/* ===============================================================
   FALLBACK VISUAL FOR SANITY POSTS (Platform SaaS Theme)
=============================================================== */

function SanityDefaultCover({
  title,
  categories,
}: {
  title: string;
  categories?: { title: string; slug: string }[];
}) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between rounded-2xl bg-gradient-to-br from-saas-nav via-[#1e2a52] to-saas-accent p-6 text-white shadow-inner">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md">
          <Newspaper size={18} />
        </span>
        {categories && categories[0] && (
          <span className="rounded-full bg-saas-accent px-3 py-1 text-[11px] font-semibold text-white">
            {categories[0].title}
          </span>
        )}
      </div>
      <div>
        <p className="line-clamp-2 text-[15px] font-bold leading-snug text-white">
          {title}
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/75">
          <Sparkles size={11} className="text-amber-300" />
          Tech Engi Engineering
        </span>
      </div>
    </div>
  );
}

/* ===============================================================
   PAGE COMPONENT
=============================================================== */

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogIndexPage() {
  // Fetch dynamic posts from Sanity (with graceful fallback if not yet configured)
  const sanityPosts = await sanityFetch<SanityPost[]>({
    query: POSTS_QUERY,
    fallback: [],
  });

  const dynamicPosts: Post[] = (sanityPosts || []).map((sp) => {
    const formattedDate = sp.publishedAt
      ? new Date(sp.publishedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Recently published";

    const imageUrl = sp.mainImage
      ? urlForImage(sp.mainImage)?.width(800).height(500).fit("crop").url()
      : null;

    const categoryTitle =
      sp.categories && sp.categories[0]
        ? sp.categories[0].title
        : "Engineering";

    const cleanSlug = (sp.slug || "")
      .toLowerCase()
      .trim()
      .replace(/^\/?(blog\/)?/i, "")
      .replace(/\/+$/, "")
      .replace(/\s+/g, "-");

    return {
      title: sp.title,
      description: sp.description,
      href: `/blog/${cleanSlug}`,
      date: sp.publishedAt || new Date().toISOString(),
      dateLabel: formattedDate,
      readTime: sp.readTime || "5 min read",
      category: categoryTitle,
      visual: imageUrl ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={sp.mainImage?.alt || sp.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      ) : cleanSlug === "developer-left-unfinished-project" ? (
        <UnfinishedCover />
      ) : (
        <SanityDefaultCover title={sp.title} categories={sp.categories} />
      ),
    };
  });

  // Combine dynamic Sanity posts with existing static posts, newest first
  const combinedPosts = [
    ...dynamicPosts,
    ...staticPosts.filter(
      (p) => !dynamicPosts.some((dp) => dp.href === p.href)
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: META_TITLE,
    description: META_DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: combinedPosts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${p.href}`,
        name: p.title,
      })),
    },
  };

  return (
    <div className={`saas-root ${figtree.variable} min-h-screen bg-saas-bg w-full overflow-x-clip`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Global SaaS Header */}
      <Header />

      <main className="w-full">
        {/* ====================== HERO SECTION ====================== */}
        <section className="relative dot-grid pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="section-glow" />

          <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-saas-mut">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-saas-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-saas-line">/</li>
                <li aria-current="page" className="font-semibold text-saas-ink">
                  Blog
                </li>
              </ol>
            </nav>

            <div className="mt-6 flex flex-col items-start max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-saas-line bg-white/80 px-4 py-1.5 text-xs font-semibold text-saas-accent shadow-sm backdrop-blur-md">
                <Sparkles size={13} className="text-saas-accent" />
                <span>Tech Engi Knowledge Hub</span>
              </span>

              <h1 className="mt-5 text-balance text-[clamp(2.1rem,5vw,3.5rem)] font-bold tracking-tight text-saas-ink leading-[1.08]">
                Engineering Guides, Safety &{" "}
                <span className="bg-gradient-to-r from-saas-accent to-[#7052ff] bg-clip-text text-transparent">
                  Freelance Insights
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-saas-tx max-w-2xl">
                Practical breakdowns, bug-fixing methods, freelance safety benchmarks, and verified engineering talent economics for founders, teams, and developers.
              </p>
            </div>
          </div>
        </section>

        {/* ====================== INTERACTIVE BLOG LISTING ====================== */}
        <section className="pt-2 pb-24">
          <BlogListing posts={combinedPosts} />
        </section>

        {/* ====================== CTA SECTION ====================== */}
        <CtaSection />
      </main>

      {/* Global SaaS Footer */}
      <Footer />
    </div>
  );
}

/* ===============================================================
   REDESIGNED COVER VISUALS (Unified with Platform SaaS Palette)
=============================================================== */

function CostCover() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Cost per working day</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-saas-icon-bg px-2.5 py-0.5 text-[10px] font-semibold text-saas-accent">
          India, 2026
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        <li>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-saas-tx">₹12 LPA engineer</span>
            <span className="text-rose-600 font-bold">~₹4,800</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-saas-bg">
            <span className="block h-full w-full rounded-full bg-rose-400" />
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-saas-tx">Tech Engi co-worker</span>
            <span className="text-saas-accent font-bold">₹3,480</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-saas-bg">
            <span className="block h-full rounded-full bg-saas-accent" style={{ width: "72.5%" }} />
          </div>
        </li>
      </ul>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saas-accent text-white">
          <BadgeCheck size={14} />
        </span>
        <p className="text-[11px] font-semibold">₹3,480 fixed per day</p>
      </div>
    </div>
  );
}

function UnfinishedCover() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Project handover</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          First 48h
        </span>
      </div>
      <ul className="mt-3.5 space-y-2">
        <li className="flex items-center justify-between rounded-xl bg-saas-bg px-3 py-2 text-[11.5px] font-semibold text-saas-ink">
          <span>Git repository</span>
          <Check size={13} className="text-emerald-600" />
        </li>
        <li className="flex items-center justify-between rounded-xl bg-saas-bg px-3 py-2 text-[11.5px] font-semibold text-saas-ink">
          <span>Cloud & Database</span>
          <Check size={13} className="text-emerald-600" />
        </li>
      </ul>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saas-accent text-white">
          <Lock size={14} />
        </span>
        <p className="text-[11px] font-semibold">Takeover without rewrite</p>
      </div>
    </div>
  );
}

function HumanDebugCover() {
  const steps = ["1. Reproduce", "2. Isolate cause", "3. Verified fix"];
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Human debugging</p>
        <span className="rounded-full bg-saas-icon-bg px-2.5 py-0.5 text-[10px] font-semibold text-saas-accent">
          9-step system
        </span>
      </div>
      <div className="mt-3.5 space-y-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2.5 rounded-xl bg-saas-bg px-3 py-2 text-[11.5px] font-medium text-saas-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-saas-icon-bg text-[10px] font-bold text-saas-accent">
              {i + 1}
            </span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <Check size={14} />
        </span>
        <p className="text-[11px] font-semibold">Deterministic resolution</p>
      </div>
    </div>
  );
}

function CoworkerCover() {
  const items = [
    "Full 8-hour workday",
    "Direct communication",
    "NDA & verified skills",
  ];
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Co-Worker Day</p>
        <span className="rounded-full bg-saas-icon-bg px-2.5 py-0.5 text-[10px] font-bold text-saas-accent">
          ₹3,480 / day
        </span>
      </div>
      <ul className="mt-3.5 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[11.5px] font-semibold text-saas-tx">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-saas-accent text-white">
              <Check size={10} strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saas-accent text-white">
          <Sparkles size={14} />
        </span>
        <p className="text-[11px] font-semibold">Immediate sprint boost</p>
      </div>
    </div>
  );
}

function FixCodeCover() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-saas-nav p-5 text-white shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="font-mono text-[11px] text-saas-accent">debug.status</span>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          LIVE
        </span>
      </div>
      <div className="mt-3 font-mono text-[11.5px] text-slate-300 space-y-1.5">
        <p className="text-rose-400">✗ Uncaught TypeError</p>
        <p className="text-emerald-400">✓ Stack trace isolated</p>
        <p className="text-emerald-400">✓ Patch verified in staging</p>
      </div>
      <div className="mt-3.5 rounded-xl bg-white/10 p-2.5 text-center text-[11px] font-medium text-white">
        Fast turnarounds & escrow safety
      </div>
    </div>
  );
}

function BugsCover() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Common Bugs</p>
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
          14 Top Culprits
        </span>
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] font-semibold">
        <div className="rounded-xl bg-saas-bg p-2 text-saas-ink">Race Conditions</div>
        <div className="rounded-xl bg-saas-bg p-2 text-saas-ink">Null Pointer</div>
        <div className="rounded-xl bg-saas-bg p-2 text-saas-ink">Memory Leak</div>
        <div className="rounded-xl bg-saas-bg p-2 text-saas-ink">CORS Errors</div>
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saas-accent text-white">
          <Check size={14} />
        </span>
        <p className="text-[11px] font-semibold">Diagnosed by specialists</p>
      </div>
    </div>
  );
}

function BurnoutCover() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Work hours vs law</p>
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700">
          <Flag size={10} className="inline mr-1" />
          Unpaid
        </span>
      </div>
      <div className="mt-3.5 space-y-3">
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-saas-tx">
            <span>Reported workday</span>
            <span className="text-rose-600 font-bold">16 hrs</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-saas-bg overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full w-full" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-saas-tx">
            <span>Legal overtime cap</span>
            <span className="text-saas-accent font-bold">6 hrs/wk</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-saas-bg overflow-hidden">
            <div className="h-full bg-saas-accent rounded-full" style={{ width: "25%" }} />
          </div>
        </div>
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-saas-nav">
          <TrendingDown size={14} />
        </span>
        <p className="text-[11px] font-semibold">Sustainable dev practices</p>
      </div>
    </div>
  );
}

function ScamCover() {
  const flags = ["100% upfront required", "Move to WhatsApp", "No repo access"];
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Red Flags</p>
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700">
          3 Common Traps
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {flags.map((flag) => (
          <li key={flag} className="flex items-center justify-between rounded-xl bg-rose-50/70 px-3 py-1.5 text-[11px] font-medium text-rose-700">
            <span>{flag}</span>
            <ShieldAlert size={12} />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saas-accent text-white">
          <Lock size={14} />
        </span>
        <p className="text-[11px] font-semibold">Tech Engi escrow protects both</p>
      </div>
    </div>
  );
}

function StructureCover() {
  const milestones = [
    { name: "Milestone 1: Prototype", done: true },
    { name: "Milestone 2: Core API", done: true },
    { name: "Milestone 3: Production", done: false },
  ];
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-saas-line/80 bg-white p-5 shadow-saas-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-saas-ink">Milestone Escrow</p>
        <span className="rounded-full bg-saas-icon-bg px-2.5 py-0.5 text-[10px] font-semibold text-saas-accent">
          <FileSignature size={10} className="inline mr-1" />
          NDA Active
        </span>
      </div>
      <ul className="mt-3.5 space-y-2">
        {milestones.map((m) => (
          <li key={m.name} className="flex items-center gap-2 text-[11.5px] font-medium text-saas-ink">
            <span
              className={`grid h-4 w-4 place-items-center rounded-full ${
                m.done ? "bg-saas-accent text-white" : "border border-saas-line text-transparent"
              }`}
            >
              <Check size={9} strokeWidth={3} />
            </span>
            <span>{m.name}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-saas-nav p-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <Lock size={14} />
        </span>
        <p className="text-[11px] font-semibold">Funds released on approval</p>
      </div>
    </div>
  );
}