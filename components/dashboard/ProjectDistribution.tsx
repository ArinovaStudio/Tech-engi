"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  "In Progress": "#FFAE58", 
  "Completed": "#22c55e",
  "Searching": "#050A30",
  "Awaiting Final Payment": "#8b5cf6",
  "Canceled": "#ef4444" 
};

export default function ProjectDistribution({ data = [] }: { data: any[] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-5 border border-[var(--border)] rounded-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold font-id text-[var(--text-primary)]">Project Distribution</h3>
      </div>

      {/* Dynamic Totals */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        {data.map((d: any) => (
          <div key={d.name} className="flex-1 min-w-[30%]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 shrink-0 rounded-full" style={{ background: COLORS[d.name] || "#e5e5e5" }} />
              <p className="text-[11px] font-inter text-[var(--text-muted)] truncate">{d.name}</p>
            </div>
            <p className="text-sm font-bold font-id text-[var(--text-primary)]">{d.value}</p>
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
              {data.map((entry: any, index: number) => (
                <Cell key={index} fill={COLORS[entry.name] || "#e5e5e5"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xl font-bold font-id text-[var(--text-primary)]">{total}</p>
            <p className="text-[10px] font-inter text-[var(--text-muted)]">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}