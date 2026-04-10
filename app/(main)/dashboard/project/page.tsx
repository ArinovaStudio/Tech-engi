"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { Plus, Search, Filter, Users, Calendar, AlertCircle, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useState, useMemo, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  budget?: number;
  earnings?: number;
  status: string;
  progress: number;
  instruments: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  advancePaid?: boolean;
  isFinalPaymentMade?: boolean;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  AWAITING_ADVANCE: { label: "Awaiting Advance", color: "bg-yellow-100 text-yellow-700" },
  SEARCHING: { label: "Searching Engineer", color: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "In Progress", color: "bg-green-100 text-green-700" },
  IN_REVIEW: { label: "In Review", color: "bg-purple-100 text-purple-700" },
  AWAITING_FINAL_PAYMENT: { label: "Awaiting Final Payment", color: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  CANCELED: { label: "Canceled", color: "bg-red-100 text-red-600" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-semibold font-inter px-2 py-0.5 rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
}

function ProjectCard({ project, role }: { project: Project; role: string }) {
  const amount = role === "ENGINEER" ? project.earnings : project.budget;
  const amountLabel = role === "ENGINEER" ? "Earnings" : "Budget";

  return (
    <Link href={`/dashboard/project/${project.id}`}>
      <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--primary)] transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold font-inter text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-xs font-inter text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {project.instruments?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.instruments.slice(0, 3).map((inst) => (
              <span key={inst} className="text-[10px] font-inter px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8] rounded-full">
                {inst}
              </span>
            ))}
            {project.instruments.length > 3 && (
              <span className="text-[10px] font-inter text-[var(--text-muted)]">+{project.instruments.length - 3}</span>
            )}
          </div>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-[10px] font-inter text-[var(--text-muted)] mb-1">
            <span>Progress</span>
            <span className="font-semibold text-[var(--text-primary)]">{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${project.progress}%`, background: "var(--primary)" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1 text-[10px] font-inter text-[var(--text-muted)]">
            <Calendar size={11} />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          {amount !== undefined && (
            <span className="text-xs font-bold font-inter text-[var(--text-primary)]">
              {amountLabel}: ₹{amount.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Client: Create Project Modal ──────────────────────────────────────────────
function CreateProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", budget: "", startDate: "", endDate: "" });
  const [instruments, setInstruments] = useState<string[]>([]);
  const [instrInput, setInstrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addInstrument = () => {
    const v = instrInput.trim();
    if (v && !instruments.includes(v)) setInstruments((p) => [...p, v]);
    setInstrInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/client/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          budget: Number(form.budget),
          instruments,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      onCreated();
      onClose();
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-inter outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white text-[var(--text-primary)]";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-lg font-bold font-id text-[var(--text-primary)] mb-5">Create New Project</h2>
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">Title *</label>
              <input className={inputCls} placeholder="Project title (min 5 chars)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">Description *</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Describe your project (min 20 chars)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">Budget (₹) *</label>
              <input type="number" className={inputCls} placeholder="Min ₹500" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">Start Date</label>
                <input type="date" className={inputCls} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">End Date</label>
                <input type="date" className={inputCls} value={form.endDate} min={form.startDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium font-inter text-[var(--text-secondary)] mb-1">Instruments / Skills Needed</label>
              <div className="flex gap-2 mb-2">
                <input className={inputCls} placeholder="e.g. React, Node.js" value={instrInput} onChange={(e) => setInstrInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInstrument())} />
                <button type="button" onClick={addInstrument} className="px-3 py-2 bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8] rounded-lg text-xs font-inter font-semibold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {instruments.map((i) => (
                  <span key={i} className="text-[10px] font-inter px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8] rounded-full flex items-center gap-1">
                    {i}
                    <button type="button" onClick={() => setInstruments((p) => p.filter((x) => x !== i))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-inter text-[var(--text-secondary)] hover:bg-[var(--bg)]">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-inter font-semibold disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "var(--primary)" }}>
                {loading && <Loader2 size={14} className="animate-spin" />} Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);

  const fetchProjects = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const endpoint =
        role === "CLIENT" ? "/api/client/projects" :
          role === "ADMIN" ? "/api/admin/project" :
            "/api/engineer/projects";
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [role]);

  const filtered = useMemo(() => projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  }), [projects, search, statusFilter]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => ["IN_PROGRESS", "IN_REVIEW", "SEARCHING"].includes(p.status)).length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  }), [projects]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-id text-[var(--text-primary)]">
              {role === "CLIENT" ? "My Projects" : role === "ADMIN" ? "All Projects" : "Assigned Projects"}
            </h1>
            <p className="text-xs font-inter text-[var(--text-muted)] mt-0.5">
              {role === "CLIENT" ? "Manage your projects and track progress"
                : role === "ADMIN" ? "Overview of all client projects"
                  : "Projects you are working on"}
            </p>
          </div>
          {role === "CLIENT" && (
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-white rounded-lg flex items-center gap-2 font-inter text-sm font-semibold" style={{ background: "var(--primary)" }}>
              <Plus size={15} /> New Project
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: stats.total, icon: <Users size={16} />, color: "text-[var(--text-primary)]" },
            { label: "Active", value: stats.active, icon: <Clock size={16} />, color: "text-green-600" },
            { label: "Completed", value: stats.completed, icon: <CheckCircle size={16} />, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
              <div className={`${s.color}`}>{s.icon}</div>
              <div>
                <p className={`text-xl font-bold font-id ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-inter text-[var(--text-muted)]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm font-inter bg-white text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)] w-52"
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm font-inter bg-white text-[var(--text-primary)] outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <span className="text-xs font-inter text-[var(--text-muted)]">{filtered.length} shown</span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <XCircle size={40} className="text-[var(--border)] mb-3" />
            <p className="text-sm font-inter font-semibold text-[var(--text-primary)]">No projects found</p>
            <p className="text-xs font-inter text-[var(--text-muted)] mt-1">
              {projects.length === 0 ? (role === "CLIENT" ? "Create your first project to get started." : "You haven't been assigned to any projects yet.") : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} role={role ?? ""} />)}
          </div>
        )}
      </div>

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={fetchProjects} />}
    </DashboardShell>
  );
}
