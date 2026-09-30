import Image from "next/image";
import pair from "@/public/saas/tech-engi-pair.png"

export default function ResultsSection() {
  return (
    <section id="results" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          Built to get bugs closed, not just logged.<span className="text-saas-mut">over the line.</span>
        </h2>

        <div className="bento">
          <div className="card reveal tile-top bento-3 bento-row-2 relative max-w-full *:max-w-[56%]">
            <h3>From reposted to resolved</h3>
            <p>
              Production issues is our. We diagnose, isolate the root cause and put the right specialist on the fix, not just the symptom.
            </p>
            <div className="text-inset-soft mt-7 text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              3400+
            </div>
            <p> bugs and projects fixed </p>
            <Image
              src={pair}
              alt="A robot fixing the missing part in the code"
              className="bento-image right-[2%] bottom-[-8%] w-[64%] max-w-none"
            />
          </div>

          <div className="card reveal tile-between bento-3">
            <div className="text-inset-soft text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              24 hrs
            </div>
            <p>typical time from posting an issue to a matched engineer </p>
          </div>

          <div className="card reveal tile-between bento-3">
            <div className="text-inset-soft text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              5%
            </div>
            <p>one flat platform fee, no matter the project size </p>
          </div>
        </div>
      </div>
    </section>
  );
}
