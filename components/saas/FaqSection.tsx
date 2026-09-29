const FAQS = [
  {
    q:"How are engineer's verified before they see any project?",
    a:"Every engineer goes through identity verification, a skills assessment in their domain, and a review of past work before they're allowed on the platform. Only verified engineers can see and respond to posted projects — nobody unverified gets access."
  },
  {
    q:"How fast can an engineer actually start on my bug ?",
    a:"Most bugs get a matched engineer within 24 hours of posting. Critical production issues are prioritized and can be matched in a few hours. You get a clear time estimate before you confirm anything.",
  },
  {
    q:"What’s the 5% fee based on, and are there other charges?",
    a:"5% of the total project value, taken once when the project is paid. No sign-up fee, no monthly subscription, no charge for browsing or posting. What you agree on the invoice is what gets paid — 5% comes off the top, the rest goes to the engineer.",
  },
  {
    q:"Is my code, data and NdA protected on the platform?",
    a:"Yes. Every project is covered by an NDA between you and the matched engineer before any file or access is shared. Code and data stay within the shared workspace and aren't visible to anyone outside your project.",
  },
  {
    q:"Can tech Engi support an ongoing corporate contract , not just one-off fixes ?",
    a:"Yes. Beyond single bug fixes, Tech Engi can set up a recurring support arrangement — a dedicated engineer or small team on retainer for ongoing maintenance, monitoring, or ad hoc fixes over months rather than a single task.",
  },
  {
    q: "Can I bring a project that's already half built?",
    a: "Yes. Upload your files and notes, and engineers will audit the work and list what's left before anyone is hired.",
  },
  {
    q: "How are engineers vetted?",
    a: "Every engineer submits a portfolio and completes a skill review before they can accept paid work.",
  },
  {
    q: "How do payments work?",
    a: "You fund each milestone up front. The money is held and released to the engineer when you approve the delivery.",
  },
  {
    q: "Who owns the finished work?",
    a: "You do, unless a collaboration agreement says otherwise. IP and NDA templates are built into every project.",
  },
  {
    q: "Is Tech Engi free for students?",
    a: "Yes. Students can post projects, find teammates and join competitions at no cost.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[820px] px-8">
        <h2 className="reveal">Questions, answered.</h2>
        <div className="reveal">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group border-b border-saas-line py-[26px] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none justify-between gap-5 text-[1.15rem] font-medium text-saas-ink after:content-['+'] after:text-saas-mut group-open:after:content-['–'] hover:text-saas-accent">
                {item.q}
              </summary>
              <p className="mt-3 max-w-[640px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
