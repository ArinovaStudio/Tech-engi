import {
  SquaresFour,
  Briefcase,
  GraduationCap,
} from "@phosphor-icons/react/dist/ssr";

const AUDIENCE = [
  {
    icon: SquaresFour,
    title: "Engineers",
    body: "Find projects that match your skills. Take paid work, join a team, or finish your own build with a partner.",
  },
  {
    icon: Briefcase,
    title: "Clients",
    body: "Bring an idea or a half-built prototype. Tech Engi scopes it, matches engineers and tracks every milestone.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    body: "Get mentors, teammates and real briefs for coursework, capstones and competitions.",
  },
];

export default function AudienceSection() {
  return (
    <section
      id="who"
      className="relative dot-grid pt-16 sm:pt-20 md:pt-[104px]"
    >
      <div className="section-glow" />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="reveal max-w-[1100px] text-balance text-[clamp(1.75rem,6vw,3rem)] text-saas-mut font-semibold leading-[1.1] md:leading-[1.05]">
          Whether it&apos;s a{" "}
          <span className="text-[#14244a]">production bug</span>, a{" "}
          <span className="text-[#14244a]">half-built project</span>, or a <span className="text-[#14244a]">business </span> that
          needs an engineer fast — there&apos;s someone ready right now.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:mt-[60px] md:grid-cols-3 md:gap-6">
          {AUDIENCE.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card reveal">
              <span className="icon-tile">
                <Icon size={26} weight="regular" color="#4F6BEA" />
              </span>

              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
