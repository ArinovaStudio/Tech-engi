import { Eye, ReceiptText, Activity, Calendar, Filter, Download } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesDistribution from "@/components/dashboard/ProjectDistribution";
import TotalSubscriber from "@/components/dashboard/RevenueChart";
import DashboardShell from "@/components/layout/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-id text-[var(--text-primary)]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 font-inter ">
          <div className="flex  border border-[var(--border)] rounded-lg">
            <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-white px-3 py-2 rounded-l-lg">
              <Calendar size={13} /> Oct 18 – Nov 18
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-white px-3 py-2 border-l border-[var(--border)] rounded-r-lg">
              Monthly
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-white px-3 py-2 border border-[var(--border)] rounded-lg">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] bg-white px-4 py-2 border border-[var(--border)] rounded-lg">
            <Download size={13} /> EXPORT
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Page Views" value="12,450" change="15.8%" changeType="up" icon={<Eye size={16} />} />
        <StatCard title="Total Revenue" value="$363.95" change="34.0%" changeType="down" icon={<ReceiptText size={16} />} />
        <StatCard title="Bounce Rate" value="86.5%" change="24.2%" changeType="up" icon={<Activity size={16} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <SalesDistribution data={[]} />
        <TotalSubscriber data={{ monthly: [], yearly: [] }} totalRevenue={0} />
      </div>
    </DashboardShell>
  );
}
