"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import TabContent from "@/components/project/TabContent";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";   // ← Fixed import

// Tab definitions
const CLIENT_TABS = ["Overview", "Work Done", "Daily Taks", "Kanban", "Milestones", "Credentials", "Assets", "Report Issue", "Report Issue To Management", "Chat", "Payout"];
const ENGINEER_TABS = ["Overview", "Work Done", "Daily Taks", "Kanban", "Milestones", "Credentials", "Assets", "Report Issue", "Report Issue To Management", "Chat", "Payout"];
const ADMIN_TABS = ["Overview", "Work Done", "Daily Taks", "Kanban", "Milestones", "Credentials", "Assets", "Report Issue", "Report Issue To Management", "Chat", "Payout"];

function getTabsForRole(role: string) {
  if (role === "CLIENT") return CLIENT_TABS;
  if (role === "ENGINEER") return ENGINEER_TABS;
  return ADMIN_TABS;
}

function TabBar({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--border)] bg-white overflow-x-auto">
      <Link href="/dashboard/project" className="p-3 hover:bg-[var(--primary-light)] transition-colors shrink-0">
        <ArrowLeft size={18} className="text-[var(--text-muted)]" />
      </Link>
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative px-4 py-4 text-sm font-inter whitespace-nowrap transition-all duration-150 shrink-0
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

// Role-specific tab content
import ResourcesTab from "@/components/project/ResourcesTab";
import TicketsTab from "@/components/project/TicketsClientTab";
import ExtensionsTab from "@/components/project/ExtensionsTab";
import ChatTab from "@/components/project/ChatTab";

function RoleTabContent({ tab, project, role, invitations }: {
  tab: string;
  project: any;
  role: string;
  invitations?: any[];
}) {
  if (tab === "Chat") return <ChatTab projectId={project.id} />;
  if (tab === "Resources") return <ResourcesTab projectId={project.id} role={role} project={project} />;
  if (tab === "Tickets") return <TicketsTab projectId={project.id} />;
  if (tab === "Extensions") return <ExtensionsTab projectId={project.id} role={role} />;

  return <TabContent activeTab={tab} project={project} invitations={invitations} />;
}

// Main Component
export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: session } = useSession();
  const role = session?.user?.role ?? "";

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  const handleStartMatching = async () => {
    if (!project) return;

    setIsMatching(true);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Matching started! Finding best engineers...");
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      } else {
        toast.error(data.message || "Failed to start matching");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  useEffect(() => {
    if (!role || !projectId) return;

    const endpoint =
      role === "CLIENT" ? `/api/client/projects/${projectId}` :
        role === "ENGINEER" ? `/api/engineer/projects/${projectId}` :
          `/api/admin/project/${projectId}`;

    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message || "Failed to load project");
          return;
        }
        setProject(data.project);
        console.log("Project data loaded:", data.project);
        const tabs = getTabsForRole(role);
        setActiveTab(tabs[0]);
      })
      .catch(() => setError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [role, projectId]);

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
          <p className="text-sm font-inter text-red-500">{error || "Project not found"}</p>
          <Link href="/dashboard/project" className="text-xs font-inter text-[var(--primary)] underline">
            ← Back to projects
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const tabs = getTabsForRole(role);

  return (
    <DashboardShell>
      <div>
        {/* Project Header */}
        <div className="px-2 pt-2 pb-4 border-b border-[var(--border)] mb-0">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h1 className="text-lg font-bold font-id text-[var(--text-primary)]">{project.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-inter px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8]">
                  {project.status?.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] font-inter text-[var(--text-muted)]">
                  Progress: {project.progress ?? 0}%
                </span>
                {role === "CLIENT" && project.budget && (
                  <span className="text-[10px] font-inter text-[var(--text-muted)]">
                    Budget: ₹{project.budget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {!project.advancePaid && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    Complete advance payment to start matching
                  </p>
                  <p className="text-xs text-yellow-600">
                    Pay 40% to find best engineer
                  </p>
                </div>

                <button
                  // onClick={handlePayment}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm"
                >
                  Pay Now
                </button>
              </div>
            )}
            {project.advancePaid && project.status === "AWAITING_ADVANCE" && (
              <button
                onClick={handleStartMatching}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
              >
                Find Engineer
              </button>
            )}

            {project.status === "SEARCHING" && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={18} />
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Finding best engineers for your project...
                  </p>
                  <p className="text-xs text-blue-600">
                    AI is matching top candidates
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      <TabBar tabs={tabs} active={activeTab} setActive={setActiveTab} />

      <div className="mt-6 px-2">
        <RoleTabContent
          tab={activeTab}
          project={project}
          role={role}
          invitations={project.invitations}
        />
      </div>
    </div>
    </DashboardShell >
  );
}