import Header from "@/components/saas/Header";
import Hero from "@/components/saas/Hero";
import ExplainerSlidesSection from "@/components/saas/ExplainerSlidesSection";
import PromiseSection from "@/components/saas/PromiseSection";
import BudgetCalculatorSection from "@/components/saas/BudgetCalculatorSection";
import CategoriesSection from "@/components/saas/CategoriesSection";
import NashediSection from "@/components/saas/NashediSection";
import NeverPaySection from "@/components/saas/NeverPaySection";
import EscrowSection from "@/components/saas/EscrowSection";
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

export default function SaasLanding() {
  return (
    <div className={`saas-root ${figtree.variable} w-full overflow-x-clip`}>
      <SaasFilters />
      <SmoothScroll>
        <Header />

        <main id="top" className="w-full">
          <Hero />
          <ExplainerSlidesSection />
          {/*  */}
          <PromiseSection />
          <BudgetCalculatorSection />
          <CategoriesSection />
          <NashediSection />
          <NeverPaySection />
          <EscrowSection />b
          {/*  */}
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