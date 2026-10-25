import Image from "next/image";
import pair from "@/public/saas/tech-engi-pair.png";

export default function ResultsSection() {
  return (
    <section id="results" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          Built to get bugs closed, <span className="text-saas-mut">not just logged.</span>
        </h2>

        <div className="bento">
          <div className="card reveal tile-top bento-3 bento-row-2 relative max-w-full *:max-w-[56%]">
            <h3>From reposted to resolved</h3>
            <p>
              Production issues, broken pipelines, or abandoned codebases: we diagnose the root cause and match the exact verified specialist for the fix, not just the symptom.
            </p>
            <div className="text-inset-soft mt-7 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              100%
            </div>
            <p>Aadhaar & PAN verified engineers with protected milestone escrow</p>
            <Image
              src={pair}
              alt="A robot fixing the missing part in the code"
              className="bento-image right-[2%] bottom-[-8%] w-[64%] max-w-none"
            />
          </div>

          <div className="card reveal tile-between bento-3">
            <div className="text-inset-soft text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              2–24 hrs
            </div>
            <p>typical time from posting to an AI-matched verified engineer</p>
          </div>

          <div className="card reveal tile-between bento-3">
            <div className="text-inset-soft text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-saas-ink">
              3%–5%
            </div>
            <p>platform fee for engineers (97% on 1st project, 95% after). Clients pay 0% fee.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
