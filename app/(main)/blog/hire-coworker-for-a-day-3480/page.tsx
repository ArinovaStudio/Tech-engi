import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Bug,
  Check,
  ClipboardList,
  Clock3,
  Cpu,
  Eye,
  FileSignature,
  GraduationCap,
  Layers,
  ListChecks,
  Lock,
  Rocket,
  ShieldCheck,
  Sunset,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

/* ===============================================================
   SEO CONFIG
   Route: app/blog/hire-coworker-for-a-day-3480/page.tsx
   Theme: cream + amber + blue (matches the /blog index)
=============================================================== */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const SLUG = "hire-coworker-for-a-day-3480";
const PATH = `/blog/${SLUG}`;
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `/og/${SLUG}.png`; // add a 1200x630 image at public/og/

const H1_TITLE =
  "₹3,480 for a Co-Worker Who Clears Your Task List: Hire a Verified Engineer for a Day";
const META_TITLE = "Hire a Developer for a Day in India: ₹3,480 Co-Worker | Tech Engi";
const META_DESCRIPTION =
  "Overloaded, behind on a sprint, or no tech team? Book a verified Tech Engi engineer as your co-worker for a full day at ₹3,480. What you get, the maths, and how it works.";

const AUTHOR = "Tarun Pathak K";
const AUTHOR_ROLE = "Founder, Tech Engi";
const PUBLISHED = "2026-10-20";
const MODIFIED = "2026-10-20";
const PUBLISHED_LABEL = "20 October 2026";
const READ_TIME = "6 min read";

const KEYWORDS = [
  "hire developer for a day India",
  "co-worker for a day",
  "hire developer for one day",
  "part time developer for a day",
  "freelance developer daily rate India",
  "too much work software engineer",
  "sprint deadline help",
  "bug backlog help",
  "Tech Engi co-worker 3480",
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
  { id: "what", label: "What it is" },
  { id: "who", label: "Who it is for" },
  { id: "day", label: "A day, hour by hour" },
  { id: "maths", label: "The maths" },
  { id: "safe", label: "Is it safe?" },
  { id: "book", label: "How to book" },
  { id: "engineers", label: "For engineers" },
  { id: "faq", label: "FAQ" },
];

const whatItems = [
  { icon: ListChecks, t: "You agree the task list and working hours before the day starts." },
  { icon: Wrench, t: "They work through it with you: bugs, features, tests, deployment, cleanup." },
  { icon: Eye, t: "You stay in control: you review the work and decide what ships." },
];

const who = [
  { icon: Briefcase, role: "A corporate developer", day: "Sprint ends tomorrow, three tickets open", hand: "The bug fixes and test cases" },
  { icon: Users, role: "A team lead or manager", day: "Backlog growing, team at full capacity", hand: "The small tickets nobody has time for" },
  { icon: Bug, role: "A QA tester", day: "Release candidate, regression suite not done", hand: "Writing and running the test cases" },
  { icon: Rocket, role: "A startup founder", day: "No tech team, a site that needs fixing", hand: "The bug, the deploy, the cleanup" },
  { icon: Layers, role: "A freelancer", day: "Two clients, one deadline, same day", hand: "The client work you can't fit in" },
  { icon: GraduationCap, role: "A student", day: "Stuck on your own project before review", hand: "Debugging it together, so you learn the fix" },
];

const timeline = [
  { when: "Start", what: "20-minute kickoff call: you walk through the task list and access" },
  { when: "Morning", what: "Highest-priority bug first, with a short update when it's fixed" },
  { when: "Midday", what: "Check-in: what's done, what's next, any blockers" },
  { when: "Afternoon", what: "Next tasks: features, tests, refactoring, deployment" },
  { when: "End of day", what: "Handover: what changed, where, and anything left to finish" },
];

const goodTasks = [
  "Bug fixes", "Small features", "Writing tests", "Code cleanup", "API integrations",
  "Deployment issues", "Documentation", "Dev environment setup", "Reviewing a pull request",
];
const keepTasks = [
  "Final decisions",
  "Production passwords and customer data",
  "Anything your company hasn't approved sharing",
];

const options = [
  { name: "Hire a full-time developer", start: "Weeks to months", commit: "Salary, notice periods, onboarding" },
  { name: "Agency", start: "Days to weeks", commit: "Contracts, minimum project size" },
  { name: "Bidding platforms", start: "Hours to days of sorting proposals", commit: "Unclear who you're getting" },
  { name: "Tech Engi co-worker for a day", start: "Matched once you post and confirm", commit: "One day. ₹3,480. Done.", hero: true },
];

const safe = [
  { icon: BadgeCheck, lead: "Verified engineers only", t: "Aadhaar, PAN and proof of experience, checked before they take work." },
  { icon: FileSignature, lead: "NDA-ready", t: "sign one before you share anything sensitive." },
  { icon: Lock, lead: "Share the minimum", t: "a staging environment or one repo, not production passwords or customer data." },
  { icon: Wallet, lead: "Payment through Tech Engi", t: "not cash or personal transfers." },
];

const faqs = [
  { q: "Can I hire a developer for just one day in India?", a: "Yes. Tech Engi's co-worker for a day is a verified engineer who works through your task list for a full working day for ₹3,480, with the tasks and hours agreed upfront." },
  { q: "What does Tech Engi's ₹3,480 co-worker do?", a: "They work alongside you for a day on bug fixes, small features, tests, cleanup, integrations or deployment issues, then hand over a summary of everything they changed." },
  { q: "Who are Tech Engi's co-workers?", a: "Experienced engineers verified with Aadhaar, PAN and proof of experience, matched to your tasks by an AI (LLM) based on tech stack, skills and experience." },
  { q: "Is a co-worker for a day cheaper than hiring?", a: "For short-term overload, usually yes. There's no recruitment, notice period, onboarding or long contract: one day, ₹3,480." },
  { q: "Can students book a co-worker?", a: "Yes, to get help on their own project. The engineer works through the bug with you so you understand the fix." },
  { q: "Do I need my company's permission?", a: "If you're sharing company code, get your manager's approval first. Most employers' IP and NDA policies require it." },
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

export default function HireCoworkerForADayPage() {
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
              ₹3,480 for a Co-Worker Who{" "}
              <span className="bg-[linear-gradient(transparent_64%,#fbbf24_64%)] text-[#1257e8]">
                Clears Your Task List
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[16px] leading-7 text-slate-700">
              Hire a verified engineer for a day. No hiring process, no notice
              period, no long contract.
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
              A Tech Engi co-worker-for-a-day booking: flat ₹3,480, tasks and
              hours agreed upfront, verified engineer.
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
              <Rich t="Tech Engi's **co-worker for a day** is a verified, experienced engineer who works through your task list for a full working day, for **₹3,480**. You agree the tasks and hours upfront, they work alongside you, and you get your evening back. No hiring process, no notice period, no long contract. **AI matches. Humans fix.**" />
            </p>
            <p className="mt-5 border-t border-amber-300 pt-5 text-[14px] leading-7 text-slate-700">
              <Rich t="**What is Tech Engi?** Tech Engi (techengi.in) is India's AI-matched freelance network for bug fixing and engineering work. An AI (LLM) matches your work to a verified engineer by tech stack, skills and budget, and an experienced human engineer does it." />
            </p>
          </aside>

          {/* Story */}

          <div className="mt-20 grid items-center gap-10 md:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-[22px] font-bold tracking-[-0.03em]">It&apos;s 7:40 PM.</p>
              <Para t="Standup is at 10 tomorrow. Two tickets are still open. One bug has eaten your whole afternoon, your manager has pinged twice, and the release is Friday." />
              <Para t="You don't need a new hire. You don't need a three-month contract. **You need one more good engineer, for one day.**" />
              <Para t="That's the whole idea." />
            </div>
            <figure><NightMock /></figure>
          </div>

          {/* ---------------- WHAT ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="what">What is Tech Engi&apos;s ₹3,480 co-worker for a day?</H2>
              <Para t="It's a verified Tech Engi engineer who joins you as a co-worker for a full working day, for a flat **₹3,480**." />
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {whatItems.map(({ icon: Icon, t }, i) => (
                <li key={t} className={`rounded-[24px] p-7 ${i === 1 ? "bg-[#e6eeff]" : "bg-amber-100"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon size={21} className={i === 1 ? "text-[#1257e8]" : "text-amber-600"} />
                  </span>
                  <p className="mt-6 text-[14.5px] leading-7 text-slate-700"><Rich t={t.replace(/^([^:.]+[.:])/, "**$1**")} /></p>
                </li>
              ))}
            </ul>

            <div className={TEXT}>
              <Para t="Every engineer is verified with Aadhaar, PAN and proof of experience before they can take work on Tech Engi." />
            </div>
          </section>

          {/* ---------------- WHO ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="who">Who is it for?</H2>
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {who.map(({ icon: Icon, role, day, hand }) => (
                <li key={role} className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-200 text-amber-700">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">You are...</p>
                  <p className="mt-1 text-[16px] font-bold">{role}</p>
                  <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">Your day looks like...</p>
                  <p className="mt-1 text-[14px] leading-6 text-slate-600">{day}</p>
                  <p className="mt-4 rounded-xl bg-[#e6eeff] px-3.5 py-2.5 text-[13px] font-semibold leading-5 text-[#1257e8]">
                    Hand it over: {hand}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- DAY ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="day">What can a co-worker get done in a day?</H2>
              <Para t="An example of how a day can run:" />
            </div>

            <ol className="relative mt-12 space-y-4 border-l-2 border-dashed border-amber-400 pl-8">
              {timeline.map((s, i) => (
                <li key={s.when} className="relative rounded-[20px] bg-slate-50 p-5 sm:p-6">
                  <span
                    className={`absolute -left-[45px] top-5 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ring-4 ring-white ${
                      i === timeline.length - 1 ? "bg-amber-500 text-[#050a30]" : "bg-[#1257e8] text-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[13px] font-bold text-[#1257e8]">{s.when}</p>
                  <p className="mt-1 text-[14.5px] leading-6 text-slate-700">{s.what}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#1257e8] p-7 text-white sm:p-8">
                <p className="text-[13px] font-semibold text-amber-300">Good tasks to hand over</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {goodTasks.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-medium">
                      <Check size={12} strokeWidth={3} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
                <p className="text-[13px] font-semibold text-slate-400">Keep with you</p>
                <ul className="mt-6 space-y-3.5">
                  {keepTasks.map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14px] text-slate-600">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-slate-400">
                        <Lock size={12} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ---------------- MATHS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="maths">The maths: why ₹3,480 is cheaper than a stuck day</H2>
              <Para t="Take one example. Say an engineer earns **₹12 lakh a year**. Spread across roughly 250 working days, that's about **₹4,800 per working day**, before office, laptop and benefit costs." />
              <Para t="If that engineer spends a whole day stuck on one bug, the company has spent around ₹4,800 for a bug that's still open, and the rest of their work has slipped by a day." />
              <Para t="A Tech Engi co-worker costs **₹3,480 for the day**. If your working day is 8 hours, that's about **₹435 an hour**, for an experienced engineer who isn't distracted by your meetings." />
            </div>

            <figure className="mt-12">
              <MathBars />
              <figcaption className="sr-only">
                A day of an engineer on a ₹12 lakh salary costs about ₹4,800;
                a Tech Engi co-worker costs ₹3,480.
              </figcaption>
            </figure>

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
                    <span className={`block text-[11px] font-semibold uppercase tracking-wide ${o.hero ? "text-amber-300" : "text-slate-400"}`}>Time to start</span>
                    {o.start}
                  </p>
                  <p className={`text-[13.5px] leading-6 ${o.hero ? "font-bold text-white" : "text-slate-600"}`}>
                    <span className={`block text-[11px] font-semibold uppercase tracking-wide ${o.hero ? "text-amber-300" : "text-slate-400"}`}>Commitment</span>
                    {o.commit}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- SAFE ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="safe">Is it safe?</H2>
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
                <Rich t="**Working in a company?** Get your manager's approval before bringing in outside help on company code. It protects you and your team." />
              </p>
            </div>
          </section>

          {/* ---------------- BOOK ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="book">How to book a co-worker for a day</H2>
            </div>

            <ol className="relative mt-12 grid gap-9 py-3 sm:grid-cols-4 sm:gap-5">
              <span
                aria-hidden="true"
                className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden border-t-2 border-dashed border-amber-400 sm:block"
              />
              {[
                { icon: ClipboardList, title: "Post your tasks", body: <>Go to <Link href="/" className="font-semibold text-[#1257e8] underline">techengi.in</Link> and post your task list, tech stack and the day you need help.</> },
                { icon: Wallet, title: "Ask for the day", body: "Mention that you want a co-worker for a day (₹3,480)." },
                { icon: Cpu, title: "Get matched", body: "The AI (LLM) matches you to a verified engineer whose stack and experience fit your tasks." },
                { icon: Sunset, title: "Get your evening back", body: "Kick off, work together, and get your evening back." },
              ].map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                  <span
                    className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
                      i === 3 ? "bg-amber-500 text-[#050a30]" : "bg-[#1257e8] text-white"
                    }`}
                  >
                    <Icon size={21} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold leading-5">{title}</p>
                    <p className="mt-1.5 text-[12.5px] leading-5 text-slate-500">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- ENGINEERS ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className={TEXT}>
              <H2 id="engineers">For engineers: become a Tech Engi co-worker</H2>
              <Para t="If you're an experienced developer, QA tester, debugger or full-stack engineer, a co-worker day is paid work that fits around your schedule. Engineers on Tech Engi keep **97% of what the client pays on their first project, and 95% on every project after**, with no bidding, no tokens and no profile-ranking games." />
            </div>

            <figure className="mt-12">
              <PayoutBars />
              <figcaption className="sr-only">Engineers keep 97% on a first project and 95% after.</figcaption>
            </figure>

            <div className={TEXT}>
              <Para t="Freshers: completed co-worker days build a record of real, finished work that clients can see." />
            </div>
          </section>

          {/* ---------------- CTA ---------------- */}

          <section className="mt-28 sm:mt-40">
            <div className="relative overflow-hidden rounded-[28px] bg-[#1257e8] px-7 py-12 text-white sm:px-14 sm:py-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500" />
              <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/10" />
              <div className="relative max-w-md">
                <p className="text-[22px] font-bold italic leading-[1.3] tracking-[-0.02em] sm:text-[27px]">
                  Your evening is worth more than one stuck bug.
                </p>
                <p className="mt-4 text-[14.5px] leading-7 text-white/85">
                  Book a co-worker for a day at techengi.in.
                </p>
                <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[13px] font-bold text-[#050a30] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
                  >
                    Book a Co-Worker
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
              <Link href="/blog/who-can-fix-my-code-how-soon" className="font-semibold text-[#1257e8] hover:underline">
                Who can fix my code, and how soon? →
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

/* Hero: the booking card */
function HeroCard() {
  const perks = ["Tasks and hours agreed upfront", "Works through your task list", "You review what ships"];
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[32px] bg-amber-300/80" />
      <div className="absolute -bottom-5 -left-5 h-1/2 w-1/2 rounded-[32px] bg-[#1257e8]/10" />

      <div className="relative rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.12)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400">Tech Engi</p>
            <p className="mt-0.5 text-[15px] font-bold">Co-worker for a day</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-3 py-1.5 text-[11px] font-semibold text-[#1257e8]">
            <BadgeCheck size={13} />
            Verified
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between rounded-2xl bg-amber-100 p-5">
          <p className="text-[38px] font-bold leading-none tracking-[-0.04em]">₹3,480</p>
          <p className="text-right text-[11.5px] leading-4 text-slate-600">
            flat rate<br />full working day
          </p>
        </div>

        <ul className="mt-5 space-y-3">
          {perks.map((t) => (
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
            <ShieldCheck size={17} />
          </span>
          <p className="text-[12px] leading-5 text-white/80">
            Aadhaar, PAN and proof of experience checked
          </p>
        </div>
      </div>

      <div className="absolute -left-4 top-28 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <FileSignature size={15} className="text-[#1257e8]" />
        NDA-ready
      </div>
      <div className="absolute -right-3 bottom-12 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold shadow-xl sm:flex">
        <Clock3 size={15} className="text-amber-600" />
        No notice period
      </div>
    </div>
  );
}

/* Story: the 7:40 PM moment */
function NightMock() {
  const rows = [
    { l: "Standup", v: "10:00 AM", bad: false },
    { l: "Open tickets", v: "2", bad: true },
    { l: "One bug ate", v: "your afternoon", bad: true },
    { l: "Release", v: "Friday", bad: false },
  ];
  return (
    <div className="rounded-[26px] bg-[#050a30] p-7 text-white" aria-hidden="true">
      <p className="text-[44px] font-bold leading-none tracking-[-0.04em] text-amber-400">7:40 PM</p>
      <ul className="mt-6 space-y-2.5">
        {rows.map((r) => (
          <li key={r.l} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-[12.5px]">
            <span className="text-white/70">{r.l}</span>
            <span className={`font-semibold ${r.bad ? "text-red-300" : ""}`}>{r.v}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-500 px-4 py-3 text-[#050a30]">
        <Users size={17} />
        <p className="text-[12.5px] font-bold">+1 good engineer, for one day</p>
      </div>
    </div>
  );
}

/* Maths: a stuck day vs the co-worker */
function MathBars() {
  return (
    <div className="rounded-[24px] bg-slate-50 p-7 sm:p-8">
      <ul className="space-y-7">
        <li>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
            <span className="font-semibold text-slate-700">An engineer on ₹12 lakh a year, one day stuck on one bug</span>
            <span className="text-[20px] font-bold tracking-[-0.03em] text-red-600">~₹4,800</span>
          </div>
          <div className="mt-2.5 h-5 w-full overflow-hidden rounded-full bg-white">
            <span className="block h-full w-full rounded-full bg-red-400" />
          </div>
          <p className="mt-2 text-[12px] text-slate-400">₹12 lakh ÷ ~250 working days, before office, laptop and benefit costs</p>
        </li>
        <li>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
            <span className="font-semibold text-slate-700">Tech Engi co-worker, a full day</span>
            <span className="text-[20px] font-bold tracking-[-0.03em] text-[#1257e8]">₹3,480</span>
          </div>
          <div className="mt-2.5 h-5 w-full overflow-hidden rounded-full bg-white">
            <span className="block h-full rounded-full bg-[#1257e8]" style={{ width: "72.5%" }} />
          </div>
          <p className="mt-2 text-[12px] text-slate-400">₹3,480 ÷ 8 hours ≈ ₹435 an hour</p>
        </li>
      </ul>
    </div>
  );
}

/* Engineers: payout split */
function PayoutBars() {
  const rows = [
    { l: "First project", keep: 97, fee: 3 },
    { l: "Every project after", keep: 95, fee: 5 },
  ];
  return (
    <div className="rounded-[24px] bg-amber-100 p-7 sm:p-8">
      <ul className="space-y-6">
        {rows.map((r) => (
          <li key={r.l}>
            <p className="text-[13px] font-semibold text-slate-700">{r.l}</p>
            <div className="mt-2 flex h-9 w-full overflow-hidden rounded-xl text-[12px] font-bold">
              <span className="flex items-center justify-center bg-[#1257e8] text-white" style={{ width: `${r.keep}%` }}>
                {r.keep}% to you
              </span>
              <span className="bg-amber-500" style={{ width: `${r.fee}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[12.5px] text-slate-600">No bidding, no tokens, no profile-ranking games.</p>
    </div>
  );
}