export const HOMEPAGE_FAQS = [
  {
    q: "How are engineers verified before they see any project?",
    a: "Every engineer undergoes strict identity verification (Aadhaar & PAN), work experience review, and domain skills assessment before being approved on Tech Engi. Unverified users never receive client matches.",
  },
  {
    q: "How fast can an engineer actually start on my bug?",
    a: "Most projects receive an AI-matched engineer within 2 hours (outside limit 24 hours). Urgent production incidents are prioritized for rapid deployment.",
  },
  {
    q: "What is the platform fee, and who pays it?",
    a: "Clients pay 0% platform fee, 0% posting fee, and no monthly subscription. For engineers, our platform fee is just 3% on their first completed project and 5% thereafter — meaning engineers keep 97% on their first project and 95% after.",
  },
  {
    q: "Is my code, data, and IP protected with an NDA?",
    a: "Yes. Every engagement includes built-in NDA and intellectual property protection before code or credentials are exchanged. You retain 100% ownership of all work and code.",
  },
  {
    q: "Can Tech Engi support ongoing retainer contracts or full-day co-workers?",
    a: "Yes. In addition to single bug fixes, we offer dedicated retainers and a ₹3,480 Co-Worker for a Day service where a verified engineer works alongside you for a full sprint day.",
  },
  {
    q: "Can I bring a project that's already half built?",
    a: "Yes. Upload your repository, documents, and notes. Our engineers audit the codebase, isolate remaining tasks, and provide an actionable completion plan before any contract starts.",
  },
  {
    q: "How does milestone escrow work?",
    a: "Clients fund 25% upfront into a secure escrow account to begin work. Additional funds are deposited per milestone and released to the engineer only when you test and approve delivery.",
  },
  {
    q: "Who owns the finished work?",
    a: "You do. Full copyright, IP rights, and repository code belong entirely to the client upon milestone payment release.",
  },
  {
    q: "Is Tech Engi accessible for engineering students?",
    a: "Yes. Students can post projects, collaborate with verified mentors, and participate in capstone challenges and competitions at zero platform cost.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[820px] px-8">
        <h2 className="reveal">Questions, answered.</h2>
        <div className="reveal">
          {HOMEPAGE_FAQS.map((item) => (
            <details
              key={item.q}
              className="group border-b border-saas-line py-[26px] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none justify-between gap-5 text-[1.15rem] font-medium text-saas-ink after:content-['+'] after:text-saas-mut group-open:after:content-['–'] hover:text-saas-accent">
                {item.q}
              </summary>
              <p className="mt-3 max-w-[640px] leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
