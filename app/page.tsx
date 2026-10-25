import type { Metadata } from "next";
import SaasLanding from "@/components/saas/SaasLanding";
import { HOMEPAGE_FAQS } from "@/components/saas/FaqSection";

export const metadata: Metadata = {
  title: "Tech Engi | India's First AI Match Freelance Platform",
  description:
    "Tech Engi connects founders, startups, and companies with verified Indian engineers for AI bug fixing, code takeovers, and ₹3,480 day-pass co-working.",
  alternates: {
    canonical: "https://techengi.in/",
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://techengi.in/#nashedi-ai",
      name: "Nashedi AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      description:
        "AI-driven matching assistant that pairs complex software engineering projects, bug fixes, and code takeovers with verified Indian engineers in 2 to 24 hours.",
      creator: {
        "@id": "https://techengi.in/#organization",
      },
    },
    {
      "@type": "Service",
      "@id": "https://techengi.in/#service-ai-matching",
      name: "AI Engineering Matching & Bug Resolution",
      provider: {
        "@id": "https://techengi.in/#organization",
      },
      serviceType: "Freelance Engineering Matching & Bug Fixing",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Engineering Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Co-Worker for a Day",
              description:
                "Dedicated verified engineer working full-day sprint on your codebase.",
            },
            price: "3480",
            priceCurrency: "INR",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Milestone Bug Fixing & Code Takeover",
              description:
                "AI-matched verified engineering with 0% client fee and milestone escrow protection.",
            },
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://techengi.in/#faq",
      mainEntity: HOMEPAGE_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <SaasLanding />
    </>
  );
}