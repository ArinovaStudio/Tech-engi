import AboutUs from "@/components/AboutUs";
import BrowserCategory from "@/components/BrowserCategory";
import Footer from "@/components/Footer";
import Start from "@/components/Start";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import WhatWeOffer from "@/components/WhatWeOffer";
import TrustIndicator from "@/components/TrustIndicator";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Start />
      <HowItWorks />
      <WhatWeOffer />
      <TrustIndicator />
      <BrowserCategory />
      <Stats />
      <AboutUs />
      <Footer />
    </div>
  );
}
