"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import TabContent from "@/components/project/TabContent";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuth } from "@/hooks/useAuth";

const ENGINEER_TABS = ["Overview", "Tasks", "Milestones", "Credentials", "Assets", "Report Issue", "Chat"];

function getTabsForRole() {
  return ENGINEER_TABS;
}

function TabBar({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--border)] bg-white overflow-x-auto dark:bg-card">
      <Link href="/engineer/project" className="p-3 hover:bg-[var(--primary-light)] transition-colors shrink-0">
        <ArrowLeft size={18} className="text-[var(--text-muted)]" />
      </Link>
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            id={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative px-4 py-4 text-sm whitespace-nowrap transition-all duration-150 shrink-0
              ${isActive ? "text-[var(--primary)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
          >
            {tab}
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-t-full" />}
          </button>
        );
      })}
    </div>
  );
}

function RoleTabContent({ tab, project }: { tab: string; project: any }) {
  return <TabContent activeTab={tab} project={project} />;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");

  // Tracks whether the overview tour is handing off to the next tab.
  // When true, onDestroyed must NOT write the localStorage flag —
  // the chain is still in progress.
  const isHandingOffRef = useRef(false);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/overview/${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { setError(data.message || "Failed to load project"); return; }
        setProject(data.project);
        setActiveTab(getTabsForRole()[0]);
      })
      .catch(() => setError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Engineer Overview Tour
  useEffect(() => {
    if (!user?.id || loading || !project || activeTab !== "Overview") return;

    const tourKey = `tour_seen_engineer_project_${user.id}`;
    const forced = sessionStorage.getItem("force_tour") === "true";

    if (localStorage.getItem(tourKey) && !forced) return;

    // Do NOT clear force_tour here — downstream tab tours need it too.
    // It will be cleared by the final tab in the chain (Chat).

    const timer = setTimeout(() => {
      isHandingOffRef.current = false;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        popoverClass: "custom-tour-popover",
        overlayOpacity: 0.35,
        nextBtnText: "Next →",
        prevBtnText: "← Prev",
        doneBtnText: "Done ✓",
        onPopoverRender: (popover) => {
          const style = (el: HTMLElement) => {
            el.style.setProperty("background", "var(--primary)", "important");
            el.style.setProperty("color", "#ffffff", "important");
            el.style.setProperty("opacity", "1", "important");
            el.style.setProperty("border", "none", "important");
          };
          if (popover.nextButton) style(popover.nextButton);
          if (popover.previousButton) {
            popover.previousButton.style.setProperty("background", "transparent", "important");
            popover.previousButton.style.setProperty("color", "var(--text-secondary)", "important");
            popover.previousButton.style.setProperty("border", "1px solid var(--border)", "important");
          }
        },
        onDestroyed: () => {
          // Only mark as seen if the user finished/closed the tour normally.
          // If we're handing off to the next tab, skip — the chain isn't done.
          if (!isHandingOffRef.current) {
            localStorage.setItem(tourKey, "true");
            sessionStorage.removeItem("force_tour");
            sessionStorage.removeItem("tour_in_progress");
          }
        },
        steps: [
          {
            element: "#overall-progress",
            popover: {
              title: "Overall Progress",
              description: "Track how much of the project is complete. You can update this anytime by clicking the Update button here.",
            },
          },
          {
            element: "#engineer-card",
            popover: {
              title: "Your Client",
              description: "This shows who you're working with on this project — their name and contact info.",
            },
          },
          {
            element: "#project-summary-card",
            popover: {
              title: "Project Information",
              description: "Status, priority, description, earnings, dates, and final delivery link all live here.",
            },
          },
          {
            element: "#design-system",
            popover: {
              title: "Design System",
              description: "Brand name, color palette, typography, layout style, and visual guidelines the client expects you to follow.",
            },
          },
          {
            element: "#technology-used",
            popover: {
              title: "Technology Stack",
              description: "The frontend, backend, and other technologies required for this project.",
            },
          },
          {
            element: "#latest-task",
            popover: {
              title: "Work Done History",
              description: "A log of completed tasks tied to this project, with status and dates.",
              onNextClick: (_el: any, _step: any, opts: any) => {
                // Mark as handing off so onDestroyed skips the localStorage write
                isHandingOffRef.current = true;
                opts.driver.destroy();
                sessionStorage.setItem("tour_in_progress", "true");
                sessionStorage.setItem("start_kanban_tour", "true");
                setActiveTab("Tasks");
              },
            },
          },
        ],
      });

      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.id, loading, project, activeTab]);

  // Tab handoff listener — receives events from each tab's tour to advance
  // to the next tab and set the appropriate sessionStorage flag.
  useEffect(() => {
    const TAB_FLAGS: Record<string, string> = {
      Tasks: "start_kanban_tour",
      Milestones: "start_milestones_tour",
      Credentials: "start_credentials_tour",
      Assets: "start_assets_tour",
      "Report Issue": "start_report_issue_tour",
    };

    const handleTabHandoff = (e: Event) => {
      const targetTab = (e as CustomEvent).detail as string;
      const flag = TAB_FLAGS[targetTab];
      if (flag) sessionStorage.setItem(flag, "true");
      setActiveTab(targetTab);
    };

    window.addEventListener("tour-go-to-tab", handleTabHandoff);
    return () => window.removeEventListener("tour-go-to-tab", handleTabHandoff);
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
        </div>
      </DashboardShell>
    );
  }

  if (error || !project) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <p className="text-sm text-red-500">{error || "Project not found"}</p>
          <Link href="/dashboard/project" className="text-xs text-[var(--primary)] underline">
            ← Back to projects
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const tabs = getTabsForRole();
  return (
    <DashboardShell>
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] pb-4">{project.title}</h1>
        <TabBar tabs={tabs} active={activeTab} setActive={setActiveTab} />
        <div className="mt-6 px-2">
          <RoleTabContent tab={activeTab} project={project} />
        </div>
      </div>
    </DashboardShell>
  );
}