"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CreditCard, Users, MessageSquare, LogOut, ChevronLeft, ChevronRight,
  ProportionsIcon,
  User,
  UserKeyIcon
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  href: string;
}

const generalNav: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { label: "Payment", icon: <CreditCard size={18} />, href: "/dashboard/payment" },
  { label: "Customers", icon: <Users size={18} />, href: "/dashboard/customers" },
  { label: "Message", icon: <MessageSquare size={18} />, href: "/dashboard/message"},
  { label: "Project", icon: <ProportionsIcon size={18} />, href: "/dashboard/project" },
  { label: "Client Management", icon: <User size={18} />, href: "/dashboard/client-management" },
  { label: "Engineer Management", icon: <UserKeyIcon size={18} />, href: "/dashboard/engineer-management" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold font-inter transition-all duration-200 group relative
          ${isActive
            ? "bg-[#fff4e6] text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:bg-[#fff4e6] hover:text-[var(--text-primary)]"
          }`}
      >
        <span className={`shrink-0 ${isActive ? "text-[#FFAE58]" : "text-gray-400 group-hover:text-[#FFAE58]"}`}>
          {item.icon}
        </span>
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className={`text-xs px-1.5 py-0.5 font-semibold font-inter
            ${typeof item.badge === "number"
              ? "bg-[#FFAE58] text-white"
              : "bg-black text-white"
            }`}
          >
            {item.badge}
          </span>
        )}
        {collapsed && (
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  const SectionLabel = ({ label }: { label: string }) =>
    !collapsed ? (
      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-3 mb-1 mt-5">
        {label}
      </p>
    ) : <div className="my-2 border-t border-gray-100" />;

  return (
    <aside
      style={{ width: collapsed ? 68 : 210 }}
      className="h-screen flex flex-col bg-white border-r border-[var(--border)] transition-all duration-300 shrink-0 relative"
    >
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[var(--border)]">
        {!collapsed && <span className="font-bold font-benz text-lg text-[var(--text-primary)] tracking-tight">TECH ENGI</span>}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-[var(--border)] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10 text-gray-400 hover:text-[#FFAE58]"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <SectionLabel label="General" />
        {generalNav.map((item) => <NavLink key={item.label} item={item} />)}
      </nav>

      <div className="border-t border-[var(--border)] p-3 space-y-2">
        <button className={`w-full flex items-center font-bold gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
