import React from "react";

const domains = [
  ["</>", "Web & backend", "React, Node, Django, APIs"],
  ["▣", "Mobile", "iOS, Android, Flutter"],
  ["◉", "Embedded & IoT", "Firmware, PCB, sensors"],
  ["⚙", "DevOps & cloud", "AWS, deploys, CI/CD"],
  ["✦", "AI & ML", "Model integration, pipelines"],
  ["▢", "Design", "UI, graphics, brand assets"],
  ["▶", "Video & photo", "Editing, motion, retouching"],
  ["✎", "Content", "Technical docs, copy"],
];

const companySteps = [
  ["1", "Describe the task", "Two sentences and the file that's failing — that's enough to start."],
  ["2", "NDA signs automatically", "Before any engineer opens your file, confidentiality is locked in."],
  ["3", "Matched to a verified engineer", "By skill and domain — not the first person who applies."],
  ["4", "Release payment when it's confirmed", "Held in escrow until you say the fix actually works."],
];

const engineerSteps = [
  ["1", "Set up your profile", "Domains, stack, and the kind of work you actually want."],
  ["2", "Get matched, not searched", "Tasks that fit your profile are routed to you directly."],
  ["3", "Deliver and get paid", "Escrow releases to you the moment the client confirms it's done."],
  ["4", "Keep 95% of every payout", "5% platform fee. No listing fee, no bidding fee."],
];

export default function TechEngiLanding() {
  return (
    <main className="min-h-screen bg-[#050A30] text-[#F4F6FC] antialiased">
      <Nav />
      <Hero />
      <Divider />

      <Section id="how-corp" tag="for companies & corporate teams"
        title="Skip the hiring queue. Fix the actual bug tonight."
        sub="Hiring a contractor takes weeks. A production error can't. Post the specific problem, not the whole job description.">
        <div className="grid gap-[22px] md:grid-cols-2">
          <PathCard gold kicker="the client side" title="Post it. Get it fixed. Pay when it works."
            description="No procurement queue. No agency retainer. Describe what's broken and let the network find the right person."
            steps={companySteps} button="Post your first task" />
          <PathCard kicker="the engineer side" title="Get matched to work you're already good at."
            description="No cold outreach, no client hunting. Set your skills once — tasks that fit come to you."
            steps={engineerSteps} button="Join as an engineer" />
        </div>
      </Section>

      <Divider />
      <Section id="domains" tag="what gets posted"
        title="Every domain a growing team runs into."
        sub="Not a general freelance board — engineers verified per domain, matched to the task that actually needs their skill.">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {domains.map(([icon, name, desc]) => (
            <div key={name} className="flex flex-col gap-2 rounded-xl border border-white/[0.09] bg-[#0E1848] p-4 sm:p-[18px]">
              <span className="font-mono text-[#F0B31E]">{icon}</span>
              <b className="text-[14.5px]">{name}</b>
              <span className="text-sm text-white/60">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider />
      <Section id="trust" tag="how your code stays yours"
        title="Three checks run before anyone sees your file."
        sub="Not a policy buried in the terms — a gate the platform enforces on every single task.">
        <div className="grid gap-5 md:grid-cols-3">
          <TrustCard n="01" title="NDA, signed first" color="gold">
            A binding non-disclosure agreement is signed digitally before the engineer opens your file — not after, not on request.
          </TrustCard>
          <TrustCard n="02" title="Verified identity" color="green">
            Every engineer's identity and skill claims are checked before they can accept a task. No anonymous access.
          </TrustCard>
          <TrustCard n="03" title="Escrow, released by you" color="red">
            Payment sits in escrow until you confirm the fix works. If it doesn't, you raise a dispute — not a refund fight.
          </TrustCard>
        </div>
      </Section>

      <Divider />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.09] bg-[#050A30]/90 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1180px] items-center gap-7 px-5 py-3.5 sm:px-7">
        <div className="shrink-0 font-['Space_Grotesk'] text-lg font-bold">
          <span className="font-mono font-medium text-[#F0B31E]">{"{ }"}</span> TECH ENGI
        </div>
        <div className="hidden gap-6 text-sm text-white/60 min-[841px]:flex">
          <a href="#how-corp" className="hover:text-white">For companies</a>
          <a href="#how-eng" className="hover:text-white">For engineers</a>
          <a href="#domains" className="hover:text-white">Domains</a>
          <a href="#trust" className="hover:text-white">How it's protected</a>
        </div>
        <div className="ml-auto flex gap-2.5">
          <a href="#" className="rounded-[9px] border border-white/[0.16] px-4 py-2.5 text-sm font-semibold">Log in</a>
          <a href="#" className="rounded-[9px] bg-[#F0B31E] px-4 py-2.5 text-sm font-semibold text-[#1a1400]">Post a bug</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-[76px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_320px_at_82%_-6%,rgba(240,179,30,.10),transparent_65%),radial-gradient(700px_420px_at_10%_90%,rgba(29,158,117,.06),transparent_65%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-12 px-5 sm:px-7 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F0B31E]/30 bg-[#F0B31E]/[0.14] px-3 py-1.5 font-mono text-[13px] text-[#F0B31E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F0B31E]" /> India's engineering network
          </div>
          <h1 className="mb-5 max-w-none font-['Space_Grotesk'] text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.08] lg:max-w-[15ch]">
            Your bug doesn't wait for Monday.<br /><span className="text-[#F0B31E]">Neither do we.</span>
          </h1>
          <p className="mb-8 max-w-[46ch] text-[17.5px] leading-relaxed text-white/60">
            Post the exact thing that's broken. A verified engineer picks it up, fixes it in your environment, and you pay only when it works — from ₹500, with an NDA signed before they see a line of your code.
          </p>
          <div className="mb-8 flex flex-wrap gap-3.5">
            <a href="#" className="rounded-[9px] bg-[#F0B31E] px-6 py-3.5 text-[15px] font-semibold text-[#1a1400]">Post your first task</a>
            <a href="#" className="rounded-[9px] border border-white/[0.16] px-6 py-3.5 text-[15px] font-semibold">Join as an engineer</a>
          </div>
          <div className="flex flex-wrap gap-7">
            {[["5%", "platform fee, nothing hidden"], ["NDA", "signed before file access"], ["Escrow", "you release payment"]].map(([v, l]) =>
              <div key={v}><b className="block font-['Space_Grotesk'] text-[22px]">{v}</b><span className="text-xs text-white/40">{l}</span></div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0E1848] shadow-[0_30px_70px_-30px_rgba(0,0,0,.6)]">
          <div className="flex items-center gap-2 border-b border-white/[0.09] bg-white/[0.02] px-4 py-3">
            <i className="h-2.5 w-2.5 rounded-full bg-[#E0554F]" /><i className="h-2.5 w-2.5 rounded-full bg-[#F0B31E]" /><i className="h-2.5 w-2.5 rounded-full bg-[#1D9E75]" />
            <span className="ml-2 font-mono text-xs text-white/40">production.log</span>
          </div>
          <div className="space-y-2 px-5 py-5 font-mono text-[13px] leading-7">
            <div className="text-[#E0554F]">TypeError: Cannot read properties of undefined (reading 'map')</div>
            <div className="text-white/40">{"  "}at ProductList.render (ProductList.jsx:47)</div>
            <div className="text-white/40">{"  "}deploy cancelled — client demo in 9h 12m</div>
            <div className="my-3 h-px bg-white/[0.09]" />
            <LogRow left="Posted on Tech Engi" right="₹1,500" gold />
            <LogRow left="Matched — Senthil K." right="✓ verified" />
            <LogRow left="Fix delivered · 2h 40m" right="resolved" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LogRow({ left, right, gold }: { left: string; right: string; gold?: boolean }) {
  return <div className="flex items-center justify-between font-sans text-[13.5px]">
    <span>{left}</span>
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${gold ? "bg-[#F0B31E]/[0.14] text-[#F0B31E]" : "bg-[#1D9E75]/[0.15] text-[#4fdba8]"}`}>{right}</span>
  </div>;
}

function Section({ id, tag, title, sub, children }: { id: string; tag: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-14 sm:py-[74px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
        <div className="mb-11 max-w-[640px]">
          <div className="mb-3 font-mono text-[13px] text-[#F0B31E]">{tag}</div>
          <h2 className="mb-3.5 font-['Space_Grotesk'] text-[clamp(26px,3vw,36px)] font-bold leading-[1.16]">{title}</h2>
          <p className="max-w-[52ch] text-base text-white/60">{sub}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function PathCard({ gold, kicker, title, description, steps, button }: any) {
  return (
    <div className={`flex flex-col rounded-2xl border bg-[#0E1848] p-7 sm:p-8 ${gold ? "border-[#F0B31E]/35" : "border-white/[0.09]"}`}>
      <div className="mb-2.5 font-mono text-xs text-white/40">{kicker}</div>
      <h3 className="mb-3 font-['Space_Grotesk'] text-[23px] font-semibold">{title}</h3>
      <p className="mb-5 text-[15px] text-white/60">{description}</p>
      <div className="mb-6 flex flex-col gap-3.5">
        {steps.map(([n, t, d]: string[]) => (
          <div key={n} className="flex items-start gap-3">
            <span className="mt-px flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-white/5 font-mono text-xs text-white/60">{n}</span>
            <div><p className="mb-0.5 text-[14.5px] font-medium">{t}</p><span className="text-[13px] text-white/40">{d}</span></div>
          </div>
        ))}
      </div>
      <a href="#" className={`mt-auto self-start rounded-[9px] px-4 py-2.5 text-sm font-semibold ${gold ? "bg-[#F0B31E] text-[#1a1400]" : "border border-white/[0.16]"}`}>{button}</a>
    </div>
  );
}

function TrustCard({ n, title, children, color }: any) {
  const c: any = {
    gold: "bg-[#F0B31E]/[0.14] text-[#F0B31E]",
    green: "bg-[#1D9E75]/[0.15] text-[#4fdba8]",
    red: "bg-[#E0554F]/[0.14] text-[#ff8f8b]",
  };
  return <div className="rounded-2xl border border-white/[0.09] bg-[#0E1848] p-6">
    <div className={`mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[9px] font-mono ${c[color]}`}>{n}</div>
    <h4 className="mb-2 font-['Space_Grotesk'] text-[17px] font-semibold">{title}</h4>
    <p className="text-sm leading-relaxed text-white/60">{children}</p>
  </div>;
}

function Pricing() {
  const rows = [["Small fix", "₹500 – ₹1,500"], ["Production bug, overnight", "₹1,500 – ₹3,000"], ["Full module build", "₹3,000 – ₹8,000"], ["Engineer keeps", "95% of every payout"]];
  return <section id="pricing" className="py-14 sm:py-[74px]">
    <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
      <div className="grid items-center gap-9 rounded-2xl border border-white/[0.09] bg-[#0E1848] p-7 sm:p-9 md:grid-cols-[1.2fr_1fr]">
        <div><div className="font-['Space_Grotesk'] text-[56px] font-bold leading-none text-[#F0B31E]">5<span className="ml-2 text-[22px] font-medium text-white/60">% platform fee</span></div>
          <p className="mt-3.5 max-w-[40ch] text-white/60">The lowest fee of any verified freelance network in India. No listing fee. No bidding fee. No fee to browse tasks.</p>
        </div>
        <div>{rows.map(([a,b]) => <div key={a} className="flex justify-between border-b border-white/[0.09] py-2.5 text-sm last:border-0"><span className="text-white/60">{a}</span><span>{b}</span></div>)}</div>
      </div>
    </div>
  </section>;
}

function CTA() {
  return <section className="py-14 sm:py-[74px]"><div className="mx-auto max-w-[1180px] px-5 sm:px-7">
    <div className="rounded-[20px] border border-white/[0.09] bg-gradient-to-br from-[#0E1848] to-[#101d54] px-6 py-12 text-center sm:px-11">
      <h2 className="mb-3 font-['Space_Grotesk'] text-[clamp(26px,3vw,36px)] font-bold">Post the bug. Or pick up the work.</h2>
      <p className="mx-auto mb-7 max-w-[48ch] text-white/60">Free to register on either side. Your first task is a click away.</p>
      <div className="flex flex-wrap justify-center gap-3.5">
        <a href="#" className="rounded-[9px] bg-[#F0B31E] px-6 py-3.5 text-[15px] font-semibold text-[#1a1400]">Post your first task</a>
        <a href="#" className="rounded-[9px] border border-white/[0.16] px-6 py-3.5 text-[15px] font-semibold">Join as an engineer</a>
      </div>
    </div>
  </div></section>;
}

function Footer() {
  return <footer className="border-t border-white/[0.09] py-8"><div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-6 px-5 text-[13.5px] text-white/40 sm:px-7">
    <div><div className="font-['Space_Grotesk'] text-[15px] font-bold"><span className="font-mono text-[#F0B31E]">{"{ }"}</span> TECH ENGI</div><div className="mt-2">India's engineering network — operated by TSquareY1 OPC Private Limited.</div></div>
    <div className="flex gap-5"><a href="#how-corp">For companies</a><a href="#domains">Domains</a><a href="#trust">Security</a></div>
  </div></footer>;
}

function Divider() {
  return <div className="mx-auto max-w-[1180px] px-5 sm:px-7"><div className="border-t border-white/[0.09]" /></div>;
}
