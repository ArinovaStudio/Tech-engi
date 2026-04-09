"use client";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";

const days = [
  { day: "Sun", value: 1200 },
  { day: "Mon", value: 2100 },
  { day: "Tue", value: 3874, active: true },
  { day: "Wed", value: 1800 },
  { day: "Thu", value: 900 },
  { day: "Fri", value: 1500 },
  { day: "Sat", value: 800 },
];

export default function TotalSubscriber() {
  return (
    <div className="bg-white p-5 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="bg-gray-50 rounded-lg px-1.5 py-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <h3 className="text-sm font-bold font-id text-[var(--text-primary)]">Total Subscriber</h3>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold font-inter text-[var(--text-secondary)] bg-white px-3 py-1.5 border border-[var(--border)] rounded-lg">
          Weekly <ChevronDown size={12} />
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-3xl font-bold font-id text-[var(--text-primary)]">24,473</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-xs font-semibold font-inter text-green-600 bg-green-50/50 px-2 py-0.5 rounded-lg border border-green-200">
            8.3% <TrendingUp size={11} /> 
          </div>
          <span className="text-xs font-inter text-[var(--text-muted)] font-semibold">+ 749 increased</span>
        </div>
      </div>

      <div className="h-36 font-bold">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} barSize={22} barCategoryGap="25%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "var(--font-inter)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,174,88,0.08)" }}
              contentStyle={{ borderRadius: 0, border: "1px solid #e5e5e5", fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 0, 0, 0]}>
              {days.map((entry, i) => (
                <Cell key={i} fill={entry.active ? "#FFAE58" : "#e5e5e5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
