import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/saas/Footer";
import Header from "@/components/saas/Header";
import { figtree } from "@/components/saas/fonts";
import CoWorkerBackground from "./CoWorkerBackground";
import CoWorkerIntake from "./CoWorkerIntake";
import styles from "./CoWorkerPage.module.css";

export const metadata: Metadata = {
  title: "Co-worker for a Day",
  description:
    "Work with a verified Tech Engi engineer for one focused day. Clear bugs, move your backlog, and finish with a useful handover.",
  alternates: {
    canonical: "https://techengi.in/co-worker",
  },
};

const reasons = [
  {
    number: "01",
    title: "The pile keeps getting taller",
    description:
      'Forty tabs, nine half-fixed bugs, one deadline. A second pair of hands can turn "in progress" into a list that ends.',
    note: "Choose the three things that would make tomorrow a win.",
    className: styles.reasonLarge,
  },
  {
    number: "02",
    title: "One ticket you keep avoiding",
    description:
      "Hand over the task you have reread five times. Getting it moving can make the rest of the day feel lighter.",
    note: "Put the task you dread at the top of your brief.",
    className: "",
  },
  {
    number: "03",
    title: "Your hands-on time disappeared",
    description:
      "Keep the decisions only you can make. Delegate the building, tests, and cleanup that have been waiting.",
    note: 'Write down what "done" looks like in five lines.',
    className: "",
  },
  {
    number: "04",
    title: "You want your evening back",
    description:
      "Book ahead of a trip, an anniversary, or just a Friday you would rather spend away from Slack.",
    note: "Ask for the handover by 5:30 pm, then switch off at 6.",
    className: styles.reasonHighlight,
  },
];

const daySteps = [
  {
    number: "01",
    title: "Book your day",
    description: "Pay in full, or reserve a future date with a 25% advance.",
  },
  {
    number: "02",
    title: "Share the context",
    description: "Send a short brief and the files or repository access needed.",
  },
  {
    number: "03",
    title: "Align for 15 minutes",
    description: "Agree on priorities, boundaries, and what a useful finish means.",
  },
  {
    number: "04",
    title: "Get focused help",
    description: "Your engineer works through the agreed list and shares updates.",
  },
  {
    number: "05",
    title: "Review the handover",
    description: "Finish with what changed, what remains, and what to check next.",
  },
];

const questions = [
  {
    question: "How much can one engineer get done in a day?",
    answer:
      "One engineer works for about eight hours on the tasks in your brief. We agree on the list during the 15-minute call. If something is bigger than a day, we will say so and focus on what is useful to finish.",
  },
  {
    question: "Can I use a co-worker day for non-coding work?",
    answer:
      "It is best for code, bugs, tests, documentation, electronics, and embedded debugging. Share what you need in the brief so we can confirm it before you pay the balance.",
  },
  {
    question: "Is my code safe?",
    answer:
      "An NDA is signed before any file is opened. Share only what is needed, leave out passwords and customer data, and use test keys.",
  },
  {
    question: "How does the advance refund work?",
    answer:
      "If you reserve a future date with the 25% advance and do not use the day, you can move it to another date or get the advance back in full. This does not apply to pay-in-full bookings once work has started.",
  },
  {
    question: "What do I receive at the end?",
    answer:
      "A handover note covering what changed, what remains, and what to check, along with the code changes in your repository or a zip.",
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
              <p className={styles.eyebrow}>TECH ENGI / CO-WORKER DAY</p>
              <h1 id="co-worker-title">
                Hand us your Tuesday.
                <span> Keep your evening.</span>
              </h1>
              <p className={styles.heroLead}>
                For one working day, a Tech Engi engineer sits in your corner:
                fixing bugs, clearing the backlog, and writing what you keep
                postponing. You get a handover note and your time back.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="#booking">
                  See the day-pass options <span aria-hidden="true">→</span>
                </Link>
                <Link className={styles.textLink} href="#how-it-works">
                  How it works
                </Link>
              </div>
              <p className={styles.priceNote}>
                One full working day <strong>₹3,480</strong>
              </p>
            </div>

            <aside className={styles.dayCard} aria-label="A sample co-worker day">
              <div className={styles.dayCardTop}>
                <span className={styles.dayCardMark} aria-hidden="true">
                  te
                </span>
                <div>
                  <p className={styles.dayCardLabel}>A focused workday</p>
                  <p className={styles.dayCardSub}>One engineer. Your priorities.</p>
                </div>
              </div>
              <div className={styles.dayTimeline}>
                <div className={styles.dayTimelineItem}>
                  <span>09:15</span>
                  <p>Agree on the day&apos;s priorities</p>
                </div>
                <div className={styles.dayTimelineItem}>
                  <span>09:30</span>
                  <p>Focused work begins</p>
                </div>
                <div className={styles.dayTimelineItem}>
                  <span>17:30</span>
                  <p>Review the handover together</p>
                </div>
              </div>
              <div className={styles.offlineNote}>
                <span aria-hidden="true">✳</span>
                Make room for your evening.
              </div>
            </aside>
          </div>
          <div className={styles.heroFoot}>
            <span>ONE ENGINEER</span>
            <span aria-hidden="true">·</span>
            <span>ONE WORKING DAY</span>
            <span aria-hidden="true">·</span>
            <span>A CLEAR HANDOVER</span>
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="why-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>A LITTLE ROOM TO BREATHE</p>
            <h2 id="why-title">The work isn&apos;t the problem. The pile is.</h2>
            <p>
              Hand off the doing. Keep the deciding. Here are a few ways a
              co-worker day can help.
            </p>
          </div>
          <div className={styles.reasonsGrid}>
            {reasons.map((reason) => (
              <article
                className={`${styles.reasonCard} ${reason.className}`}
                key={reason.number}
              >
                <span className={styles.reasonNumber}>{reason.number}</span>
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

        <section
          className={styles.processSection}
          id="how-it-works"
          aria-labelledby="process-title"
        >
          <div className={styles.processHeading}>
            <p className={styles.eyebrow}>A SIMPLE PLAN</p>
            <h2 id="process-title">How the day works</h2>
            <p>Know what is happening, from the first brief to the final note.</p>
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
