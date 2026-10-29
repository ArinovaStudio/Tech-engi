import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Bug,
  Check,
  Clock3,
  Code2,
  Cpu,
  FileText,
  GraduationCap,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Rocket,
  Sparkles,
  Sprout,
  UserCheck,
  Wallet,
  Wrench,
} from "lucide-react";
import Header from "@/components/saas/Header";
import Footer from "@/components/saas/Footer";

/* ===============================================================
   SEO CONFIG
   Route: app/about/page.tsx
   Style: white, minimal, CSS-only animation (stays a server
   component, so `metadata` works). Honors prefers-reduced-motion.
=============================================================== */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techengi.in";
const PATH = "/about";
const URL_FULL = `${SITE_URL}${PATH}`;
const OG_IMAGE = "/og/about.png"; // add a 1200x630 image at public/og/about.png

const META_TITLE = "What Is Tech Engi? India's AI-Matched Freelance Network";
const META_DESCRIPTION =
  "Tech Engi is India's freelance network that puts bug fixing first. AI matches your project to a verified engineer, and a human engineer fixes it. AI matches. Humans fix.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "what is Tech Engi",
    "AI-matched freelance network India",
    "bug fixing freelancers India",
    "verified engineers India",
    "TSquareY1 OPC Private Limited",
  ],
  alternates: { canonical: URL_FULL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    url: URL_FULL,
    siteName: "Tech Engi",
    locale: "en_IN",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "What is Tech Engi?" }],
  },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION, images: [OG_IMAGE] },
};

/* ===============================================================
   CONTENT
=============================================================== */

const audiences = [
  { icon: Building2, t: "Corporate teams & managers", d: "Hand off bugs, overflow tasks and stuck features to a verified engineer without a hiring cycle." },
  { icon: Bug, t: "QA testers & debuggers", d: "Pick up testing and debugging work matched to the tools and stacks you already know." },
  { icon: Code2, t: "Junior, senior, full-stack & MERN developers", d: "Get matched to projects that fit your stack and experience, with no bidding and no paying to apply." },
  { icon: Sprout, t: "Freshers entering IT", d: "Work on real, paid projects and build a record of finished work that clients can see." },
  { icon: GraduationCap, t: "Students", d: "Get help from a verified engineer when you're stuck on your own project, and learn how it's fixed." },
  { icon: Rocket, t: "Startups & founders", d: "Turn a problem-solving idea into working software, from a single fix to a full build." },
];

const clientSteps = [
  { n: "01", t: "Post your requirement", d: "Add a project title, a description of the work, the tech stack and skills you need, and your budget." },
  { n: "02", t: "Pay 25% upfront to confirm", d: "This confirms the project is real, so engineers get serious work and no one's time is wasted." },
  { n: "03", t: "AI (LLM) matches your engineer", d: "Your project goes straight to an engineer whose stack, skills and experience fit. No proposals to sort through." },
  { n: "04", t: "Track live, pay by milestone", d: "Follow progress on one clean dashboard. Payments move through escrow as each milestone is completed." },
];

const engineerRows = [
  { k: "Bidding", v: "None. AI brings projects to you." },
  { k: "Tokens or credits", v: "Never." },
  { k: "Profile ranking", v: "Matching is by fit." },
  { k: "Fee to close a deal", v: "Zero." },
];

const trust = [
  { icon: IdCard, t: "Identity", d: "Aadhaar card and PAN card." },
  { icon: FileText, t: "Experience", d: "Pay slips or other proof of work experience." },
  { icon: Wrench, t: "Skills", d: "Skills and past work, reviewed before approval." },
];

const rules = ["No bidding wars", "No tokens to buy", "No profile-ranking games", "No payment to close a deal", "No time-pass", "No malpractice"];

const faqs = [
  { q: "What is Tech Engi?", a: "Tech Engi (techengi.in) is an Indian freelance network for bug fixing and engineering work. An AI (LLM) matches each project to a verified human engineer by title, description, tech stack, skills and budget." },
  { q: "Does AI fix the code?", a: "No. AI only matches your project to the right engineer. Experienced human engineers do the actual fixing and building." },
  { q: "How much do engineers keep?", a: "Engineers keep 97% of what the client pays on their first completed project, and 95% on every project after that." },
  // TODO: add your refund policy to this answer (for example, what happens if no engineer is matched).
  { q: "Why do clients pay 25% upfront?", a: "The 25% confirms the project is real, so engineers are matched to serious work immediately." },
  { q: "Is there bidding or a fee to apply?", a: "No. There is no bidding, no tokens or credits, no profile ranking and no fee to close a deal." },
  { q: "What is Tech Engi Pro?", a: "An optional ₹734 per month plan that sends client leads to your email and gives you a Pro profile. Escrow protection applies only to work run through your Tech Engi dashboard." },
  { q: "How are engineers verified?", a: "Engineers submit Aadhaar, PAN and proof of experience such as pay slips, and their skills and past work are reviewed before they can take projects." },
  { q: "Can students use Tech Engi?", a: "Yes. Students can get help from a verified engineer when they're stuck on their own projects, and learn from how the problem is solved." },
  { q: "Can I work on Tech Engi while I'm employed?", a: "Many people do freelance work alongside a job. Check your employment contract and your company's moonlighting policy first." },
  { q: "Who runs Tech Engi?", a: "Tech Engi is a platform of TSquareY1 OPC Private Limited, a DPIIT- and MSME-recognised startup in Chennai, Tamil Nadu, founded by Tarun Pathak K." },
];

/* ===============================================================
   STRUCTURED DATA
=============================================================== */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Tech Engi",
      legalName: "TSquareY1 OPC Private Limited",
      url: SITE_URL,
      email: "support@techengi.in",
      description: META_DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      founder: { "@type": "Person", name: "Tarun Pathak K", jobTitle: "Founder" },
    },
    {
      "@type": "AboutPage",
      "@id": `${URL_FULL}#about`,
      url: URL_FULL,
      name: META_TITLE,
      description: META_DESCRIPTION,
      inLanguage: "en-IN",
      dateModified: "2026-10-20",
      about: { "@id": `${SITE_URL}#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: URL_FULL },
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
   ANIMATION (CSS only)
   - .te-in      : hero entrance on load
   - .te-reveal  : fades up as it scrolls into view (scroll-driven
                   animation; content stays visible where unsupported)
   - .te-count   : numbers count up
   - .te-line    : progress line draws as you scroll
=============================================================== */

const CSS = `
@property --te-n{syntax:"<integer>";initial-value:0;inherits:false}
@keyframes te-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes te-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes te-scroll{to{transform:translateX(-50%)}}
@keyframes te-mark{from{background-size:0% 100%}}
@keyframes te-pulse{0%{box-shadow:0 0 0 0 rgba(18,87,232,.45)}70%,100%{box-shadow:0 0 0 10px rgba(18,87,232,0)}}
@keyframes te-count{from{--te-n:0}to{--te-n:var(--to)}}
@keyframes te-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes te-node{0%,28%{background:#1257e8;color:#fff;transform:scale(1.08)}34%,100%{background:#e6eeff;color:#1257e8;transform:scale(1)}}
@keyframes te-glow{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.08)}}
.te-in{animation:te-rise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i,0)*90ms)}
.te-float{animation:te-float 6s ease-in-out infinite;animation-delay:calc(var(--i,0)*-1.4s)}
.te-marquee{display:flex;width:max-content;animation:te-scroll 30s linear infinite}
.te-marquee:hover{animation-play-state:paused}
.te-mark{background:linear-gradient(transparent 64%,#fbbf24 64%) no-repeat;background-size:100% 100%;animation:te-mark 1s .6s cubic-bezier(.2,.7,.2,1) both}
.te-dot{animation:te-pulse 2s infinite}
.te-node{animation:te-node 6s infinite;animation-delay:calc(var(--i,0)*2s)}
.te-glow{animation:te-glow 8s ease-in-out infinite}
.te-count{--te-n:var(--to);counter-reset:te-n var(--te-n);animation:te-count 1.8s ease-out both}
.te-count::before{content:counter(te-n)}
@supports (animation-timeline:view()){
.te-reveal{animation:te-rise linear both;animation-timeline:view();animation-range:entry calc(var(--i,0)*6%) entry calc(40% + var(--i,0)*6%)}
.te-count{animation-timeline:view();animation-range:entry 0% entry 90%}
.te-line{animation:te-grow linear both;animation-timeline:view();animation-range:entry 10% cover 35%}
}
@media (prefers-reduced-motion:reduce){
.te-in,.te-reveal,.te-float,.te-marquee,.te-dot,.te-node,.te-glow,.te-count,.te-line,.te-mark{animation:none!important}
}
`;

const st = (i: number) => ({ "--i": i }) as CSSProperties;

/* ===============================================================
   PAGE
=============================================================== */

export default function AboutPage() {
  return (
    <>
    <main className="overflow-x-clip bg-white text-[#050a30]">
    <Header />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ============================ HERO ============================ */}

      <header className="relative">
        <div aria-hidden="true" className="te-glow pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#1257e8]/[0.07] blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
          style={{ backgroundImage: "linear-gradient(#eef1f6 1px,transparent 1px),linear-gradient(90deg,#eef1f6 1px,transparent 1px)", backgroundSize: "56px 56px" }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-6 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav aria-label="Breadcrumb" className="te-in text-[13px] text-slate-500">
              <ol className="flex items-center gap-2.5">
                <li><Link href="/" className="transition hover:text-[#1257e8]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-[#050a30]">About</li>
              </ol>
            </nav>

            <p className="te-in mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1257e8]" style={st(1)}>
              India&apos;s AI-matched freelance network
            </p>

            <h1 className="te-in mt-5 text-[44px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[64px]" style={st(2)}>
              What is{" "}
              <span className="te-mark whitespace-nowrap text-[#1257e8]">Tech Engi?</span>
            </h1>

            <p className="te-in mt-7 max-w-lg text-[17px] leading-8 text-slate-600" style={st(3)}>
              India&apos;s freelance network that puts bug fixing first. AI
              matches your project to a verified engineer. A human engineer
              fixes it.
            </p>

            <p className="te-in mt-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[14px] font-bold" style={st(4)}>
              <span className="text-[#1257e8]">AI matches.</span>
              <span className="h-4 w-px bg-slate-200" />
              <span>Humans fix.</span>
            </p>

            <div className="te-in mt-10 flex flex-col gap-3.5 sm:flex-row" style={st(5)}>
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#050a30] px-7 py-3.5 text-[13.5px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1257e8] hover:shadow-xl"
              >
                Post a bug or project
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-[13.5px] font-semibold transition hover:-translate-y-0.5 hover:border-[#1257e8] hover:text-[#1257e8]"
              >
                Join as Builder
              </Link>
            </div>

            <div className="te-in mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-slate-500" style={st(6)}>
              <span className="inline-flex items-center gap-2">
                <span className="te-dot h-2 w-2 rounded-full bg-[#1257e8]" />
                Updated 20 October 2026
              </span>
              <span>By Tarun Pathak K, Founder</span>
              <span>TSquareY1 OPC Private Limited · Chennai</span>
            </div>
          </div>

          <figure className="te-in" style={st(3)}>
            <HeroFlow />
            <figcaption className="sr-only">
              A bug is posted, an AI matches it to a verified engineer, and a
              human engineer fixes it.
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ============================ IN ONE PARAGRAPH ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="te-reveal">
            <Eyebrow>In one paragraph</Eyebrow>
            <ul className="mt-8 space-y-3">
              {["DPIIT-recognised startup", "MSME-recognised", "Chennai, Tamil Nadu", "Platform of TSquareY1 OPC Private Limited"].map((c, i) => (
                <li key={c} className="te-reveal flex items-center gap-3 text-[14px] font-semibold" style={st(i)}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6eeff] text-[#1257e8]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <p className="te-reveal text-[22px] font-medium leading-[1.55] tracking-[-0.02em] text-[#050a30] sm:text-[26px]">
            Tech Engi (techengi.in) is an Indian freelance network for bug fixing
            and engineering work. Clients post a bug, feature or project, and an
            AI (LLM) matches it to a verified engineer based on the project
            title, description, tech stack, skills and budget.{" "}
            <span className="text-[#1257e8]">
              The work itself is done by an experienced human engineer, not by AI.
            </span>{" "}
            Tech Engi is a platform of TSquareY1 OPC Private Limited, a DPIIT-
            and MSME-recognised startup based in Chennai, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* ============================ FIRST PRIORITY ============================ */}

      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Our first priority</Eyebrow>
            <H2 reveal>Bugs get <span className="text-[#1257e8]">fixed first.</span></H2>
            <p className="te-reveal mt-7 text-[16px] leading-8 text-slate-600" style={st(1)}>
              Production down. A system that broke after the last release. A
              team too overloaded to get to the backlog. These are the problems
              that cost companies the most, and they&apos;re the ones Tech Engi
              is built to solve first.
            </p>
            <p className="te-reveal mt-5 text-[16px] leading-8 text-slate-600" style={st(2)}>
              Tech Engi was made especially for people working in companies: to
              take the pressure off, close the tickets that keep piling up, and
              make the working week less stressful.
            </p>
          </div>

          <figure className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="space-y-4">
              {["Production down", "A system that broke after the last release", "A team too overloaded for the backlog"].map((t, i) => (
                <div
                  key={t}
                  className="te-float flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(5,10,48,0.05)]"
                  style={{ ...st(i), marginLeft: i === 1 ? "2rem" : 0 }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <Bug size={16} />
                  </span>
                  <p className="text-[14px] font-semibold">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-[#050a30] px-5 py-4 text-white">
              <BadgeCheck size={18} className="text-amber-400" />
              <p className="text-[14px] font-bold">Closed by a verified engineer</p>
            </div>
          </figure>
        </div>
      </section>

      {/* ============================ HOW WE'RE DIFFERENT ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Eyebrow>How we&apos;re different</Eyebrow>
        <H2 reveal>AI matches. <span className="text-[#1257e8]">Humans fix.</span></H2>

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
          <div className="te-reveal group rounded-[28px] border border-slate-200 p-8 transition hover:border-[#1257e8]/40 hover:shadow-[0_20px_50px_rgba(18,87,232,0.08)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6eeff] text-[#1257e8] transition group-hover:rotate-6">
              <Cpu size={22} />
            </span>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-wide text-[#1257e8]">Where we use AI</p>
            <p className="mt-3 text-[16px] leading-8 text-slate-600">
              We use AI where it&apos;s good: reading your project and finding
              the right engineer in minutes instead of days.
            </p>
          </div>

          <div className="hidden items-center md:flex" aria-hidden="true">
            <span className="h-px w-10 bg-slate-300" />
            <ArrowRight size={18} className="text-slate-400" />
          </div>

          <div className="te-reveal group rounded-[28px] bg-[#050a30] p-8 text-white" style={st(1)}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-400 transition group-hover:-rotate-6">
              <UserCheck size={22} />
            </span>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-wide text-amber-400">Where we don&apos;t</p>
            <p className="mt-3 text-[16px] leading-8 text-white/75">
              We don&apos;t use AI to write your fix. Every bug and project on
              Tech Engi is handled by an experienced engineer who understands
              your code, your deadlines and what&apos;s at stake.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ WHO IT'S FOR ============================ */}

      <section className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <Eyebrow>Who Tech Engi is for</Eyebrow>
          <H2 reveal>Built for <span className="text-[#1257e8]">everyone in Indian tech.</span></H2>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map(({ icon: Icon, t, d }, i) => (
              <li
                key={t}
                className="te-reveal group rounded-[24px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-[#1257e8]/40 hover:shadow-[0_20px_50px_rgba(18,87,232,0.08)]"
                style={st(i % 3)}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#050a30] transition group-hover:bg-[#1257e8] group-hover:text-white">
                  <Icon size={19} />
                </span>
                <h3 className="mt-6 text-[17px] font-bold leading-[1.3] tracking-[-0.02em]">{t}</h3>
                <p className="mt-3 text-[14.5px] leading-7 text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ CO-WORKER ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="te-reveal relative overflow-hidden rounded-[32px] bg-[#050a30] px-8 py-14 text-white sm:px-14 sm:py-16">
          <div aria-hidden="true" className="te-glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1257e8]/60 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-amber-400">A co-worker for the day</p>
              <p className="mt-5 text-[44px] font-bold leading-none tracking-[-0.045em] sm:text-[64px]">
                ₹3,480
                <span className="ml-3 text-[18px] font-semibold tracking-normal text-white/60 sm:text-[22px]">
                  for a full working day.
                </span>
              </p>
              <p className="mt-7 max-w-lg text-[16px] leading-8 text-white/75">
                Busy schedule? Can&apos;t get to it today? Too many projects at
                once? Book a verified Tech Engi engineer as your co-worker for a
                day. You agree the task list and working hours upfront, and they
                work through it with you, so you get your evening back.
              </p>
              <Link
                href="/blog/hire-coworker-for-a-day-3480"
                className="group mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-amber-400"
              >
                See how a co-worker day works
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>

            <ul className="space-y-3" aria-hidden="true">
              {["Task list agreed upfront", "Working hours agreed upfront", "They work through it with you", "You get your evening back"].map((t, i) => (
                <li key={t} className="te-float flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3.5 text-[13.5px] font-semibold backdrop-blur" style={st(i)}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#050a30]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================ CLIENTS ============================ */}

      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <Eyebrow>How it works for clients</Eyebrow>
          <H2 reveal>Post it. Pay 25%. <span className="text-[#1257e8]">Get matched.</span></H2>

          <div className="relative mt-16">
            <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-slate-200 lg:block">
              <span className="te-line block h-full origin-left bg-[#1257e8]" />
            </div>
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {clientSteps.map((s, i) => (
                <li key={s.n} className="te-reveal relative lg:text-center" style={st(i)}>
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-[14px] font-bold text-[#1257e8] lg:mx-auto">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold leading-[1.3] tracking-[-0.02em]">{s.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-7 text-slate-600">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="te-reveal mt-16 flex flex-col gap-5 rounded-[24px] border border-dashed border-[#1257e8]/40 bg-white p-7 sm:flex-row sm:items-start sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6eeff] text-[#1257e8]">
              <Sparkles size={21} />
            </span>
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-900">Coming soon</p>
              <p className="mt-3 text-[17px] font-bold tracking-[-0.02em]">Tech Engi AI project assistant</p>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-7 text-slate-600">
                Not sure how to describe your project or what budget to set?
                Our AI tool will help you turn your idea into a clear
                requirement, explain what you don&apos;t yet know, and suggest a
                realistic budget before you post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ ENGINEERS ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Eyebrow>For engineers & freelancers</Eyebrow>
        <H2 reveal>Keep <span className="text-[#1257e8]">what you earn.</span></H2>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="te-reveal rounded-[28px] border border-slate-200 p-8 sm:p-10">
            <p className="text-[72px] font-bold leading-none tracking-[-0.06em] text-[#1257e8] sm:text-[96px]">
              <span className="te-count" style={{ "--to": 97 } as CSSProperties} aria-hidden="true" />%
              <span className="sr-only">97%</span>
            </p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">
              of what the client pays, on your first completed project.
            </p>
          </div>
          <div className="te-reveal rounded-[28px] bg-[#050a30] p-8 text-white sm:p-10" style={st(1)}>
            <p className="text-[72px] font-bold leading-none tracking-[-0.06em] text-amber-400 sm:text-[96px]">
              <span className="te-count" style={{ "--to": 95 } as CSSProperties} aria-hidden="true" />%
              <span className="sr-only">95%</span>
            </p>
            <p className="mt-5 text-[15px] leading-7 text-white/70">
              fixed, on every project you complete after that.
            </p>
          </div>
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {engineerRows.map((r, i) => (
            <li key={r.k} className="te-reveal rounded-[22px] bg-slate-50 p-6 transition hover:bg-[#e6eeff]" style={st(i)}>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">{r.k}</p>
              <p className="mt-2 text-[15px] font-bold leading-6">{r.v}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================ PRO ============================ */}

      <section className="border-t border-slate-200">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>Tech Engi Pro</Eyebrow>
            <H2 reveal>
              Tech Engi Pro: <span className="text-[#1257e8]">₹734/month</span>
            </H2>
            <p className="te-reveal mt-7 text-[16px] leading-8 text-slate-600" style={st(1)}>
              For engineers who want to grow faster. Pro adds:
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Client leads to your email, so you can reach out and close deals yourself.",
                "A Pro profile that stands out to clients viewing it.",
              ].map((t, i) => (
                <li key={t} className="te-reveal flex items-start gap-4 text-[15px] leading-7 text-slate-700" style={st(i + 2)}>
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1257e8] text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="te-reveal self-center rounded-[28px] border border-amber-300 bg-amber-50 p-8" style={st(2)}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-600">
              <Lock size={19} />
            </span>
            <p className="mt-5 text-[13px] font-bold uppercase tracking-wide text-amber-800">Please read</p>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Escrow, milestone payments and dispute support only apply to work
              that runs through your Tech Engi dashboard. If you close a lead
              and work outside the dashboard, Tech Engi can&apos;t guarantee
              payment or the client&apos;s trustworthiness. Keep the work on your
              dashboard and you stay protected.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ TRUST ============================ */}

      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <Eyebrow>Trust & verification</Eyebrow>
          <H2 reveal>Every engineer <span className="text-[#1257e8]">is verified.</span></H2>
          <p className="te-reveal mt-7 max-w-2xl text-[16px] leading-8 text-slate-600" style={st(1)}>
            Tech Engi is built for India, so clients should know exactly who is
            working on their code. Before taking projects, every engineer
            submits:
          </p>

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {trust.map(({ icon: Icon, t, d }, i) => (
              <li key={t} className="te-reveal group rounded-[24px] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-[#1257e8]/40" style={st(i)}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6eeff] text-[#1257e8] transition group-hover:scale-110">
                  <Icon size={21} />
                </span>
                <h3 className="mt-6 text-[18px] font-bold tracking-[-0.02em]">{t}</h3>
                <p className="mt-2.5 text-[14.5px] leading-7 text-slate-600">{d}</p>
              </li>
            ))}
          </ul>

          <p className="te-reveal mt-8 flex items-center gap-3 text-[14px] font-semibold text-slate-700">
            <Lock size={16} className="text-[#1257e8]" />
            These documents are used only to verify engineers and are never shown to clients.
          </p>
        </div>
      </section>

      {/* ============================ RULES ============================ */}

      <section className="overflow-hidden border-t border-slate-200 py-24 sm:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <Eyebrow>The rules</Eyebrow>
          <H2 reveal>Clean, simple, <span className="text-[#1257e8]">fair.</span></H2>
        </div>

        <div className="mt-14 border-y border-slate-200 py-6" aria-hidden="true">
          <div className="te-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {rules.map((r) => (
                  <span key={r + k} className="mx-3 inline-flex items-center gap-3 whitespace-nowrap text-[26px] font-bold tracking-[-0.03em] text-[#050a30] sm:text-[34px]">
                    {r}
                    <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <p className="te-reveal mt-10 max-w-2xl text-[16px] leading-8 text-slate-600">
            No bidding wars. No tokens to buy. No profile-ranking games. No
            payment to close a deal. Clients pay 25% upfront to confirm, and
            the project starts. No time-pass, and no malpractice.
          </p>
        </div>
      </section>

      {/* ============================ VISION ============================ */}

      <section className="border-t border-slate-200 bg-[#050a30] text-white">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
          <div aria-hidden="true" className="te-glow pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#1257e8]/50 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="te-reveal text-[12px] font-semibold uppercase tracking-[0.18em] text-amber-400">Our vision</p>
            <h2 className="te-reveal mt-5 text-[32px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[48px]" style={st(1)}>
              Built in India, for India&apos;s engineers.
            </h2>
            <p className="te-reveal mt-8 text-[17px] leading-8 text-white/75" style={st(2)}>
              India has some of the world&apos;s best engineers, and most of
              them work inside large IT services companies. We believe the next
              big change in Indian IT will come from verified engineers working
              directly with the teams that need them, with fair pay, clear
              milestones and no middle layers. Tech Engi is built to make that
              the normal way of working.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <Eyebrow>Questions, answered</Eyebrow>
            <H2 reveal>Frequently asked <span className="text-[#1257e8]">questions</span></H2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f, i) => (
              <details key={f.q} className="te-reveal group py-6" style={st(i % 3)}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16.5px] font-semibold leading-7 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-600 transition duration-300 group-open:rotate-45 group-open:bg-[#1257e8] group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pr-10 text-[15px] leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="te-reveal rounded-[32px] border border-slate-200 px-8 py-16 text-center sm:px-14 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-[30px] font-bold leading-[1.12] tracking-[-0.04em] sm:text-[44px]">
            Tech Engi: where engineers <span className="text-[#1257e8]">build without overhead.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-8 text-slate-600">
            Clients: post your bug or project. Engineers: get verified and get
            matched.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#050a30] px-7 py-3.5 text-[13.5px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1257e8] hover:shadow-xl"
            >
              Post your bug or project
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-[13.5px] font-semibold transition hover:-translate-y-0.5 hover:border-[#1257e8] hover:text-[#1257e8]"
            >
              Get verified and matched
            </Link>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-slate-200 pt-8 text-[13.5px] text-slate-500 sm:flex-row sm:gap-8">
            <a href="mailto:support@techengi.in" className="inline-flex items-center gap-2 transition hover:text-[#1257e8]">
              <Mail size={15} />
              support@techengi.in
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} />
              Chennai, Tamil Nadu
            </span>
            <Link href="/" className="inline-flex items-center gap-2 transition hover:text-[#1257e8]">
              <Wallet size={15} />
              techengi.in
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

/* ===============================================================
   SMALL PIECES
=============================================================== */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="te-reveal text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1257e8]">
      {children}
    </p>
  );
}

function H2({ children, reveal = false }: { children: ReactNode; reveal?: boolean }) {
  return (
    <h2
      className={`${reveal ? "te-reveal" : ""} mt-4 max-w-2xl text-[32px] font-bold leading-[1.08] tracking-[-0.045em] sm:text-[48px]`}
      style={st(1)}
    >
      {children}
    </h2>
  );
}

/* Hero visual: a bug is posted, AI matches, a human fixes */
function HeroFlow() {
  const nodes = [
    { icon: Bug, title: "Bug posted", text: "Login fails after deploy" },
    { icon: Cpu, title: "AI (LLM) matches", text: "By tech stack, skills and budget" },
    { icon: UserCheck, title: "Verified engineer fixes it", text: "A human, not AI" },
  ];
  return (
    <div className="te-float relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(5,10,48,0.08)] sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold">Tech Engi</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-3 py-1 text-[11px] font-semibold text-[#1257e8]">
            <Clock3 size={12} />
            Matched in minutes
          </span>
        </div>

        <ol className="relative mt-7 space-y-6">
          <span className="absolute bottom-6 left-[19px] top-6 w-px bg-slate-200" />
          {nodes.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex items-center gap-4">
              <span className="te-node relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white" style={st(i)}>
                <Icon size={17} />
              </span>
              <div>
                <p className="text-[14px] font-bold leading-5">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-slate-500">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex items-center justify-between rounded-2xl bg-[#050a30] px-5 py-4 text-white">
          <p className="text-[13px] font-bold">AI matches. Humans fix.</p>
          <BadgeCheck size={18} className="text-amber-400" />
        </div>
      </div>

      <div className="absolute -left-5 top-16 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-semibold shadow-lg sm:flex">
        <Lock size={14} className="text-[#1257e8]" />
        NDA first
      </div>
      <div className="absolute -right-4 bottom-20 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-semibold shadow-lg sm:flex">
        <Wallet size={14} className="text-amber-600" />
        Escrow by milestone
      </div>
    </div>
  );
}