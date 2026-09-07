"use client";

import AboutUs from "@/components/AboutUs";
import BrowserCategory from "@/components/BrowserCategory";
import Footer from "@/components/Footer";
import Start from "@/components/Start";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import WhatWeOffer from "@/components/WhatWeOffer";
import TrustIndicator from "@/components/TrustIndicator";
import EngineeringSolutions from "@/components/engineeringsolutions";
import BriefBox from "@/components/BriefBoxPanel";

export default function HomeClient() {
  return (
    <div>
      <div className="overflow-hidden">
        <Start />
        <HowItWorks />
        <div className="order-1 bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:order-2 lg:px-8 lg:py-10 dark:bg-background">
          <BriefBox />
        </div>
        <WhatWeOffer />
        <EngineeringSolutions />
        <TrustIndicator />
        <BrowserCategory />
        <Stats />
        <AboutUs />
        <Footer />
      </div>
    </div>
  );
}