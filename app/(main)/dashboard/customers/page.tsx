import DashboardShell from "@/components/layout/DashboardShell";
import { Plus, Search, MoreHorizontal, Mail, Phone } from "lucide-react";

const customers = [
  { name: "Sarah Mitchell",   email: "sarah@designco.com",  phone: "+1 555-0101", plan: "Enterprise", spent: "$4,280", joined: "Jan 2024",  status: "Active",   avatar: "SM", color: "bg-purple-500" },
  { name: "James Holloway",   email: "james@techstart.io",  phone: "+1 555-0102", plan: "Pro",        spent: "$1,940", joined: "Mar 2024",  status: "Active",   avatar: "JH", color: "bg-blue-500" },
  { name: "Priya Nair",       email: "priya@bloom.co",      phone: "+1 555-0103", plan: "Starter",    spent: "$320",   joined: "Jun 2024",  status: "Active",   avatar: "PN", color: "bg-pink-500" },
  { name: "Carlos Mendez",    email: "carlos@mercado.mx",   phone: "+1 555-0104", plan: "Pro",        spent: "$2,615", joined: "Feb 2024",  status: "Inactive", avatar: "CM", color: "bg-amber-500" },
  { name: "Anna Kowalski",    email: "anna@euromed.eu",     phone: "+1 555-0105", plan: "Enterprise", spent: "$6,100", joined: "Nov 2023",  status: "Active",   avatar: "AK", color: "bg-cyan-500" },
  { name: "Liam O'Brien",     email: "liam@cloudwave.ie",   phone: "+1 555-0106", plan: "Starter",    spent: "$495",   joined: "Aug 2024",  status: "Active",   avatar: "LO", color: "bg-green-500" },
  { name: "Yuki Tanaka",      email: "yuki@neolab.jp",      phone: "+1 555-0107", plan: "Pro",        spent: "$3,220", joined: "Apr 2024",  status: "Active",   avatar: "YT", color: "bg-indigo-500" },
  { name: "Fatima Al-Hassan", email: "fatima@finops.ae",    phone: "+1 555-0108", plan: "Enterprise", spent: "$8,750", joined: "Sep 2023",  status: "Active",   avatar: "FA", color: "bg-rose-500" },
];

const planConfig: Record<string, string> = {
  Enterprise: "bg-purple-50 text-purple-600",
  Pro:        "bg-blue-50 text-blue-600",
  Starter:    "bg-gray-100 text-gray-500",
};

export default function CustomersPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Customers</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{customers.length} total customers</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors shadow-md shadow-purple-200">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: "1,284", change: "+12%" },
          { label: "Active",          value: "1,102", change: "+8%" },
          { label: "New This Month",  value: "43",    change: "+22%" },
          { label: "Avg. Lifetime",   value: "$2,140", change: "+5%" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[var(--border)] p-4">
            <p className="text-[10px] text-[var(--text-muted)] mb-1">{k.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{k.value}</p>
            <p className="text-[10px] text-green-600 font-semibold mt-0.5">{k.change} this month</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--border)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">All Customers</h2>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-[var(--border)] w-52">
            <Search size={13} className="text-gray-400" />
            <input placeholder="Search customers..." className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none flex-1" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Contact</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Total Spent</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-t border-[var(--border)] hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {c.avatar}
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{c.name}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]"><Mail size={10} />{c.email}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]"><Phone size={10} />{c.phone}</div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${planConfig[c.plan]}`}>{c.plan}</span>
                </td>
                <td className="px-5 py-3.5 text-xs font-bold text-[var(--text-primary)]">{c.spent}</td>
                <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">{c.joined}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full
                    ${c.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {c.status}
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
