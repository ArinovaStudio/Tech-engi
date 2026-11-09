import type { Metadata } from "next";
import Header from "@/components/saas/Header";
import ProjectBriefFlow from "@/components/saas/ProjectBriefFlow";
import { figtree } from "@/components/saas/fonts";

export const metadata: Metadata = {
  title: "Start a Project · Tech Engi",
  description:
    "Tell Tech Engi what you need, choose how you want to work, and prepare a project brief for verified engineers.",
  robots: {
    index: false,
    follow: true,
  },
};

interface StartPageProps {
  searchParams: Promise<{
    category?: string | string[];
    mode?: string | string[];
    draft?: string | string[];
  }>;
}

export default async function StartPage({ searchParams }: StartPageProps) {
  const params = await searchParams;
  const initialCategory = typeof params.category === "string" ? params.category : undefined;
  const initialMode = typeof params.mode === "string" ? params.mode : undefined;
  const draftRequestId = typeof params.draft === "string" ? params.draft : "";

  return (
    <div className={`saas-root ${figtree.variable} min-h-screen bg-white`}>
      <Header />
      <ProjectBriefFlow
        key={`${initialCategory ?? ""}:${initialMode ?? ""}:${draftRequestId}`}
        initialCategory={initialCategory}
        initialMode={initialMode}
      />
    </div>
  );
}
