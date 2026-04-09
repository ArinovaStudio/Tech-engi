"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { BarChart2, ChevronDown, ProportionsIcon } from "lucide-react";

const data = [
  { name: "Website", value: 374.82, color: "#FFAE58", pct: 44 },
  { name: "Mobile App", value: 241.60, color: "#050A30", pct: 28 },
  { name: "Other", value: 213.42, color: "#e5e5e5", pct: 25 },
];

export default function SalesDistribution() {
  const [period, setPeriod] = useState("Monthly");
  return (
    <div className="bg-white p-5 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className=" bg-gray-50 rounded-lg px-1.5 py-1.5">
            <BarChart2 size={16} className="text-gray-600" />
          </span>
          <h3 className="text-sm font-bold font-id text-[var(--text-primary)]">Sales Distribution</h3>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold font-inter text-[var(--text-secondary)] bg-white px-3 py-1.5 border border-[var(--border)] rounded-lg">
          {period} <ChevronDown size={12} />
        </button>
      </div>

      {/* Channel Totals */}
      <div className="flex items-center gap-4 mb-5">
        {data.map((d) => (
          <div key={d.name} className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 shrink-0 " style={{ background: d.color }} />
              <p className="text-[11px] font-inter text-[var(--text-muted)] truncate">{d.name}</p>
            </div>
            <p className="text-sm font-bold font-id text-[var(--text-primary)]">${d.value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Donut Chart */}
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value"
              startAngle={90} endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`$${val.toFixed(2)}`, ""]}
              contentStyle={{ borderRadius: 0, border: "1px solid #e5e5e5", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xl font-bold font-id text-[var(--text-primary)]">$829</p>
            <p className="text-[10px] font-inter text-[var(--text-muted)]">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
