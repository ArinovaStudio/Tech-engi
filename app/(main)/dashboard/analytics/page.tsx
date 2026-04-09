"use client";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 4200, expenses: 2100 },
  { month: "Feb", revenue: 5800, expenses: 2400 },
  { month: "Mar", revenue: 4900, expenses: 2800 },
  { month: "Apr", revenue: 7200, expenses: 3100 },
  { month: "May", revenue: 6100, expenses: 2700 },
  { month: "Jun", revenue: 8400, expenses: 3500 },
  { month: "Jul", revenue: 7800, expenses: 3200 },
  { month: "Aug", revenue: 9100, expenses: 3800 },
  { month: "Sep", revenue: 8600, expenses: 3400 },
  { month: "Oct", revenue: 10200, expenses: 4100 },
  { month: "Nov", revenue: 9257, expenses: 3900 },
  { month: "Dec", revenue: 11400, expenses: 4600 },
];

const trafficData = [
  { day: "Mon", views: 1240, unique: 890 },
  { day: "Tue", views: 1890, unique: 1200 },
  { day: "Wed", views: 2100, unique: 1450 },
  { day: "Thu", views: 1650, unique: 1100 },
  { day: "Fri", views: 2400, unique: 1680 },
  { day: "Sat", views: 1800, unique: 1250 },
  { day: "Sun", views: 1320, unique: 920 },
];

const channelData = [
  { name: "Organic", value: 42 },
  { name: "Paid Ads", value: 28 },
  { name: "Social", value: 18 },
  { name: "Referral", value: 12 },
];

const tooltipStyle = { borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 };

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Performance overview — Jan to Dec 2024</p>
        </div>
        <div className="flex gap-2">
          {["7D", "30D", "90D", "1Y"].map((p, i) => (
            <button key={p} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
              ${i === 3 ? "bg-[var(--primary)] text-white" : "bg-white text-[var(--text-secondary)] border border-[var(--border)] hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue",    value: "$98,450",  change: "+18.2%", up: true },
          { label: "Page Views",       value: "284,920",  change: "+12.8%", up: true },
          { label: "Conversion Rate",  value: "3.42%",    change: "+0.8%",  up: true },
          { label: "Avg. Session",     value: "4m 32s",   change: "-0.3%",  up: false },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[var(--border)] p-4">
            <p className="text-[10px] text-[var(--text-muted)] mb-1">{k.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{k.value}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${k.up ? "text-green-600" : "text-red-500"}`}>{k.change} vs last year</p>
          </div>
        ))}
      </div>

      {/* Revenue Area Chart */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5 mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Revenue vs Expenses</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue"  stroke="#7C5CFC" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#06b6d4" fill="url(#expGrad)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Traffic */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Weekly Traffic</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="views"  fill="#7C5CFC" radius={[4,4,0,0]} name="Page Views" />
                <Bar dataKey="unique" fill="#06b6d4" radius={[4,4,0,0]} name="Unique Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channels */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Traffic Sources</h3>
          <div className="space-y-3 mt-2">
            {channelData.map((c, i) => {
              const colors = ["#7C5CFC", "#06b6d4", "#f59e0b", "#10b981"];
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--text-secondary)]">{c.name}</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{c.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: "Bounce Rate", value: "38.4%" },
              { label: "New Users",   value: "61.2%" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-[var(--primary)]">{s.value}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
