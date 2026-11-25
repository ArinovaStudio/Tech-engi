import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Box,
  Briefcase,
  Bug,
  CheckCircle2,
  FileCheck2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Footer from "@/components/saas/Footer";
import Header from "@/components/saas/Header";
import { figtree } from "@/components/saas/fonts";
import CoWorkerBackground from "./CoWorkerBackground";
import CoWorkerIntake from "./CoWorkerIntake";
import styles from "./CoWorkerPage.module.css";

export const metadata: Metadata = {
  title: "Co-worker for 12 Hours",
  description:
    "Work with a verified Tech Engi engineer for the next 12 hours. Fix bugs, build features, revamp apps, or turn an idea into a working start.",
  alternates: {
    canonical: "https://techengi.in/co-worker",
  },
};

const reasons = [
  {
    number: "01",
    title: "Something is broken",
    icon: Bug,
    description:
      "Your AI tool tried. A human finds the real cause, fixes it for good, tests it, and hands it over working.",
    note: "Good for bugs, crashes, failed deploys, and payment or login errors.",
    className: styles.reasonLarge,
  },
  {
    number: "02",
    title: "You need to build something",
    icon: Box,
    description:
      "Ship the feature your team cannot fit into this sprint, with clear scope and a demo at the end.",
    note: "Good for features, integrations, dashboards, APIs, and client modules.",
    className: "",
  },
  {
    number: "03",
    title: "You have an idea",
    icon: Lightbulb,
    description:
      "Leave with a clear plan and a first working version, not another list of AI suggestions.",
    note: "Good for startup ideas, side projects, internal tools, and product questions.",
    className: "",
  },
  {
    number: "04",
    title: "Your app or site is old or slow",
    icon: Sparkles,
    description:
      "Give the app that runs your business a faster, cleaner, better-looking fresh start.",
    note: "Good for legacy code, slow pages, outdated design, and messy codebases.",
    className: styles.reasonHighlight,
  },
  {
    number: "05",
    title: "Learn while you build",
    icon: BookOpen,
    description:
      "Pair with an engineer, move your project forward, and understand how every part works.",
    note: "Good for students, junior developers, and founders learning to code.",
    className: "",
  },
  {
    number: "06",
    title: "A client deadline is close",
    icon: Briefcase,
    description:
      "Add focused engineering support when your team is full and the client work still needs to ship.",
    note: "Good for agencies, freelancers, and studios with overflow work.",
    className: "",
  },
];

const daySteps = [
  {
    number: "01",
    title: "Hour 0: Book and match",
    description: "Pay ₹870 to book. Most engineers are matched within 2 hours.",
  },
  {
    number: "02",
    title: "Hour 1: Set the scope",
    description: "Agree on the problem, the boundaries, and exactly what “done” means.",
  },
  {
    number: "03",
    title: "Hours 2–10: Build and update",
    description: "Your engineer works through the agreed scope and shares dashboard updates.",
  },
  {
    number: "04",
    title: "Hours 11–12: Test and hand over",
    description: "Test, explain, and demo the result. You approve the work before the remaining ₹2,610 is charged.",
  },
];

const audienceCards: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Founders", description: "Ship the feature investors or users are waiting for, without hiring.", icon: Rocket },
  { title: "Team leads & managers", description: "One developer short this sprint? Add one for a day. No hiring request.", icon: Users },
  { title: "Agencies & freelancers", description: "Client moved the deadline? Deliver on time and keep your margin.", icon: Briefcase },
  { title: "Students & builders", description: "Hackathon, final-year project or first startup. Build it and learn how.", icon: BookOpen },
  { title: "Business owners", description: "Website down, app slow, order form broken. Get it sorted today.", icon: Store },
  { title: "Idea people", description: "Not sure what to build yet? Leave with a plan and a first working version.", icon: Lightbulb },
];

const comparisonRows = [
  ["Starts", "Instantly", "Weeks", "Days of proposals", "Most matched within 2 hours"],
  ["Finishes the last 20%", "Often not", "Yes", "Depends", "Yes, scoped in hour 1"],
  ["Who owns the result", "No one", "Yes", "Sometimes", "Verified engineer, under NDA"],
  ["Your money", "Subscription", "Salary + notice period", "Bidding and fees", "₹3,480, held in escrow"],
];

const safetyCards: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Verified engineers", description: "ID and work history checked before anyone can take a booking.", icon: BadgeCheck },
  { title: "NDA before code", description: "Signed before your engineer sees a single file.", icon: FileCheck2 },
  { title: "Escrow payment", description: "Pay 25% to book. The rest is released only when you approve.", icon: WalletCards },
  { title: "You own it", description: "Code, designs and docs from your 12 hours are yours.", icon: ShieldCheck },
];

const questions = [
  {
    question: "When do my 12 hours start?",
    answer:
      "Your 12 hours run from booking, at any time of day. Most bookings are matched within 2 hours, and your engineer starts with a short scope call.",
  },
  {
    question: "What if 12 hours is not enough?",
    answer:
      "We scope the work in the first hour so it fits. If the task is bigger, we will tell you before you pay and you can book more hours or turn it into a full project.",
  },
  {
    question: "What if you cannot match me?",
    answer:
      "If we cannot match you with an engineer within 24 hours, your ₹870 is refunded.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Explain the problem in plain words. Your engineer handles the technical side and explains what they did.",
  },
  {
    question: "How does the engineer access my code?",
    answer:
      "Remotely, through tools you already use such as GitHub, GitLab, your server, or a shared screen, only after the NDA is signed.",
  },
  {
    question: "When do I pay the remaining ₹2,610?",
    answer:
      "Only after the work is handed over and you approve it. Until then, it is not charged.",
  },
];

export default function CoWorkerPage() {
  return (
    <div className={`${styles.page} saas-root ${figtree.variable}`}>
      <CoWorkerBackground />
      <Header />

      <main>
        <section className={styles.hero} aria-labelledby="co-worker-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>CO-WORKER · BY TECH ENGI</p>
              <h1 id="co-worker-title">
                Stuck? Get a verified engineer for the
                <span> next 12 hours.</span>
              </h1>
              <p className={styles.heroLead}>
                From the moment you book, a real engineer works with you to fix
                it, build it, revamp it, or figure out what to build. Scoped in
                the first hour so it is delivered by the twelfth.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="#booking">
                  Book my Co-worker <span aria-hidden="true">→</span>
                </Link>
                <Link className={styles.textLink} href="#why-title">
                  What can I get done?
                </Link>
              </div>
              <p className={styles.priceNote}>
                <strong>₹3,480</strong> for 12 hours · Pay ₹870 now to book
              </p>
            </div>

            <aside className={styles.dayCard} aria-label="A sample co-worker day">
              <div className={styles.dayCardTop}>
                <span className={styles.dayCardMark} aria-hidden="true">
                  te
                </span>
                <div>
                  <p className={styles.dayCardLabel}>If you book right now</p>
                  <p className={styles.dayCardSub}>12 hours · One engineer</p>
                </div>
              </div>
              <div className={styles.dayTimeline}>
                <div className={styles.dayTimelineItem}>
                  <span>Hour 0</span>
                  <p>Book with ₹870. Most matches within 2 hours.</p>
                </div>
                <div className={styles.dayTimelineItem}>
                  <span>Hour 1</span>
                  <p>Scope call: agree on what “done” means today.</p>
                </div>
                <div className={styles.dayTimelineItem}>
                  <span>Hr 2–10</span>
                  <p>Your engineer works, with updates on the dashboard.</p>
                </div>
                <div className={styles.dayTimelineItem}>
                  <span>Hr 11–12</span>
                  <p>Test, hand over, explain, and approve the work.</p>
                </div>
              </div>
              <div className={styles.offlineNote}>
                <span aria-hidden="true">✳</span>
                Verified engineer · NDA · Escrow · You own the work
              </div>
            </aside>
          </div>
          <div className={styles.heroFoot}>
            <span>VERIFIED ENGINEERS</span>
            <span aria-hidden="true">·</span>
            <span>NDA BEFORE CODE</span>
            <span aria-hidden="true">·</span>
            <span>MONEY HELD IN ESCROW</span>
            <span aria-hidden="true">·</span>
            <span>YOU OWN THE WORK</span>
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="why-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>PICK YOUR SITUATION</p>
            <h2 id="why-title">What do you need done in 12 hours?</h2>
            <p>
              Most people try an AI tool first. It gets them most of the way,
              and then they are stuck. Pick what sounds like you and see how
              your 12 hours would go.
            </p>
          </div>
          <div className={styles.reasonsGrid}>
            {reasons.map((reason) => (
              <article
                className={`${styles.reasonCard} ${reason.className}`}
                key={reason.number}
              >
                <span className={styles.reasonIcon} aria-hidden="true">
                  <reason.icon />
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
                <p className={styles.tryNote}>
                  <span>TRY THIS</span>
                  {reason.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="audience-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>WHO USES CO-WORKER</p>
            <h2 id="audience-title">Built for anyone with a deadline.</h2>
          </div>
          <div className={styles.audienceGrid}>
            {audienceCards.map(({ title, description, icon: Icon }) => (
              <article className={styles.audienceCard} key={title}>
                <span className={styles.audienceIcon} aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="human-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>WHY A HUMAN, WHY NOW</p>
            <h2 id="human-title">Your AI tool suggests. Your Co-worker delivers.</h2>
            <p>
              In the 2025 Stack Overflow survey, 66% of developers said they
              spend more time fixing AI code that is “almost right”, and 75%
              still ask a person when they do not trust the AI&apos;s answer.
            </p>
          </div>
          <div className={styles.comparisonWrap}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th scope="col">What matters</th>
                  <th scope="col">AI tool alone</th>
                  <th scope="col">Hiring someone</th>
                  <th scope="col">Freelance sites</th>
                  <th className={styles.comparisonUs} scope="col">
                    Tech Engi Co-worker
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, ai, hiring, freelance, coworker]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{ai}</td>
                    <td>{hiring}</td>
                    <td>{freelance}</td>
                    <td className={styles.comparisonUs}>
                      <CheckCircle2 aria-hidden="true" />
                      {coworker}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="safety-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>YOUR ₹3,480 IS PROTECTED</p>
            <h2 id="safety-title">Safe by default.</h2>
          </div>
          <div className={styles.safetyGrid}>
            {safetyCards.map(({ title, description, icon: Icon }) => (
              <article className={styles.safetyCard} key={title}>
                <span className={styles.safetyIcon} aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className={styles.safetyPositive}>
                  <CheckCircle2 aria-hidden="true" />
                  Included
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.processSection}
          id="how-it-works"
          aria-labelledby="process-title"
        >
          <div className={styles.processHeading}>
            <p className={styles.eyebrow}>YOUR 12 HOURS</p>
            <h2 id="process-title">How the work runs</h2>
            <p>One engineer, a clear scope, and a delivered handover by hour 12.</p>
          </div>
          <ol className={styles.steps}>
            {daySteps.map((step) => (
              <li className={styles.step} key={step.number}>
                <span className={styles.stepNumber}>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <CoWorkerIntake />

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.faqIntro}>
            <p className={styles.eyebrow}>GOOD TO KNOW</p>
            <h2 id="faq-title">A few useful answers.</h2>
          </div>
          <div className={styles.faqList}>
            {questions.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
