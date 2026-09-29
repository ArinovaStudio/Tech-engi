import Header from "@/components/saas/Header";
import Hero from "@/components/saas/Hero";
import StatsBar from "@/components/saas/StatsBar";
import AudienceSection from "@/components/saas/AudienceSection";
import SplitFeature from "@/components/saas/SplitFeature";
import StudentsSection from "@/components/saas/StudentsSection";
import BuildTypesSection from "@/components/saas/BuildTypesSection";
import ProcessSection from "@/components/saas/ProcessSection";
import FeaturesTabs from "@/components/saas/FeaturesTabs";
import WorkspaceSection from "@/components/saas/WorkspaceSection";
import TestimonialsSection from "@/components/saas/TestimonialsSection";
import ResultsSection from "@/components/saas/ResultsSection";
import LeadsSection from "@/components/saas/LeadsSection";
import FaqSection from "@/components/saas/FaqSection";
import CtaSection from "@/components/saas/CtaSection";
import Footer from "@/components/saas/Footer";
import SaasFilters from "@/components/saas/SaasFilters";
import SmoothScroll from "@/components/saas/SmoothScroll";
import ScrollAnimations from "@/components/saas/ScrollAnimations";
import { figtree } from "@/components/saas/fonts";

import techEngiFix from "@/public/saas/tech-engi-fix.png";
import pair from "@/public/saas/tech-engi-pair.png";
import techEngiai from "@/public/saas/tech-engi-ai.png";

export default function SaasLanding() {
  return (
    <div className={`saas-root ${figtree.variable} w-full overflow-x-clip`}>
      <SaasFilters />
      <SmoothScroll>
        <Header />

        <main id="top" className="w-full">
          <Hero />
          <StatsBar />
          <AudienceSection />

          <SplitFeature
            image={techEngiFix}
            alt="A robot fixing an issue"
            heading="Production down?"
            highlight="Hand us the problem."
            body="Post the problem. Get matched with a verified engineer in hours. Pay only when it’s fixed, with just a 5% platform fee."
            points={[
              "A written plan with timeline and fixed cost",
              "Engineers matched by domain, not keywords",
              "Pay only when it’s fixed — 5% fee, nothing hidden",
            ]}
          />

          <SplitFeature
            image={techEngiai}
            alt="An AI brain"
            heading="System broken?"
            highlight="We find out why — and fix it."
            body="Upload logs, code, error reports and config files. Verified engineers audit the issues, isolate the root cause, and fix it — not just patch the symptom."
            points={[
              "A real diagnosis of what broke and why",
              "Specialist matched to your exact tech stack",
              "One shared workspace — full visibility, NDA protected",
            ]}
            reverse
            rotateOnScroll
          />

          <SplitFeature
            image={pair}
            alt="A robot fixing an issue within the code"
            heading="Team overloaded?"
            highlight="Bring in backup — instantly."
            body="Post the exact task your team can’t get to. NDA-protected engineers step in and work inside your existing tools, then hand off cleanly when done."
            points={[
              "Post the gap, not the whole project",
              "Fixed cost agreed before anyone starts",
              "Review and approve without the platform",
            ]}
          />

          <StudentsSection />
          <BuildTypesSection />
          <ProcessSection />
          <FeaturesTabs />
          <WorkspaceSection />
          <TestimonialsSection />
          <ResultsSection />
          <LeadsSection />
          <FaqSection />
          <CtaSection />
        </main>

        <Footer />
      </SmoothScroll>
      <ScrollAnimations />
    </div>
  );
}