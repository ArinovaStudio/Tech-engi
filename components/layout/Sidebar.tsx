"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CreditCard, Users, MessageSquare, LogOut, ChevronLeft, ChevronRight,
  User, UserKeyIcon, FolderKanban, Presentation, Lightbulb, FileUp, Handshake, Bug, Paperclip, Send,
  Headset
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardTourSteps } from "@/config/dashboardTourSteps";
import { engineerDashboardTourSteps } from "@/config/engineerDashboardTourSteps";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Image from "next/image";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  href: string;
}

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin" },
  { label: "Projects", icon: <FolderKanban size={20} />, href: "/admin/project" },
  { label: "Client Management", icon: <User size={20} />, href: "/admin/client-management" },
  { label: "Engineer Management", icon: <UserKeyIcon size={20} />, href: "/admin/engineer-management" },
  { label: "Invitations Management", icon: <Send size={20} />, href: "/admin/invitations-management" },
  { label: "Leads", icon: <Headset size={20} />, href: "/admin/leads" },
  { label: "Message", icon: <MessageSquare size={20} />, href: "/admin/message" },
];

const CLIENT_NAV: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/client" },
  { label: "Message", icon: <MessageSquare size={20} />, href: "/client/message" },
  { label: "Report Issue", icon: <Bug size={20} />, href: "/client/reportissue" },
  { label: "Assets", icon: <Paperclip size={20} />, href: "/client/assets" },
  { label: "Payout", icon: <CreditCard size={20} />, href: "/client/account" },
  { label: "Profile", icon: <User size={20} />, href: "/client/profile" },
];

const ENGINEER_NAV: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/engineer" },
  { label: "Projects", icon: <FolderKanban size={20} />, href: "/engineer/project" },
  { label: "Message", icon: <MessageSquare size={20} />, href: "/engineer/message" },
  { label: "Payout", icon: <CreditCard size={20} />, href: "/engineer/payout" },
  { label: "Profile", icon: <User size={20} />, href: "/engineer/profile" },
];

function getSidebarDescription(label: string): string {
  const descriptions: Record<string, string> = {
    "Dashboard": "Your main hub — view all your projects, their progress, budgets, and key analytics at a glance.",
    "Message": "Chat directly with your engineer or admin team about your projects.",
    "Report Issue": "Raise a ticket anytime you hit a payment, technical, or delivery problem.",
    "Assets": "Upload and manage project files, images, links, and credentials shared with your team.",
    "Payout": "Track your payment history and settle any pending advance or final payments.",
    "Profile": "Manage your personal info, profile photo, and payout details.",
    "Projects": "View and manage all projects assigned to you.",
    "Client Management": "View and manage all client accounts on the platform.",
    "Engineer Management": "View and manage all engineer accounts and assignments.",
    "Invitations Management": "Send and track invitations for new clients or engineers joining the platform.",
  };
  return descriptions[label] || `Navigate to the ${label} section.`;
}

const NavLink = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      href={item.href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
        ${isActive
          ? "bg-[#FFAE58] text-white shadow-sm font-semibold text-[15px]"
          : "text-gray-500 dark:text-slate-400 hover:bg-[#fff4e6] dark:hover:bg-[#2c1e11] hover:text-[#FFAE58] text-[15px]"
        }`}
    >
      <span className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 dark:text-slate-500 group-hover:text-[#FFAE58]"}`}>
        {item.icon}
      </span>
      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className={`text-xs px-2 py-0.5 font-bold rounded-full
          ${typeof item.badge === "number" ? "bg-white dark:bg-slate-800 text-[#FFAE58]" : "bg-black dark:bg-white text-white dark:text-black"}`}>
          {item.badge}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {item.label}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin, isEngineer, isClient, user } = useAuth();
  const router = useRouter();
  const nav = isAdmin ? ADMIN_NAV : isEngineer ? ENGINEER_NAV : isClient ? CLIENT_NAV : [];

  // Tracks the currently-running driver.js instance so tours can destroy
  // themselves before handing off to the next page's tour.
  const activeDriverRef = useRef<ReturnType<typeof driver> | null>(null);

  // Polls for an element to exist in the DOM before dispatching handoff events.
  // router.push() resolves before the new page's component has mounted, so
  // we wait for a known anchor element to confirm the page is ready.
  const waitForElement = (selector: string, timeoutMs = 5000, intervalMs = 100): Promise<boolean> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (document.querySelector(selector)) {
          resolve(true);
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(check, intervalMs);
      };
      check();
    });
  };

  // Handoff: Dashboard → Report Issue page
  const goToReportIssueTour = async () => {
    activeDriverRef.current?.destroy();
    activeDriverRef.current = null;

    sessionStorage.setItem("tour_in_progress", "true");
    router.push("/client/reportissue");

    const found = await waitForElement("#report-issue-btn");
    if (found) {
      window.dispatchEvent(new Event("start-report-issue-tour"));
    } else {
      sessionStorage.removeItem("tour_in_progress");
    }
  };

  // Handoff: Engineer Dashboard → Engineer Projects page
  const goToEngineerProjectsTour = () => {
    activeDriverRef.current?.destroy();
    activeDriverRef.current = null;

    sessionStorage.setItem("tour_in_progress", "true");
    sessionStorage.setItem("start_engineer_projects_tour", "true");

    router.push("/engineer/project");
  };

  // Handoff: Report Issue page → Assets page
  // Called by the "go-to-assets-tour" event dispatched from ClientReportIssue.
  const goToAssetsTour = async () => {
    activeDriverRef.current?.destroy();
    activeDriverRef.current = null;

    // Keep the flag alive — ClientReportIssue's onDestroyed must NOT have
    // cleared it when handing off (see isHandingOff ref in that component).
    sessionStorage.setItem("tour_in_progress", "true");
    router.push("/client/assets");

    const found = await waitForElement("#upload-assets-btn");
    if (found) {
      window.dispatchEvent(new Event("start-assets-tour"));
    } else {
      sessionStorage.removeItem("tour_in_progress");
    }
  };

  // Handoff: Assets page → Payout (Account) page
  const goToPayoutTour = () => {
    activeDriverRef.current?.destroy();
    activeDriverRef.current = null;

    sessionStorage.setItem("tour_in_progress", "true");
    sessionStorage.setItem("start_payout_tour", "true");

    router.push("/client/account");
  };

  const goToProfileTour = () => {
    activeDriverRef.current?.destroy();
    activeDriverRef.current = null;

    sessionStorage.setItem("tour_in_progress", "true");
    sessionStorage.setItem("start_profile_tour", "true");

    router.push("/client/profile");
  };

  // Sidebar + Dashboard steps only. Report Issue and Assets tours run
  // inside their own pages via events — don't include their steps here.
  const buildTourSteps = () => {
    const roleDashboardSteps = isEngineer ? engineerDashboardTourSteps : dashboardTourSteps;
    const goToNextPage = isEngineer ? goToEngineerProjectsTour : goToReportIssueTour;

    const dashboardStepsWithHandoff = roleDashboardSteps.map((step, index) => {
      const isLastStep = index === roleDashboardSteps.length - 1;
      if (!isLastStep) return step;

      return {
        ...step,
        popover: {
          ...step.popover,
          onNextClick: (_el: any, _stepArg: any, opts: any) => {
            activeDriverRef.current = opts.driver;
            goToNextPage();
          },
        },
      };
    });

    const sidebarSteps = nav.map((item) => ({
      element: `#nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`,
      popover: {
        title: item.label,
        description: getSidebarDescription(item.label),
      },
    }));

    return [
      ...sidebarSteps,
      {
        element: "#nav-dashboard",
        popover: {
          title: "You're Ready! 🎉",
          description:
            isEngineer
              ? "Now click on any project from the dashboard to continue the tour and explore the full project details, tasks, milestones, and more!"
              : "Now click on any project from the dashboard to continue the tour and explore the full project analytics, budget, design system, and more!",
        },
      },
      ...dashboardStepsWithHandoff,
    ];
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

  // Auto-start tour on first visit
  useEffect(() => {
    if (!user?.id || nav.length === 0) return;
    const tourKey = `tour_seen_sidebar_${user.id}`;
    if (localStorage.getItem(tourKey)) return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        ...driverConfig(),
        onDestroyed: () => {
          localStorage.setItem(tourKey, "true");
        },
        steps: buildTourSteps(),
      });

      activeDriverRef.current = driverObj;
      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [user?.id, nav.length]);

  // Manual tour trigger via "Start Tour" button on the dashboard
  useEffect(() => {
    const handleManualTour = () => {
      // Signal all downstream pages to ignore their localStorage gate
      sessionStorage.setItem("force_tour", "true");

      const driverObj = driver({
        ...driverConfig(),
        steps: buildTourSteps(),
      });
      activeDriverRef.current = driverObj;
      driverObj.drive();
    };
    window.addEventListener("start-sidebar-tour", handleManualTour);
    return () => window.removeEventListener("start-sidebar-tour", handleManualTour);
  }, [nav]);

  // Dedicated listener for the Report Issue → Assets handoff event.
  // Kept in its own effect with empty deps so it is ALWAYS mounted,
  // regardless of which page the user is currently on.
  useEffect(() => {
    const handleGoToAssets = () => goToAssetsTour();
    window.addEventListener("go-to-assets-tour", handleGoToAssets);
    return () => window.removeEventListener("go-to-assets-tour", handleGoToAssets);
  }, []);

  useEffect(() => {
    const handleGoToPayout = () => goToPayoutTour();
    window.addEventListener("go-to-payout-tour", handleGoToPayout);
    return () => window.removeEventListener("go-to-payout-tour", handleGoToPayout);
  }, []);

  useEffect(() => {
    const handleGoToProfile = () => goToProfileTour();
    window.addEventListener("go-to-profile-tour", handleGoToProfile);
    return () => window.removeEventListener("go-to-profile-tour", handleGoToProfile);
  }, []);

  return (
    <aside
      style={{ width: collapsed ? 80 : 250 }}
      className="h-screen flex flex-col bg-sidebar border-r border-[var(--sidebar-border)] transition-all duration-300 shrink-0 relative"
    >
      <div className="flex items-center justify-center h-20 border-b border-[var(--sidebar-border)] bg-sidebar">
        {!collapsed && (
          <span className="font-bold text-xl text-[var(--text-primary)] tracking-tight">
            <Image
              src="/logo-transparent.png"
              alt="logo"
              width={300}
              height={300}
              priority
            />
          </span>
        )}
        {collapsed && <span className="font-bold text-xl text-[var(--text-primary)] tracking-tight">TE</span>}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-sidebar border border-[var(--sidebar-border)] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10 text-gray-400 dark:text-slate-350 hover:text-[#FFAE58]"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 overflow-y-auto px-3 py-6 flex flex-col gap-2 no-scrollbar bg-sidebar">
        {nav.map((item) => <NavLink key={item.label} item={item} collapsed={collapsed} />)}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] p-4 bg-sidebar">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`w-full flex items-center font-semibold gap-3 px-4 py-3 rounded-xl text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}