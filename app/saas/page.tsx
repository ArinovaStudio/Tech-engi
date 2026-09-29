import type { Metadata } from "next";
import SaasLanding from "@/components/saas/SaasLanding";

// Review route for the new landing. Not indexed and not in the sitemap until it replaces "/".
export const metadata: Metadata = {
  title: "Get projects built. Get projects finished.",
  description:
    "Tech Engi brings clients, engineers and students into one workspace. Start a project from zero, or hand over one that stalled halfway.",
  robots: { index: false, follow: false },
};

export default function SaasPage() {
  return <SaasLanding />;
}
