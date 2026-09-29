const TAGS = [
  "Capstone projects",
  "Robotics contests",
  "Hackathons",
  "Science fairs",
  "Design challenges",
  "Research papers",
];

const POINTS = [
  "Real briefs from real companies",
  "Mentor support from working engineers",
  "Every project — keep 95% of what you earn",
];

export default function StudentsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="reveal rounded-saas-6xl border border-saas-line bg-[#EEF2FB] p-10 md:p-20">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-24">
            <div>
              <h2 className="text-inset text-[clamp(2.25rem,5vw,4rem)]">
                Engineering students?{" "}
                <span className="text-saas-mut">Get real paid work, not just projects.</span>
              </h2>
              <p className="mt-6 text-lg">
                Verified engineers on Tech Engi also take on student-friendly tasks — a way in
                before your first full-time role.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {TAGS.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ul className="grid list-none gap-5 p-0 text-lg text-saas-ink">
              {POINTS.map((pt) => (
                <li key={pt} className="flex items-center">
                  <span className="mr-3 inline-block h-2.5 w-2.5 flex-none rounded-[3px] bg-saas-accent" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}