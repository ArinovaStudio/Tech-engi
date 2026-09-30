import Image from "next/image";
import bg from "@/public/saas/tech-engi-students.png";

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
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="reveal relative overflow-hidden rounded-saas-6xl border border-saas-line bg-[#EEF2FB] p-7 sm:p-12 lg:p-20">
          {/* text + points (sits above the image) */}
          <div className="relative z-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-inset text-[clamp(2rem,5vw,2.7rem)]">
                Engineering students?{" "}
                <span className="text-saas-mut">Get real paid work, not just projects.</span>
              </h2>
              <p className="mt-6 text-sm">
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

            <ul className="grid list-none gap-5 p-0 text-base text-saas-ink sm:text-lg">
              {POINTS.map((pt) => (
                <li key={pt} className="flex items-start">
                  <span className="mr-3 mt-[0.45em] inline-block h-2.5 w-2.5 flex-none rounded-[3px] bg-saas-accent" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/*
            Image
            - below lg: sits in the flow under the content, bleeds to the card's bottom/side edges
              (negative margins match the card padding), aligned bottom-right
            - lg and up: same absolute bottom-right placement as before
          */}
          <div className="pointer-events-none -mx-7 -mb-7 mt-10 flex h-56 items-end justify-end sm:-mx-12 sm:-mb-12 sm:mt-12 sm:h-72 lg:absolute lg:-bottom-2 lg:-right-3 lg:m-0 lg:h-[70%] lg:w-1/2">
            <Image
              src={bg.src}
              width={bg.width}
              height={bg.height}
              alt="Engineering student"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-auto max-w-full object-contain object-right-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}