"use client";

import { Eye, ReceiptText, Activity, Calendar, Filter, Download, Briefcase, Users, CheckCircle, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ProjectDistribution from "@/components/dashboard/ProjectDistribution"; // Renamed your Donut component
import RevenueChart from "@/components/dashboard/RevenueChart"; // Renamed your Bar component
import DashboardShell from "@/components/layout/DashboardShell";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useSWR("/api/admin/dashboard", fetcher);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="animate-spin" color="#FFAE58" size={32} />
        </div>
      </DashboardShell>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  return (
    <DashboardShell>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-id text-[var(--text-primary)]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 font-inter ">
          <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] bg-white px-4 py-2 border border-[var(--border)] rounded-lg">
            <Download size={13} /> EXPORT
          </button>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Projects" value={stats.totalProjects?.toString()} icon={<Briefcase size={16} />} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={<ReceiptText size={16} />} />
        <StatCard title="Total Clients" value={stats.totalClients?.toString()} icon={<Users size={16} />} />
        
        <StatCard title="Ongoing Projects" value={stats.ongoingProjects?.toString()} icon={<Activity size={16} />} />
        <StatCard title="Completed Projects" value={stats.completedProjects?.toString()} icon={<CheckCircle size={16} />} />
        <StatCard title="Pending Revenue" value={`₹${stats.pendingRevenue?.toLocaleString()}`} icon={<Clock size={16} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <ProjectDistribution data={charts.projectDistribution} />
        <RevenueChart data={charts.revenue} totalRevenue={stats.totalRevenue} />
      </div>
    </DashboardShell>
  );
}