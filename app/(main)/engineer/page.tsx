"use client";
import { useEffect, useState, useCallback } from "react";
import { Eye, ReceiptText, Activity, CheckCircle, Mail } from "lucide-react";
import StatCard, { Period } from "@/components/dashboard/StatCard";
import ProjectDistribution from "@/components/dashboard/ProjectDistribution";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DashboardShell from "@/components/layout/DashboardShell";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ProjectProgress from "@/components/engineer/dashboard/ProjectProgress";
import ModernCalendar from "@/components/engineer/dashboard/ModernCalendar";
import TicketCard from "@/components/engineer/dashboard/TicketCard";
import InvitationCard from "@/components/engineer/dashboard/InvitationCard";
import DailyScheduleCard from "@/components/engineer/dashboard/DailyScheduleCard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface AnalyticsData {
  overview: { totalAssigned: number; completedProjects: number; newInvitations: number };
  periodStats: { projects: number; completed: number; earnings: number; potential: number };
  financials: { totalEarned: number; totalPending: number; totalPotentialEarnings: number };
  revenueChart: { monthly: any[]; yearly: any[]; weekly: any[] };
  projectDistribution: { name: string; value: number }[];
}

interface Ticket {
  id: string;
  issueType: string;
  status: string;
  description: string;
  createdAt: string;
}

interface Project {
  tickets: Ticket[];
}

const statusOrder = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CLOSED: 3,
};

type CardKey = "projects" | "revenue" | "received" | "pending";

export default function EngineerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<Record<CardKey, Period>>({
    projects: "monthly",
    revenue: "monthly",
    received: "monthly",
    pending: "monthly",
  });
  // cache fetched data per period to avoid redundant calls
  const [cache, setCache] = useState<Record<string, AnalyticsData>>({});

  const { data: projectsData, isLoading: projectsLoading, mutate } = useSWR("/api/engineer/perengineer-projects", fetcher);
  const { data: invitationsData } = useSWR("/api/engineer/invitation-engineer", fetcher);
  // console.log(invitationsData, "invitationsData");
  const { user } = useAuth();

  // Handoff: Engineer Dashboard → Engineer Projects page
  const goToProjectsTour = () => {
    sessionStorage.setItem("tour_in_progress", "true");
    sessionStorage.setItem("start_engineer_projects_tour", "true");
    router.push("/engineer/project");
  };

  const driverConfig = () => ({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverClass: "custom-tour-popover",
    overlayOpacity: 0.35,
    nextBtnText: "Next →",
    prevBtnText: "← Prev",
    doneBtnText: "Done ✓",
    onPopoverRender: (popover: any) => {
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
  });

  const buildTourSteps = () => [
    {
      element: "#engineer-calendar",
      popover: {
        title: "Project Calendar",
        description:
          "See all your project deadlines plotted on a calendar. Click any date to view which projects are due — hover a project to see its status, progress, and priority.",
      },
    },
    {
      element: "#engineer-invitations",
      popover: {
        title: "Project Invitations",
        description:
          "New project matches assigned to you by the admin appear here. Review the project details and earnings, then accept or reject — respond quickly since it's first come, first served.",
        onNextClick: (_el: any, _step: any, opts: any) => {
          opts.driver.destroy();
          goToProjectsTour();
        },
      },
    },
  ];

  // Auto-run once per user on first visit
  useEffect(() => {
    if (!user?.id || loading) return;
    const tourKey = `tour_seen_engineer_dashboard_${user.id}`;
    const forced = sessionStorage.getItem("force_tour") === "true";

    // Skip if already seen AND not force-triggered from Start Tour button
    if (localStorage.getItem(tourKey) && !forced) return;

    // Clear the force flag — it's consumed now
    if (forced) sessionStorage.removeItem("force_tour");

    const timer = setTimeout(() => {
      const driverObj = driver({
        ...driverConfig(),
        onDestroyed: () => {
          localStorage.setItem(tourKey, "true");
        },
        steps: buildTourSteps(),
      });
      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [user?.id, loading]);

  // Manual "Start Tour" button trigger — no localStorage gate, always runs
  useEffect(() => {
    const handleManualTour = () => {
      const driverObj = driver({
        ...driverConfig(),
        steps: buildTourSteps(),
      });
      driverObj.drive();
    };
    window.addEventListener("start-engineer-dashboard-tour", handleManualTour);
    return () => window.removeEventListener("start-engineer-dashboard-tour", handleManualTour);
  }, []);

  const fetchAnalytics = useCallback(async (period: Period) => {
    if (cache[period]) {
      setData(cache[period]);
      return;
    }
    try {
      const res = await fetch(`/api/engineer/analytics?period=${period}`);
      const json = await res.json();
      if (json.success) {
        // shape revenueChart into { monthly, yearly, weekly } keyed object
        const shaped: AnalyticsData = {
          ...json.data,
          revenueChart: { [period]: json.data.revenueChart },
        };
        setCache(prev => ({ ...prev, [period]: shaped }));
        setData(shaped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Fetch for each card's period independently
  const [cardData, setCardData] = useState<Record<CardKey, AnalyticsData | null>>({
    projects: null, revenue: null, received: null, pending: null,
  });

  const fetchForCard = useCallback(async (card: CardKey, period: Period) => {
    try {
      const res = await fetch(`/api/engineer/analytics?period=${period}`);
      const json = await res.json();
      if (json.success) {
        setCardData(prev => ({ ...prev, [card]: { ...json.data, revenueChart: { [period]: json.data.revenueChart } } }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // initial load for all cards with default monthly
    const init = async () => {
      const res = await fetch(`/api/engineer/analytics?period=monthly`);
      const json = await res.json();
      if (json.success) {
        const shaped: AnalyticsData = { ...json.data, revenueChart: { monthly: json.data.revenueChart } };
        setCardData({ projects: shaped, revenue: shaped, received: shaped, pending: shaped });
        setData(shaped);
      }
      setLoading(false);
    };
    init();
  }, []);

  function handlePeriodChange(card: CardKey, period: Period) {
    setPeriods(prev => ({ ...prev, [card]: period }));
    fetchForCard(card, period);
  }

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // For charts, use revenue card's period
  const revPeriod = periods.revenue;
  const revData = cardData.revenue?.revenueChart?.[revPeriod] || [];
  const totalRevenue = cardData.revenue?.financials?.totalPotentialEarnings || 0;
  const distribution = data?.projectDistribution || [];

  const completedProjects = cardData.projects?.projectDistribution?.find((item) => item.name === "Completed")?.value ?? 0;
  const totalProjects = cardData.projects?.overview?.totalAssigned ?? 0;
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100)
    : 0;

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "var(--primary)" }} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold  text-[var(--text-primary)]">Dashboards</h1>
        <button
          onClick={() => {
            sessionStorage.setItem("force_tour", "true");
            window.dispatchEvent(new Event("start-sidebar-tour"));
          }
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--primary)" }}
        >
          Start Tour
        </button>
      </div>

      <div className="flex w-full p-1 ">
        <div className="w-[70%]">
          {/* Stat cards — each with its own period dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-2">
            <StatCard
              title="Total Projects"
              value={String(cardData.projects?.overview?.totalAssigned ?? cardData.projects?.overview?.totalAssigned ?? 0)}
              icon={<Eye size={16} />}
              period={periods.projects}
              onPeriodChange={p => handlePeriodChange("projects", p)}
              change={cardData.projects?.periodStats?.completed
                ? `${cardData.projects?.overview?.totalAssigned} done`
                : undefined}
              changeType="up"
            />
            <StatCard
              title="Completed Projects"
              value={String(completedProjects)}
              icon={<ReceiptText size={16} />}
              period={periods.revenue}
              onPeriodChange={(p) =>
                handlePeriodChange("revenue", p)
              }
              change={`${completionRate}%`}
              changeType="up"
            />
            <StatCard
              title="Amount Received"
              value={fmt(cardData.received?.periodStats?.earnings ?? 0)}
              icon={<Activity size={16} />}
              period={periods.received}
              onPeriodChange={p => handlePeriodChange("received", p)}
            />
            <StatCard
              title="Amount Pending"
              value={fmt(cardData.pending?.financials?.totalPending ?? 0)}
              icon={<CheckCircle size={16} />}
              period={periods.pending}
              onPeriodChange={p => handlePeriodChange("pending", p)}
            />

            {/* <StatCard
              title="New Invitations"
              value={String(cardData.projects?.overview ?.newInvitations ?? 0 )}
              icon={<Mail size={16} />}
              period={periods.projects}
              onPeriodChange={(p) => handlePeriodChange( "projects", p)}
            /> */}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* <ProjectDistribution data={distribution} /> */}
            <ProjectProgress data={projectsData?.projects || []} />

            <DailyScheduleCard projectsData={projectsData} />
          </div>
          <div className="p-1">
            <div className="flex flex items-center">
              <h3 className="mb-4 mt-4 flex items-center gap-3 text-3xl font-semibold">
                Tickets
              </h3>
              <span className="text-[#898d94] text-xl px-2 rounded">
                ({projectsData?.projects?.reduce(
                  (acc: number, project: Project) =>
                    acc + (project.tickets?.length || 0),
                  0
                ) || 0})
              </span>
            </div>
            <div className="space-y-4">
              {projectsData?.projects
                ?.flatMap((project: Project) => project.tickets || [])
                ?.sort(
                  (a: Ticket, b: Ticket) =>
                    statusOrder[a.status as keyof typeof statusOrder] -
                    statusOrder[b.status as keyof typeof statusOrder]
                )
                ?.slice(0, 3)
                ?.map((ticket: Ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusUpdated={mutate}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className=" w-[30%] flex flex-col gap-6 items-center p-1 ml-1">
          <div id="engineer-calendar" className="w-full">
            <ModernCalendar projects={projectsData?.projects} />
          </div>
          <div id="engineer-invitations" className="w-full">
            <InvitationCard invitationsData={invitationsData} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
