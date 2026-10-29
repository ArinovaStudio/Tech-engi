import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  Clock3,
  Coffee,
  Cpu,
  FileSignature,
  GitCommit,
  GraduationCap,
  Lock,
  Megaphone,
  MessageCircle,
  Repeat,
  Scissors,
  ScrollText,
  Search,
  ShieldCheck,
  Undo2,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/who-can-fix-my-code-how-soon/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "who-can-fix-my-code-how-soon";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "My Code Is Not Working: How to Fix It, Who Can Fix It, and How Soon";
const META_TITLE = "Who Can Fix My Code? How to Fix a Bug Fast in India | Tech Engi";
const META_DESCRIPTION =
  "Code broken and deadline close? What to try first, whether ChatGPT can fix it, who to ask, how fast a bug can be fixed, and how to share code safely.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-10-23";
const MODIFIED = "2026-10-23";
const PUBLISHED_LABEL = "23 October 2026";
const READ_TIME = "9 min read";

const KEYWORDS = [
  "who can fix my code",
  "my code is not working",
  "how to fix a bug",
  "can ChatGPT fix my code",
  "pay someone to fix my code",
  "hire developer to fix bug India",
  "how long does it take to fix a bug",
  "is it safe to share code with a freelancer",
  "production down what to do",
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
  { id: "first", label: "What to do first" },
  { id: "chatgpt", label: "Can ChatGPT fix it?" },
  { id: "who", label: "Who can fix my code?" },
  { id: "soon", label: "How soon?" },
  { id: "cost", label: "How much?" },
  { id: "production", label: "Production is down" },
  { id: "safe", label: "Is it safe to share?" },
  { id: "template", label: "Bug report template" },
  { id: "faq", label: "FAQ" },
];

const steps = [
  { icon: BookOpen, t: "**Read the full error message.** Not the first line, the whole thing. The file name and line number are usually in there." },
  { icon: Repeat, t: "**Reproduce it.** Can you make it happen again, on purpose? If yes, you're halfway there." },
  { icon: GitCommit, t: "**Ask \u201Cwhat changed?\u201D** A new package, a pulled branch, a changed .env, a new deploy. Run git diff or check the last commit." },
  { icon: Search, t: "**Search the exact error**, in quotes. Thousands of people have hit it before you." },
  { icon: Scissors, t: "**Make it smaller.** Delete or comment out code until the bug disappears. The last thing you removed is the suspect." },
  { icon: MessageCircle, t: "**Explain it out loud** to a colleague, a friend or an empty chair. You'll often hear the answer yourself." },
  { icon: Coffee, t: "**Take a 15-minute break.** Tired eyes miss obvious bugs." },
];

const options = [
  { name: "A colleague or senior", good: "Quick second opinion", watch: "They're busy too" },
  { name: "Communities (Stack Overflow, Reddit r/developersIndia)", good: "Common, well-documented errors", watch: "Slow, public, no guarantee" },
  { name: "AI assistants", good: "Simple errors, explanations", watch: "\u201CAlmost right\u201D fixes, no context" },
  { name: "Bidding platforms", good: "Larger projects", watch: "Proposals to sort, unclear who you're hiring" },
  { name: "Agencies", good: "Big builds", watch: "Expensive and slow for one bug" },
  { name: "Tech Engi", good: "Bugs that block you now", watch: "Needs a clear bug description (template below)", hero: true },
];

const giveEngineer = [
  "The exact error message and screenshot",
  "The steps to reproduce it",
  "What you expected versus what happened",
  "Your tech stack and versions",
  "What changed recently",
  "Access to a test or staging environment, not production",
];

const safe = [
  { icon: BadgeCheck, lead: "Work with verified people", t: "Every Tech Engi engineer submits Aadhaar, PAN and proof of experience before taking work." },
  { icon: FileSignature, lead: "Sign an NDA", t: "before sharing anything sensitive." },
  { icon: Lock, lead: "Share the minimum", t: "A staging environment or one repo, never production passwords or customer data." },
  { icon: Wallet, lead: "Pay through escrow", t: "so money only moves when work is delivered." },
];

const template = [
  'Title: [Short description] e.g. "Login fails with 500 error after deploy"',
  "Stack: [e.g. MERN — React 18, Node 20, MongoDB 7]",
  "What happens: [exact error message + screenshot]",
  "What should happen: [expected behaviour]",
  "Steps to reproduce: 1. ... 2. ... 3. ...",
  "What changed recently: [new package, deploy, config change]",
  "Access I can give: [staging URL / repo / test account]",
  "Deadline: [e.g. before 6 PM today]",
  "Budget: [₹ amount]",
];

const faqs = [
  { q: "Who can fix my code in India?", a: "A colleague, an online community, an AI assistant for simple errors, or a verified engineer through Tech Engi (techengi.in), where an AI matches your bug to a human expert by tech stack, skills and budget." },
  { q: "Can I pay someone to fix my code?", a: "Yes. On Tech Engi you post the bug, set your budget, pay 25% upfront to confirm, and a verified engineer is matched to fix it. Payment is released through escrow by milestone." },
  { q: "How long does it take to fix a bug?", a: "Simple bugs can take minutes; intermittent or legacy bugs can take days. The biggest factor is how quickly the bug can be reproduced, so share clear steps, the exact error and a test environment." },
  { q: "Can ChatGPT fix my code?", a: "For simple, common errors, often yes. For bugs that depend on your system, data or legacy code, AI is frequently \u201Calmost right\u201D — 66% of developers in Stack Overflow's 2025 survey named this their top frustration." },
  { q: "Is it safe to share code with a freelancer?", a: "Yes, if you work with verified engineers, sign an NDA, share only a test environment, and pay through escrow. Employees should get their company's approval before sharing company code." },
  { q: "What should I do if production is down?", a: "Roll back to the last working version if possible, tell users, check recent deploys and logs, and bring in an experienced engineer immediately." },
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

export default function WhoCanFixMyCodePage() {
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
              My Code Is Not Working: How to Fix It, Who Can Fix It, and{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                How Soon
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Code broken and deadline close? What to try first, who to ask,
              and how to share code safely.
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
            <HeroMock />
            <figcaption className="sr-only">
              A failing login bug on one side, and the same bug matched to a
              verified engineer with live progress on the other.
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
              <Rich t="First, read the exact error, reproduce it, and check what changed last. That fixes most bugs. If you're still stuck, ask a colleague or a community, try an AI assistant for simple errors, and for anything blocking a release, a client or production, get an experienced human engineer. On **Tech Engi**, you post the bug, pay 25% upfront to confirm, and an AI matches you to a verified engineer who fixes it while you track progress live. **AI matches. Humans fix.**" />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your bug to a verified engineer by tech stack, skills and budget, and an experienced human engineer fixes it." />
            </p>
          </aside>

          {/* ---------------- FIRST ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="first">My code is not working. What should I do first?</H2>
              <Para t="Do these seven things, in this order, before anything else:" />
            </div>

            <ol className="mt-12 space-y-4">
              {steps.map(({ icon: Icon, t }, i) => (
                <li key={i} className="flex items-start gap-5 rounded-[22px] bg-slate-50 p-5 sm:p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-[#050a30]">
                    {i + 1}
                  </span>
                  <p className="flex-1 pt-1.5 text-[14.5px] leading-7 text-slate-700">
                    <Rich t={t} />
                  </p>
                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1257e8] sm:flex">
                    <Icon size={18} />
                  </span>
                </li>
              ))}
            </ol>

            <div className={TEXT}>
              <p className={`${P} mt-8`}>
                If that hasn&apos;t worked in an hour or two, it&apos;s time to
                get help. (See{" "}
                <Link href="/blog/common-coding-bugs-why-hard-to-fix" className="font-semibold text-[#1257e8] underline">
                  the 14 bug families
                </Link>{" "}
                to judge how hard yours is.)
              </p>
            </div>
          </section>

          {/* ---------------- CHATGPT ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="chatgpt">Can ChatGPT fix my code?</H2>
              <Para t="**Sometimes, for simple and well-known errors.** AI assistants like ChatGPT, Copilot, Gemini and Claude are good at explaining error messages and fixing common mistakes." />
              <Para t="They struggle with bugs that depend on your system: your data, your servers, your environment, your legacy code. In Stack Overflow's 2025 Developer Survey, **66% of developers said their biggest frustration was AI solutions that are \u201Calmost right, but not quite\u201D**, and **45% said debugging AI-generated code takes more time**." />
            </div>

            <figure className="mt-12">
              <SurveyBars />
              <figcaption className="sr-only">
                Stack Overflow 2025: 66% frustrated by almost-right AI answers; 45% say debugging AI code takes more time.
              </figcaption>
            </figure>

            <figure className="mt-5">
              <Versus
                goodFirst
                goodTitle="AI is good at"
                good={["Explaining error messages", "Fixing common mistakes"]}
                badTitle="AI struggles with"
                bad={["Your data and your servers", "Your environment and legacy code"]}
              />
            </figure>

            <div className={TEXT}>
              <Para t="Use AI for a first look. When the bug is costing you money, time or sleep, get a human who can see the whole picture." />
            </div>
          </section>

          {/* ---------------- WHO ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="who">Who can fix my code?</H2>
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

            <div className={TEXT}>
              <Para t="**Why Tech Engi:** you don't sort through proposals. You post the bug once, and an AI matches it to a verified engineer whose stack and experience fit. A human engineer does the fix. Your money sits in escrow until the work is done." />
            </div>

            <figure className="mt-12">
              <Flow
                steps={[
                  { icon: ArrowRight, title: "Post the bug once", text: "No proposals to sort" },
                  { icon: Cpu, title: "AI matches", text: "Stack, skills, experience" },
                  { icon: UserCheck, title: "Human fixes", text: "A verified engineer" },
                  { icon: Wallet, title: "Escrow releases", text: "When the work is done" },
                ]}
              />
            </figure>
          </section>

          {/* ---------------- SOON ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="soon">How soon can my bug be fixed?</H2>
              <Para t="**It depends less on the bug and more on how quickly someone can reproduce it.** A clear bug report with access to a test environment can be fixed in a fraction of the time of a vague \u201Cit's not working\u201D." />
              <Para t="On Tech Engi, matching starts as soon as you confirm the project with the 25% upfront payment, and you can follow progress live on your dashboard." />
            </div>

            <figure className="mt-12">
              <Versus
                badTitle={"A vague \u201Cit's not working\u201D"}
                bad={["No error message", "No steps, no environment"]}
                goodTitle="A clear bug report"
                good={["Exact error and steps to reproduce", "A test environment to work in"]}
              />
            </figure>

            <div className={`${TEXT} mt-12`}>
              <p className={P}>To get your bug fixed faster, give the engineer:</p>
            </div>
            <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
              {giveEngineer.map((t) => (
                <li key={t} className="flex items-start gap-3.5 rounded-2xl bg-[#e6eeff] p-5 text-[14px] leading-6 text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1257e8] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- COST ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="cost">How much does it cost to fix a bug in India?</H2>
              <Para t="It depends on how hard the bug is and how much access the engineer needs. On Tech Engi:" />
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              <li className="rounded-[24px] bg-amber-100 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600"><Wallet size={21} /></span>
                <p className="mt-6 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="**You set your budget** when you post, and the AI matches you to an engineer who fits it." />
                </p>
              </li>
              <li className="rounded-[24px] bg-[#e6eeff] p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1257e8]"><Briefcase size={21} /></span>
                <p className="mt-6 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="**Need someone for a full day?** Book a " />
                  <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] underline">
                    verified co-worker for a day at ₹3,480
                  </Link>{" "}
                  and hand over your whole task list.
                </p>
              </li>
              <li className="rounded-[24px] bg-amber-100 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600"><ShieldCheck size={21} /></span>
                <p className="mt-6 text-[14.5px] leading-7 text-slate-700">
                  <Rich t="**You pay by milestone through escrow**, so you only release money as work is done." />
                </p>
              </li>
            </ul>
          </section>

          {/* ---------------- PRODUCTION ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="production">Production is down. What do I do right now?</H2>
            </div>

            <figure className="mt-12">
              <Flow
                alertLast
                steps={[
                  { icon: Undo2, title: "Roll back", text: "To the last working version. Fix forward later." },
                  { icon: Megaphone, title: "Tell users", text: "Status page, email, a banner" },
                  { icon: ScrollText, title: "Check logs", text: "And recent deploys. Most outages follow a change." },
                  { icon: UserCheck, title: "Get an engineer in", text: "Downtime costs more every hour" },
                ]}
              />
            </figure>

            <div className={`${TEXT} mt-10 flex items-start gap-4 rounded-[24px] bg-red-50 p-6 sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                <AlertTriangle size={19} />
              </span>
              <p className="text-[14.5px] leading-7 text-slate-700">
                Post it on Tech Engi with{" "}
                <strong className="text-red-700">&ldquo;PRODUCTION DOWN&rdquo;</strong>{" "}
                in the title, so the urgency is clear from the start.
              </p>
            </div>
          </section>

          {/* ---------------- SAFE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="safe">Is it safe to share my code with a freelancer?</H2>
              <Para t="It can be, if you set it up properly:" />
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {safe.map(({ icon: Icon, lead, t }, i) => (
                <li key={lead} className={`rounded-[24px] p-7 ${i % 3 === 0 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i % 3 === 0 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[16px] font-bold leading-6">{lead}</p>
                  <p className="mt-2.5 text-[14px] leading-6 text-slate-700">{t}</p>
                </li>
              ))}
            </ul>

            <div className={`${TEXT} mt-8 flex items-start gap-4 rounded-[24px] bg-[#050a30] p-6 text-white sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[#050a30]">
                <ShieldCheck size={19} />
              </span>
              <p className="text-[14.5px] leading-7 text-white/85">
                <Rich t="**Working in a company?** Get approval from your manager before sharing company code with anyone outside. Most employers' IP and NDA policies require it, and following them protects you." />
              </p>
            </div>

            <div className={`${TEXT} mt-5 flex items-start gap-4 rounded-[24px] bg-slate-50 p-6 sm:p-7`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1257e8]">
                <GraduationCap size={19} />
              </span>
              <div>
                <p className="text-[15px] font-bold">I&apos;m a student. Can I get help with my project?</p>
                <p className="mt-2 text-[14.5px] leading-7 text-slate-600">
                  <Rich t="Yes. If you're stuck on your own project, a verified engineer on Tech Engi can help you find the bug and **show you how it was fixed**, so you understand your project when you present it." />
                </p>
              </div>
            </div>
          </section>

          {/* ---------------- TEMPLATE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="template">Copy-paste bug report template</H2>
            </div>

            <figure className="mt-12 overflow-hidden rounded-[24px] bg-[#050a30] text-white">
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[12px] text-white/50">bug-report.txt</span>
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

            <div className={TEXT}>
              <Para t="Paste this into your Tech Engi post and the matching (and the fix) both go faster." />
            </div>
          </section>

          {/* ---------------- CTA ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
              <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
              <div className="relative max-w-md">
                <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                  Code not working and running out of time?
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
              <Link href="/blog/common-coding-bugs-why-hard-to-fix" className="font-semibold text-[#1257e8] hover:underline">
                The 14 bugs that break code every day →
              </Link>{" "}
              ·{" "}
              <Link href="/blog/hire-coworker-for-a-day-3480" className="font-semibold text-[#1257e8] hover:underline">
                Hire a co-worker for a day at ₹3,480 →
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

/* Hero: failing bug on top, matched engineer below */
function HeroMock() {
  const progress = [
    { t: "Bug posted", done: true },
    { t: "Matched to a verified engineer", done: true },
    { t: "Fix in progress", done: false },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_30px_80px_rgba(5,10,48,0.12)]">
        <div className="bg-[#050a30] p-5 font-mono text-[12px] leading-6 text-white sm:p-6">
          <p className="text-white/50">$ deploy --prod</p>
          <p className="text-red-300">500 Internal Server Error</p>
          <p className="text-white/70">Login fails after deploy</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[10.5px] font-semibold text-red-300">
            <AlertTriangle size={11} />
            Release is Friday
          </p>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold">Live progress</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-3 py-1.5 text-[11px] font-semibold text-[#1257e8]">
              <BadgeCheck size={13} />
              Verified
            </span>
          </div>
          <ul className="mt-5 space-y-3.5">
            {progress.map((p) => (
              <li key={p.t} className="flex items-center gap-3 text-[13px] font-semibold">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    p.done ? "bg-[#1257e8] text-white" : "border border-slate-300 text-transparent"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                {p.t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute -left-4 top-40 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Cpu size={15} className="text-[#1257e8]" />
        AI matches
      </div>
      <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <UserCheck size={15} className="text-amber-600" />
        Humans fix
      </div>
    </div>
  );
}

/* Stack Overflow 2025 numbers */
function SurveyBars() {
  const rows = [
    { v: 66, l: "Biggest frustration: AI solutions that are \u201Calmost right, but not quite\u201D", c: "bg-[#1257e8]" },
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

/* Generic 4-step flow */
function Flow({
  steps,
  alertLast = false,
}: {
  steps: { icon: React.ElementType; title: string; text: string }[];
  alertLast?: boolean;
}) {
  return (
    <ol className="relative grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-amber-400 sm:block"
      />
      {steps.map(({ icon: Icon, title, text }, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={title} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
            <span
              className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
                last ? (alertLast ? "bg-red-600 text-white" : "bg-amber-500 text-[#050a30]") : "bg-[#1257e8] text-white"
              }`}
            >
              <Icon size={21} />
            </span>
            <div>
              <p className="text-[14px] font-bold leading-5">{title}</p>
              <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Reusable bad-vs-good comparison */
function Versus({
  badTitle,
  bad,
  goodTitle,
  good,
  goodFirst = false,
}: {
  badTitle: string;
  bad: string[];
  goodTitle: string;
  good: string[];
  goodFirst?: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className={`rounded-[24px] bg-slate-50 p-7 sm:p-8 ${goodFirst ? "md:order-2" : ""}`}>
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