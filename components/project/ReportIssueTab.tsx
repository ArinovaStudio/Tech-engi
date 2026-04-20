"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Plus, Calendar, User, Shield, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function ReportIssueTab({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showClientIssueModal, setShowClientIssueModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingClientIssue, setCreatingClientIssue] = useState(false);
  const [issueType, setIssueType] = useState("project");
  const [clientIssueTitle, setClientIssueTitle] = useState("");
  const [newReport, setNewReport] = useState({ message: "", taskId: "" });
  const [projectClient, setProjectClient] = useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const role = session?.user?.role?.toUpperCase()?.trim() || "";
  const isAdmin = role === "ADMIN";
  const isEngineer = role === "ENGINEER";
  const isClient = role === "CLIENT";

  const fetchAdmins = async () => {
    // try { const res = await fetch("/api/admin/adminOnly"); const data = await res.json(); if (data.success) (data.users); } catch { }
  };

  const fetchProjectClient = async () => {
    try {
      const res = await fetch(`/api/project/${projectId}`); const data = await res.json();
      if (data.success && data.project) {
        const c = data.project.members?.find((m: any) => m.user?.role.name === "CLIENT");
        if (c) setProjectClient(c.user);
      }
    } catch { }
  };



  useEffect(() => { fetchAdmins(); if (projectId) fetchProjectClient(); }, [projectId]);

  useEffect(() => {
    if (projectId)
    fetchTasks();
  }, [projectId]);

  useEffect(() => { if (tasks.length > 0) fetchAllReports(); }, [tasks]);

  const fetchTasks = async () => {
    try { const res = await fetch(`/api/kanban/task?projectId=${projectId}`); const data = await res.json(); if (data.tasks) setTasks(data.tasks); } catch { } finally { setLoading(false); }
  };

  const fetchAllReports = async () => {
    try {
      const all: any[] = [];
      for (const task of tasks as any[]) {
        try {
          const res = await fetch(`/api/kanban/report?taskId=${task.id}`);
          if (res.ok) { const d = await res.json(); if (d.success && d.messages) all.push(...d.messages.map((m: any) => ({ ...m, taskTitle: task.title }))); }
        } catch { }
      }
      setReports(all.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch { } finally { setLoading(false); }
  };
 
  const createClientIssue = async () => {
    if (!clientIssueTitle.trim()) { toast.error("Please enter a title"); return; }
    if (!projectClient) { toast.error("No client found"); return; }
    try {
      setCreatingClientIssue(true);
      const res = await fetch("/api/client/analytics/risk-blockage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, clientId: (projectClient as any).id, riskTitle: clientIssueTitle.trim() }) });
      const data = await res.json();
      if (data.success) { setShowClientIssueModal(false); setClientIssueTitle(""); toast.success(`Reported to ${(projectClient as any).name}!`); }
      else toast.error(data.message || "Failed");
    } catch { toast.error("Error reporting"); } finally { setCreatingClientIssue(false); }
  };

  const createReport = async () => {
    if (!newReport.message.trim()) { toast.error("Please describe the issue"); return; }
    if (issueType === "task" && !newReport.taskId) { toast.error("Please select a task"); return; }
    try {
      setCreating(true);
      const taskId = issueType === "project" ? (tasks[0] as any)?.id : newReport.taskId;
      if (!taskId) { toast.error("No tasks available"); return; }
      const res = await fetch("/api/kanban/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `[${issueType.toUpperCase()} ISSUE] ${newReport.message.trim()}`, taskId }) });
      const data = await res.json();
      if (data.success) { setShowModal(false); setNewReport({ message: "", taskId: "" }); setIssueType("project"); await fetchAllReports(); toast.success("Issue reported!"); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Error reporting"); } finally { setCreating(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-[var(--border)] font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";

  if (sessionStatus === "loading")
    return (
      <div className="flex items-center justify-center py-12">
        <LucideLoader className="animate-spin" style={{ color: "var(--primary)" }} size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-id flex items-center gap-2" style={{ color: "var(--text-primary)" }}><AlertCircle size={22} /> Report an Issue</h2>
        <div className="flex gap-2">
          {(isAdmin || isEngineer) && (
            <>
              <button onClick={() => setShowClientIssueModal(true)} className="px-4 py-2 text-white rounded-lg flex items-center gap-2 font-inter text-sm bg-red-500 hover:bg-red-600">
                <Shield size={14} /> Client Issue
              </button>
              <button onClick={() => setShowModal(true)} className="px-4 py-2 text-white rounded-lg flex items-center gap-2 font-inter text-sm" style={{ background: "var(--primary)" }}>
                <Plus size={14} /> Report Issue
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg p-4 border" style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}>
        <h3 className="font-semibold font-inter text-sm mb-1" style={{ color: "var(--text-primary)" }}>Issue Reporting Guidelines</h3>
        <ul className="text-xs font-inter space-y-0.5" style={{ color: "var(--text-secondary)" }}>
          <li><strong>Project-Wide:</strong> General problems affecting the entire project</li>
          <li><strong>Task-Specific:</strong> Problems related to individual tasks</li>
        </ul>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--border)" }} />
          <p className="font-inter text-sm" style={{ color: "var(--text-muted)" }}>No issues reported yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => {
            const isProject = report.message.includes("[PROJECT ISSUE]");
            const clean = report.message.replace(/^\[(PROJECT|TASK) ISSUE\]\s*/, "");
            return (
              <div key={report.id} className="bg-white rounded-xl border border-[var(--border)] p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className={isProject ? "text-red-500" : "text-orange-500"} style={{ marginTop: 2 }} />
                  <div className="flex-1">
                    <span className={`text-xs font-semibold font-inter px-2.5 py-0.5 rounded-full border ${isProject ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                      {isProject ? "Project Issue" : "Task Issue"}
                    </span>
                    <p className="text-sm font-inter mt-2" style={{ color: "var(--text-secondary)" }}>{clean}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs font-inter" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1"><User size={11} /> Reported by team member</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showClientIssueModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl border border-[var(--border)] shadow-lg">
            <h3 className="text-lg font-semibold font-inter mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Shield size={18} className="text-red-500" /> Report Client Issue</h3>
            <input type="text" value={clientIssueTitle} onChange={(e) => setClientIssueTitle(e.target.value)} className={`${inputCls} mb-3`} placeholder="Enter client issue title..." disabled={creatingClientIssue} />
            <p className="text-xs font-inter p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">This will be visible in the client's analytics dashboard.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowClientIssueModal(false); setClientIssueTitle(""); }} className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg font-inter text-sm" style={{ color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={createClientIssue} disabled={creatingClientIssue || !clientIssueTitle.trim()} className="px-4 py-2 text-white rounded-lg font-inter text-sm disabled:opacity-40 bg-red-500 hover:bg-red-600">
                {creatingClientIssue ? "Reporting..." : "Report to Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl border border-[var(--border)] shadow-lg">
            <h3 className="text-lg font-semibold font-inter mb-4" style={{ color: "var(--text-primary)" }}>Report an Issue</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-inter mb-1.5" style={{ color: "var(--text-secondary)" }}>Issue Type *</label>
                <div className="flex gap-4">
                  {["project", "task"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm font-inter" style={{ color: "var(--text-secondary)" }}>
                      <input type="radio" value={t} checked={issueType === t} onChange={(e) => setIssueType(e.target.value)} disabled={creating} />
                      {t === "project" ? "Project-Wide" : "Task-Specific"}
                    </label>
                  ))}
                </div>
              </div>
              {issueType === "task" && (
                <div>
                  <label className="block text-sm font-medium font-inter mb-1.5" style={{ color: "var(--text-secondary)" }}>Select Task *</label>
                  <select value={newReport.taskId} onChange={(e) => setNewReport({ ...newReport, taskId: e.target.value })} className={inputCls} disabled={creating}>
                    <option value="">Choose a task...</option>
                    {(tasks as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium font-inter mb-1.5" style={{ color: "var(--text-secondary)" }}>Issue Description *</label>
                <textarea value={newReport.message} onChange={(e) => setNewReport({ ...newReport, message: e.target.value })} className={`${inputCls} resize-none`} rows={4} placeholder="Describe the issue in detail..." disabled={creating} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setNewReport({ message: "", taskId: "" }); setIssueType("project"); }} className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg font-inter text-sm" style={{ color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={createReport} disabled={creating || !newReport.message.trim()} className="px-4 py-2 text-white rounded-lg font-inter text-sm disabled:opacity-40" style={{ background: "var(--primary)" }}>
                {creating ? "Reporting..." : "Report Issue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
