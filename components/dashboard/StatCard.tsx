import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const isUp = changeType === "up";
  return (
    <div className="bg-white p-5 border border-[var(--border)] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-gray-400 rounded-lg">
            {icon}
          </div>
          <span className="text-sm font-bold font-inter text-[var(--text-secondary)]">{title}</span>
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
      <div className="flex items-end gap-3">
        <h2 className="text-3xl font-bold font-id text-[var(--text-primary)]">{value}</h2>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 mb-0.5 border border-gray-200 rounded-lg
          ${isUp ? "text-green-500 bg-green-50/50" : "text-red-500 bg-red-50"}`}
          >
          {change}
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        </div>
      </div>
    </div>
  );
}
