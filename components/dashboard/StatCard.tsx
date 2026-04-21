interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-5 border border-[var(--border)] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-gray-400 rounded-lg">
            {icon}
          </div>
          <span className="text-sm font-bold font-inter text-[var(--text-secondary)]">{title}</span>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <h2 className="text-3xl font-bold font-id text-[var(--text-primary)]">{value || "0"}</h2>
      </div>
    </div>
  );
}