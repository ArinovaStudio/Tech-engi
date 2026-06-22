"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import TabContent from "@/components/project/TabContent";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuth } from "@/hooks/useAuth";

// Tab definitions
const ENGINEER_TABS = ["Overview", "Tasks", "Milestones", "Credentials", "Assets", "Report Issue", "Chat"];

function getTabsForRole() {
  return ENGINEER_TABS;
}

function TabBar({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--border)] bg-white overflow-x-auto">
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
            className={`relative px-4 py-4 text-sm  whitespace-nowrap transition-all duration-150 shrink-0
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

function RoleTabContent({ tab, project }: {
  tab: string;
  project: any;
}) {
  return <TabContent activeTab={tab} project={project} />;
}

// Main Component
export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!projectId) return;
    const endpoint = `/api/overview/${projectId}`;
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message || "Failed to load project");
          return;
        }
        setProject(data.project);
        const tabs = getTabsForRole();
        setActiveTab(tabs[0]);
      })
      .catch(() => setError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Engineer Overview Tour
  useEffect(() => {
    if (!user?.id || loading || !project || activeTab !== "Overview") return;
    const tourKey = `tour_seen_engineer_project_${user.id}`;
    if (localStorage.getItem(tourKey)) return;

    const timer = setTimeout(() => {
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
          localStorage.setItem(tourKey, "true");
        },
        steps: [
          { element: "#overall-progress", popover: { title: "Overall Progress", description: "Track how much of the project is complete. You can update this anytime by clicking the Update button here." } },
          { element: "#engineer-card", popover: { title: "Your Client", description: "This shows who you're working with on this project — their name and contact info." } },
          { element: "#project-summary-card", popover: { title: "Project Information", description: "Status, priority, description, earnings, dates, and final delivery link all live here." } },
          { element: "#design-system", popover: { title: "Design System", description: "Brand name, color palette, typography, layout style, and visual guidelines the client expects you to follow." } },
          { element: "#technology-used", popover: { title: "Technology Stack", description: "The frontend, backend, and other technologies required for this project." } },
          { element: "#latest-task", popover: { title: "Work Done History", description: "A log of completed tasks tied to this project, with status and dates." } },

          // Tab walkthrough — describing each tab without navigating away
          { element: "#tab-tasks", popover: { title: "Tasks", description: "Your kanban board — manage and track individual tasks for this project." } },
          { element: "#tab-milestones", popover: { title: "Milestones", description: "Key project checkpoints. Mark milestones complete as you hit them." } },
          { element: "#tab-credentials", popover: { title: "Credentials", description: "Secure access details (logins, API keys, etc.) shared by the client for this project." } },
          { element: "#tab-assets", popover: { title: "Assets", description: "Files, designs, and other assets shared for the project." } },
          { element: "#tab-report-issue", popover: { title: "Report Issue", description: "Raise a ticket if you hit a payment, technical, or communication issue on this project." } },
          { element: "#tab-chat", popover: { title: "Chat", description: "Message your client directly from here." } },
        ],
      });

      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.id, loading, project, activeTab]);

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
          <p className="text-sm  text-red-500">{error || "Project not found"}</p>
          <Link href="/dashboard/project" className="text-xs  text-[var(--primary)] underline">
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
        {/* Project Header */}
        <h1 className="text-lg font-bold  text-[var(--text-primary)] pb-4">{project.title}</h1>
        <TabBar tabs={tabs} active={activeTab} setActive={setActiveTab} />
        <div className="mt-6  px-2">
          <RoleTabContent
            tab={activeTab}
            project={project}
          />
        </div>
      </div>
    </DashboardShell >
  );
}