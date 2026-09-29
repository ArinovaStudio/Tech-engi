const STATS = [
  { value: 12000, suffix: "+", label: "Verified engineers" },
  { value: 3400, suffix: "+", label: "Bugs & projects fixed" },
  { value: 1900, suffix: "+", label: "Half-built projects finished" },
  { value: 240, suffix: "+", label: "Student competition teams" },
];

export default function StatsBar() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="mt-10 grid grid-cols-2 rounded-saas-4xl border border-saas-line bg-white p-4 shadow-saas-panel sm:mt-14 sm:p-6 md:mt-[72px] md:grid-cols-4 md:p-10">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={[
              "px-3 py-6 text-center sm:px-6 md:py-2 md:text-left lg:px-8",
              // mobile (2x2): vertical divider on right column, horizontal on bottom row
              i % 2 === 1 ? "border-l border-saas-line md:border-l-0" : "",
              i >= 2 ? "border-t border-saas-line md:border-t-0" : "",
              // desktop (1x4): vertical divider between all but the first
              i > 0 ? "md:border-l md:border-saas-line" : "",
            ].join(" ")}
          >
            <b
              data-count={s.value}
              data-suffix={s.suffix}
              className="text-inset-soft block text-[clamp(1.75rem,6vw,3.3rem)] font-semibold leading-[1.1] tracking-[-0.04em] tabular-nums text-saas-ink"
            >
              0
            </b>
            <span className="mt-1 block text-sm text-balance sm:text-base">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}