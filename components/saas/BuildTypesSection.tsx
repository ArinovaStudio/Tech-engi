import Image from "next/image";
import gyroscope from "@/public/saas/gyroscope.png";
import fix from "@/public/saas/tech-engi-fix.png";
import cloud from "@/public/saas/tech-engi-cloud.png";

export default function BuildTypesSection() {
  return (
    <section id="build" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="reveal max-w-[820px] text-balance text-[clamp(1.75rem,6vw,3.9rem)] leading-[1.1]">
          Every domain. <span className="text-saas-mut">One 24-hour response.</span>
        </h2>
        <p className="reveal mt-4 text-base sm:text-lg">
          From a production outage to a hardware redesign — post it here and get matched with
          someone who’s already fixed exactly this.
        </p>

        <div className="bento">
          {/* Software & bug fixing */}
          <div className="card reveal tile-top bento-3 bento-row-2 relative overflow-hidden">
            <h3 className="text-2xl md:text-[1.7rem]">Software & bug fixing</h3>
            <p className="text-base md:text-[1.1rem]">
              Production outages, stubborn bugs and broken releases, fixed by engineers who have
              seen it before.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
              {["Outages", "Debugging", "Performance", "Code review"].map((t) => (
                <span key={t} className="tag-chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex justify-center md:contents">
              <Image
                src={fix}
                alt="Software and bug fixing"
                sizes="(min-width: 768px) 30vw, 90vw"
                className="bento-image left-[12%] bottom-[-6%] !static h-auto !w-full !max-w-[420px] md:!absolute md:!w-[60%] md:!max-w-none"
              />
            </div>
          </div>

          {/* Cloud & DevOps */}
          <div className="card reveal tile-top bento-3 relative overflow-hidden md:[&>*]:max-w-[46%]">
            <h3 className="text-2xl md:text-[1.7rem]">Cloud & DevOps</h3>
            <p className="text-base md:text-[1.1rem]">
              Deployments, pipelines and infrastructure that need to work today, not next sprint.
            </p>
            <div className="mt-6 flex justify-center md:contents">
              <Image
                src={cloud}
                alt="Cloud and DevOps"
                sizes="(min-width: 768px) 25vw, 80vw"
                className="bento-image right-[-3%] bottom-[-16%] !static h-auto !w-full !max-w-[360px] md:!absolute md:!w-[54%] md:!max-w-none"
              />
            </div>
          </div>

          {/* Embedded & IoT */}
          <div className="card reveal tile-top bento-3 relative overflow-hidden md:[&>*]:max-w-[46%]">
            <h3 className="text-2xl md:text-[1.7rem]">Embedded & IoT</h3>
            <p className="text-base md:text-[1.1rem]">
              Firmware, connectivity and edge devices, from one board to a fleet.
            </p>
            <div className="mt-6 flex justify-center md:contents">
              <Image
                src={gyroscope}
                alt="Embedded and IoT"
                sizes="(min-width: 768px) 20vw, 60vw"
                className="bento-image right-[2%] bottom-[-18%] !static h-auto !w-full !max-w-[280px] md:!absolute md:!w-[44%] md:!max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}