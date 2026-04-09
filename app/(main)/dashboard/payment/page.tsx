import DashboardShell from "@/components/layout/DashboardShell";
import { Plus, Download, Search, MoreHorizontal, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
  { id: "TXN-0012", name: "Stripe Payment",  type: "credit", amount: "+$650.00", date: "Dec 12, 2024", status: "Completed", avatar: "SP", color: "bg-green-500" },
  { id: "TXN-0011", name: "Zapier Billing",  type: "debit",  amount: "-$49.00",  date: "Dec 11, 2024", status: "Completed", avatar: "ZB", color: "bg-orange-500" },
  { id: "TXN-0010", name: "Shopify Payout",  type: "credit", amount: "+$432.25", date: "Dec 10, 2024", status: "Pending",   avatar: "SH", color: "bg-emerald-500" },
  { id: "TXN-0009", name: "AWS Invoice",     type: "debit",  amount: "-$214.00", date: "Dec 9, 2024",  status: "Completed", avatar: "AW", color: "bg-yellow-500" },
  { id: "TXN-0008", name: "Figma Pro",       type: "debit",  amount: "-$15.00",  date: "Dec 8, 2024",  status: "Completed", avatar: "FP", color: "bg-pink-500" },
  { id: "TXN-0007", name: "Client Invoice",  type: "credit", amount: "+$1,200.00",date:"Dec 7, 2024",  status: "Completed", avatar: "CI", color: "bg-purple-500" },
  { id: "TXN-0006", name: "Google Ads",      type: "debit",  amount: "-$320.00", date: "Dec 6, 2024",  status: "Failed",    avatar: "GA", color: "bg-red-500" },
  { id: "TXN-0005", name: "PayPal Transfer", type: "credit", amount: "+$875.50", date: "Dec 5, 2024",  status: "Completed", avatar: "PP", color: "bg-blue-500" },
];

const statusConfig: Record<string, string> = {
  Completed: "bg-green-50 text-green-600",
  Pending:   "bg-amber-50 text-amber-600",
  Failed:    "bg-red-50 text-red-500",
};

export default function PaymentPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Payment</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage transactions and billing</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-white px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-gray-50 shadow-sm">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors shadow-md shadow-purple-200">
            <Plus size={16} /> Add Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Income",  value: "$3,157.75", sub: "+12.4% this month", up: true,  color: "var(--primary)" },
          { label: "Total Expense", value: "$598.00",   sub: "-3.2% this month",  up: false, color: "#ef4444" },
          { label: "Net Balance",   value: "$2,559.75", sub: "Updated just now",  up: true,  color: "#10b981" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-[var(--border)] p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className={`text-xs mt-1 font-medium ${c.up ? "text-green-600" : "text-red-500"}`}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[var(--border)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Transactions</h2>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-[var(--border)] w-48">
            <Search size={13} className="text-gray-400" />
            <input placeholder="Search..." className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none flex-1" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="text-left px-5 py-3">Transaction</th>
              <th className="text-left px-5 py-3">ID</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} className={`border-t border-[var(--border)] hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : ""}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${tx.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {tx.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{tx.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] capitalize">{tx.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-[var(--text-muted)] font-mono">{tx.id}</td>
                <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">{tx.date}</td>
                <td className="px-5 py-3.5">
                  <div className={`flex items-center gap-1 text-xs font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "credit" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                    {tx.amount}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusConfig[tx.status]}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
