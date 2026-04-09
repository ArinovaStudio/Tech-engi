"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowUp, CheckCheck, LucideCheckCheck, LucideCopy, LucideEdit3,
  LucideTrash, User, X, DollarSign, Palette, ArrowRight
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import LatestUpdates from "./LatestUpdates";
import { useRouter } from "next/navigation";
import BudgetModal from "./BudgetModal";

/* ─── Design Tokens (matching dashboard) ─────────────────────────────── */
const T = {
  bg: "#f4f4f4",
  card: "#ffffff",
  border: "#e5e5e5",
  primary: "#FFAE58",
  primaryLight: "#fff4e6",
  text: "#050A30",
  textSec: "#4B4B4B",
  textMuted: "#6F6F6F",
  danger: "#ef4444",
  purple: "#8b5cf6",
} as const;

/* ─── Types ───────────────────────────────────────────────────────────── */
type Member = {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string | { name?: string };
    isLogin?: boolean;
  };
  role?: string | { name?: string };
  isLeader?: boolean;
};

type Project = {
  id: string;
  name: string;
  repository: string;
  summary: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
  basicDetails: string | null;
  membersCount: number;
  members: Member[];
  progress?: number;
  ongoingMilestones?: number;
  totalMilestones?: number;
  projectInfo?: {
    budget?: number;
    startDate?: string;
    deadline?: string;
    projectType?: string;
    supervisorAdmin?: string;
  };
};

interface OverviewTabProps {
  project: Project;
}

/* ─── Shared input style ──────────────────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-300 bg-white text-[#050A30] border-[#e5e5e5]";

/* ─── ArrayInput ──────────────────────────────────────────────────────── */
const ArrayInput = ({ label, value = [], onChange, placeholder }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(", ") || !val.includes(",")) {
      onChange(val.split(",").map((s) => s.trim()).filter(Boolean));
    } else {
      onChange(val.split(",").map((s) => s.trim()));
    }
  };
  const displayValue = Array.isArray(value) ? value.join(", ") : "";
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: T.text }}>{label}</label>
      <input type="text" value={displayValue} onChange={handleChange} className={inputCls} placeholder={placeholder} />
    </div>
  );
};

/* ─── KeyValueInput ───────────────────────────────────────────────────── */
const KeyValueInput = ({ label, value, onChange }: any) => {
  const handleChange = (index: number, field: string, newValue: string) => {
    const updated = { ...value };
    const keys = Object.keys(updated);
    const key = keys[index];
    if (field === "key") { const val = updated[key]; delete updated[key]; updated[newValue] = val; }
    else { updated[key] = newValue; }
    onChange(updated);
  };
  const addRow = () => onChange({ ...value, "": "" });
  const removeRow = (k: string) => { const u = { ...value }; delete u[k]; onChange(u); };
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: T.text }}>{label}</label>
      {Object.entries(value).map(([key, val], index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input type="text" value={key} onChange={(e) => handleChange(index, "key", e.target.value)} placeholder="Key" className={inputCls} />
          <input type="text" value={val as string} onChange={(e) => handleChange(index, "value", e.target.value)} placeholder="Value" className={inputCls} />
          <button type="button" onClick={() => removeRow(key)} className="px-2 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 text-sm">✕</button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="text-sm mt-1" style={{ color: T.primary }}>+ Add</button>
    </div>
  );
};

/* ─── DesignerModal ───────────────────────────────────────────────────── */
const DesignerModal = ({ showModal, projectData, currentUser }: any) => {
  const [loading, setLoading] = useState(false);
  const [designSystemData, setDesignSystemData] = useState({
    brandName: "", brandFeel: "", colors: [], fonts: {},
    designType: [], layoutStyle: {}, contentTone: [],
    visualGuidelines: {}, theme: [], keyPages: [], uniqueness: {},
  });

  const parseDesignData = (data: any) => {
    const ensureArray = (arr: any) => Array.isArray(arr) ? arr.filter((i: any) => i && i !== "null") : [];
    const ensureObject = (obj: any) => (typeof obj === "object" && obj !== null) ? obj : {};
    return {
      brandName: data.brandName || "",
      brandFeel: (data.brandFeel && data.brandFeel !== "null") ? data.brandFeel : "",
      colors: ensureArray(data.colors), designType: ensureArray(data.designType),
      contentTone: ensureArray(data.contentTone), theme: ensureArray(data.theme),
      keyPages: ensureArray(data.keyPages), fonts: ensureObject(data.fonts),
      layoutStyle: ensureObject(data.layoutStyle), visualGuidelines: ensureObject(data.visualGuidelines),
      uniqueness: ensureObject(data.uniqueness),
    };
  };

  const fetchDesignData = useCallback(async () => {
    if (!projectData.id) return;
    try {
      const clientMember = projectData.members?.find(isClientMember);
      const clientId = clientMember?.user?.id;
      if (clientId) {
        const response = await fetch(`/api/client/analytics/design?clientId=${clientId}&projectId=${projectData.id}`);
        const result = await response.json();
        if (result.success && result.data) setDesignSystemData({
  ...designSystemData,
  colors: result.data.colors as never[], // explicitly specify the type
  // other properties
});
      }
    } catch { toast.error("Failed to load design data"); }
  }, [projectData]);

  useEffect(() => { fetchDesignData(); }, [fetchDesignData]);

  const updateDesignSystem = (field: string, value: any) =>
    setDesignSystemData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clientMember = projectData.members?.find(isClientMember);
      const clientId = clientMember?.user?.id;
      if (!clientId) throw new Error("Client not found for this project");
      await fetch("/api/design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.id, ...designSystemData }),
      });
      toast.success("Design data updated successfully");
      showModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update design data");
    } finally { setLoading(false); }
  };

  const modalOverlay: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(5,10,48,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100, padding: "1rem", backdropFilter: "blur(4px)",
  };
  const modalCard: React.CSSProperties = {
    background: T.card, borderRadius: 16, width: "100%", maxWidth: 680,
    maxHeight: "82vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(5,10,48,0.12)",
    border: `1px solid ${T.border}`,
  };

  return (
    <div style={modalOverlay}>
      <div style={modalCard}>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: T.text, margin: 0 }}>Designer Dashboard</h2>
            <button onClick={() => showModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.textMuted, padding: 6, borderRadius: 8 }}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, margin: 0 }}>Design System</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 }}>Brand Name</label>
                  <input type="text" value={designSystemData.brandName} onChange={(e) => updateDesignSystem("brandName", e.target.value)} className={inputCls} placeholder="Enter brand name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 }}>Brand Feel</label>
                  <input type="text" value={designSystemData.brandFeel} onChange={(e) => updateDesignSystem("brandFeel", e.target.value)} className={inputCls} placeholder="e.g., Modern, Professional" />
                </div>
              </div>
              <ArrayInput label="Colors (comma-separated hex)" value={designSystemData.colors} onChange={(v: any) => updateDesignSystem("colors", v)} placeholder="#FF5733,#33FF57" />
              <ArrayInput label="Design Type" value={designSystemData.designType} onChange={(v: any) => updateDesignSystem("designType", v)} placeholder="Minimalist, Corporate" />
              <ArrayInput label="Content Tone" value={designSystemData.contentTone} onChange={(v: any) => updateDesignSystem("contentTone", v)} placeholder="Professional, Friendly" />
              <ArrayInput label="Theme" value={designSystemData.theme} onChange={(v: any) => updateDesignSystem("theme", v)} placeholder="Dark, Light" />
              <ArrayInput label="Key Pages" value={designSystemData.keyPages} onChange={(v: any) => updateDesignSystem("keyPages", v)} placeholder="Home, About, Contact" />
              <KeyValueInput label="Fonts" value={designSystemData.fonts} onChange={(v: any) => updateDesignSystem("fonts", v)} />
              <KeyValueInput label="Layout Style" value={designSystemData.layoutStyle} onChange={(v: any) => updateDesignSystem("layoutStyle", v)} />
              <KeyValueInput label="Visual Guidelines" value={designSystemData.visualGuidelines} onChange={(v: any) => updateDesignSystem("visualGuidelines", v)} />
              <KeyValueInput label="Uniqueness" value={designSystemData.uniqueness} onChange={(v: any) => updateDesignSystem("uniqueness", v)} />
            </div>
            <div style={{ display: "flex", gap: 12, paddingTop: "0.5rem" }}>
              <button type="button" onClick={() => showModal(false)}
                style={{ flex: 1, padding: "10px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.text, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: "10px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? <><div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Updating...</> : <><CheckCheck size={15} />Update Design Data</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



/* ─── EditModal ───────────────────────────────────────────────────────── */
const EditModal = ({ showModel, projectData }: any) => {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [techStack, setTechStack] = useState<any[]>([]);
  const [newTech, setNewTech] = useState({ key: "", value: "" });
  const [customCategory, setCustomCategory] = useState("");
  const [currentPhase, setCurrentPhase] = useState("");

  const [formData, setFormData] = useState({
    name: projectData.name, summary: projectData.summary,
    priority: projectData.priority, repository: projectData.repository,
    basicDetails: projectData.basicDetails,
    budget: projectData.projectInfo?.budget,
    projectType: projectData.projectInfo?.projectType,
    startDate: projectData.projectInfo?.startDate,
    deadline: projectData.projectInfo?.deadline,
    supervisorAdmin: projectData.projectInfo?.supervisorAdmin,
  });

  const predefinedTech = [
    { key: "Design", options: ["Figma", "Adobe XD", "Sketch", "Canva"] },
    { key: "Frontend", options: ["React", "Next.js", "Vue.js", "Angular"] },
    { key: "Backend", options: ["Node.js", "Python", "Java", "PHP"] },
    { key: "Database", options: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
    { key: "Hosting", options: ["Vercel", "AWS", "Netlify", "Heroku"] },
  ];

  const fetchTechnology = async () => {
    try {
      const clientMember = projectData.members?.find(isClientMember);
      const clientId = clientMember?.user?.id;
      if (clientId) {
        const response = await fetch(`/api/client/analytics/design?clientId=${clientId}&projectId=${projectData.id}`);
        const data = await response.json();
        if (data.success && data.data?.technology && Array.isArray(data.data.technology)) setTechStack(data.data.technology);
        if (data.success && data.data?.projectPhase?.current) setCurrentPhase(data.data.projectPhase.current);
      } else {
        const response = await fetch(`/api/project/technology?projectId=${projectData.id}`);
        const data = await response.json();
        if (data.success && data.data?.tech) setTechStack(data.data.tech);
      }
    } catch { /* silent */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.id, ...formData }),
      });
      await fetch("/api/project/technology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.id, tech: techStack }),
      });
      if (currentPhase) {
        const clientMember = projectData.members?.find(isClientMember);
        const clientId = clientMember?.user?.id;
        if (clientId) {
          await fetch("/api/client/analytics/design", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId, projectId: projectData.id, currentPhase }),
          });
        }
      }
      const result = await response.json();
      if (result.success) { toast.success("Project updated successfully"); showModel(false); }
      else toast.error("Failed to update project");
    } catch { toast.error("Failed to update project"); }
    finally { setLoading(false); window.location.reload(); }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/admin/adminOnly");
        const d = await r.json();
        if (d.success) setAdmins(d.users);
      } catch { /* silent */ } finally { setLoading(false); }
    })();
    if (projectData.id) fetchTechnology();
  }, [projectData.id]);

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 };
  const selectCls = "w-full px-3 py-2 border border-[#e5e5e5] rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-300 bg-white text-[#050A30]";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,48,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
      <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 760, maxHeight: "82vh", overflowY: "auto", border: `1px solid ${T.border}`, boxShadow: "0 8px 40px rgba(5,10,48,0.12)" }}>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: T.text, margin: 0 }}>Edit Project</h2>
            <button onClick={() => showModel(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.textMuted }}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Project Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Enter project name" required /></div>
              <div><label style={labelStyle}>Project Type *</label>
                <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className={selectCls} required>
                  <option value="">Select project type</option>
                  <option value="saas">AI</option>
                  <option value="e-commerce">Cyber Security</option>
                  <option value="saas">SaaS</option>
                  <option value="static">Static Website</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="web-app">Web Application</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="web-app">Other</option>
                </select></div>
              <div><label style={labelStyle}>Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={selectCls}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select></div>
              <div><label style={labelStyle}>Budget *</label>
                <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={inputCls} placeholder="Enter budget" required /></div>
              <div><label style={labelStyle}>Start Date *</label>
                <input type="date" value={formData.startDate?.split("T")[0]} disabled className={inputCls + " opacity-60 cursor-not-allowed"} required /></div>
              <div><label style={labelStyle}>Deadline *</label>
                <input type="date" value={formData.deadline?.split("T")[0]} min={formData.startDate?.split("T")[0]} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className={inputCls} required /></div>
              <div><label style={labelStyle}>Supervisor Admin *</label>
                <select value={formData.supervisorAdmin} onChange={(e) => setFormData({ ...formData, supervisorAdmin: e.target.value })} className={selectCls} required>
                  <option value="">{loading ? "Loading..." : "Select supervisor"}</option>
                  {admins.map((a) => <option key={a.id} value={a.id}>{a.name} – {a.workingAs || "Admin"}</option>)}
                </select></div>
              <div><label style={labelStyle}>Repository</label>
                <input type="text" value={formData.repository || ""} onChange={(e) => setFormData({ ...formData, repository: e.target.value })} className={inputCls} placeholder="URL ending in .git" /></div>
            </div>

            {/* Tech Stack */}
            <div>
              <label style={labelStyle}>Technology Stack</label>
              {techStack.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  {techStack.map((tech, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontSize: 13, color: T.text }}><strong>{tech.key}:</strong> {tech.value}</span>
                      <button type="button" onClick={() => setTechStack(techStack.filter((_, idx) => idx !== i))} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.danger }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>No technology stack configured yet</p>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
                <select value={newTech.key} onChange={(e) => setNewTech({ ...newTech, key: e.target.value, value: "" })} className={selectCls}>
                  <option value="">Category</option>
                  {predefinedTech.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
                  <option value="custom">Custom</option>
                </select>
                {newTech.key === "custom" ? (
                  <input type="text" placeholder="Custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className={inputCls} />
                ) : newTech.key && predefinedTech.find((c) => c.key === newTech.key) ? (
                  <select value={newTech.value} onChange={(e) => setNewTech({ ...newTech, value: e.target.value })} className={selectCls}>
                    <option value="">Select tech</option>
                    {predefinedTech.find((c) => c.key === newTech.key)?.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Technology" value={newTech.value} onChange={(e) => setNewTech({ ...newTech, value: e.target.value })} className={inputCls} />
                )}
                <button type="button"
                  onClick={() => {
                    if (newTech.key === "custom" && customCategory && newTech.value) {
                      setTechStack([...techStack, { key: customCategory, value: newTech.value }]);
                      setNewTech({ key: "", value: "" }); setCustomCategory("");
                    } else if (newTech.key && newTech.value) {
                      setTechStack([...techStack, newTech]); setNewTech({ key: "", value: "" });
                    }
                  }}
                  disabled={newTech.key === "custom" ? (!customCategory || !newTech.value) : (!newTech.key || !newTech.value)}
                  style={{ padding: "8px 14px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Add
                </button>
              </div>
            </div>

            {/* Phase */}
            <div><label style={labelStyle}>Current Project Phase</label>
              <select value={currentPhase} onChange={(e) => setCurrentPhase(e.target.value)} className={selectCls}>
                <option value="">Select phase</option>
                <option value="Design">Design</option>
                <option value="Code">Code</option>
                <option value="Testing">Testing</option>
                <option value="Deployment">Deployment</option>
              </select></div>

            <div><label style={labelStyle}>Summary</label>
              <textarea value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className={inputCls} rows={3} placeholder="Brief project summary" /></div>
            <div><label style={labelStyle}>Basic Details</label>
              <textarea value={formData.basicDetails} onChange={(e) => setFormData({ ...formData, basicDetails: e.target.value })} className={inputCls} rows={4} placeholder="Detailed description" /></div>

            <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
              <button type="button" onClick={() => showModel(false)}
                style={{ flex: 1, padding: "10px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.text, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: "10px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Updating..." : <><CheckCheck size={15} />Update Project</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ─── ProgressGauge ───────────────────────────────────────────────────── */
const ProgressGauge = ({ progress }: { progress?: number }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - ((progress || 0) / 100) * circumference;
  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <svg style={{ width: 120, height: 120, transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#e5e5e5" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="45" stroke={T.primary} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: T.text }}>{progress || 0}%</span>
      </div>
    </div>
  );
};

/* ─── Role helpers ────────────────────────────────────────────────────── */
const getUserRoleName = (m: Member) => {
  const r = m.user?.role;
  return r && typeof r !== "string" ? r.name : r;
};
const getMemberRoleName = (m: Member) => {
  const mr = m.role && typeof m.role !== "string" ? m.role.name : m.role;
  return mr || getUserRoleName(m) || "Team Member";
};
const isClientMember = (m: Member) => getUserRoleName(m) === "CLIENT";

/* ─── TeamMemberCard ──────────────────────────────────────────────────── */
const TeamMemberCard = ({ member }: { member: Member }) => {
  const name = member.user?.name || "Unknown";
  const image = member.user?.image;
  const isLogin = member.user?.isLogin;
  const roleName = getMemberRoleName(member);
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {image ? <img src={image} alt={name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} /> : <User size={24} color={T.textMuted} />}
        <span style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: isLogin ? "#22c55e" : "#d1d5db", border: "1.5px solid #fff" }} />
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.text }}>{name}</p>
        <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>{roleName}</p>
      </div>
    </div>
  );
};

/* ─── Priority badge ──────────────────────────────────────────────────── */
const PriorityBadge = ({ priority }: { priority: string }) => {
  const map: Record<string, { bg: string; color: string }> = {
    HIGH: { bg: "#fee2e2", color: "#ef4444" },
    MEDIUM: { bg: "#fef9c3", color: "#d97706" },
    LOW: { bg: "#dcfce7", color: "#16a34a" },
  };
  const s = map[priority] || map.LOW;
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {priority} Priority
    </span>
  );
};

/* ─── Main OverviewTab ────────────────────────────────────────────────── */
export default function OverviewTab({ project }: OverviewTabProps) {
  const [milestones, setMilestones] = useState({ ongoing: 0, total: 0 });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newProgress, setNewProgress] = useState(project?.progress || 0);
  const [currentProgress, setCurrentProgress] = useState(project?.progress || 0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEmployee, setEmployee] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetData, setBudgetData] = useState({ scopeTitle: "", paidAmount: 0, totalBudget: project?.projectInfo?.budget || 0, docs: [] });
  const [clientId, setClientId] = useState<string | null>(null);
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDesigner, setIsDesigner] = useState(false);
  const [designSystemInfo, setDesignSystemInfo] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const copyTextToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (!project?.id) return;
    setNewProgress(project.progress || 0);
    setCurrentProgress(project.progress || 0);

    const checkUserRole = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        const role = parsed?.user?.role || parsed?.role || null;
        if (!role) return;
        const roleName = (typeof role === "string" ? role : role.name)?.toUpperCase().trim();
        if (roleName === "ADMIN") setIsAdmin(true);
        if (roleName === "EMPLOYEE") setEmployee(true);
        const clientMember = project.members?.find(isClientMember);
        if (clientMember?.user?.id) {
          setClientId(clientMember.user.id);
          try {
            const br = await fetch(`/api/client/analytics/budget?clientId=${clientMember.user.id}&projectId=${project.id}`);
            const bd = await br.json();
            if (bd.success) setBudgetData({ scopeTitle: bd.data.scopeTitle || "", paidAmount: bd.data.paidAmount || 0, totalBudget: bd.data.totalBudget || 0, docs: bd.data.docs || [] });
          } catch { /* silent */ }
          try {
            const dr = await fetch(`/api/client/analytics/design?clientId=${clientMember.user.id}&projectId=${project.id}`);
            const dd = await dr.json();
            if (dd.success) setDesignSystemInfo(dd.data);
          } catch { /* silent */ }
        }
      } catch { /* silent */ }
    };

    const fetchMilestones = async () => {
      try {
        const res = await fetch(`/api/project/milestone?projectId=${project.id}`);
        const data = await res.json();
        if (data.success && data.milestones) {
          const total = data.milestones.length;
          const ongoing = data.milestones.filter((m: any) => m.status === "PENDING" || m.status === "IN_PROGRESS").length;
          setMilestones({ ongoing, total });
        }
      } catch { /* silent */ }
    };

    checkUserRole();
    fetchMilestones();
  }, [project]);

  const handleProgressUpdate = async () => {
    if (newProgress < 0 || newProgress > 100) { toast.error("Progress must be 0–100"); return; }
    setUpdating(true);
    try {
      const r = await fetch(`/api/project/progress?id=${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });
      if (r.ok) { toast.success("Progress updated"); setShowProgressModal(false); setCurrentProgress(newProgress); }
      else { const d = await r.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Failed to update progress"); }
    finally { setUpdating(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      const r = await fetch(`/api/project?projectId=${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) { toast.success("Deleted"); router.back(); }
      else toast.error(d.message || "Failed");
    } catch { toast.error("Failed to delete project"); }
  };

  if (!project) return null;

  /* ── Card style shortcuts ── */
  const card: React.CSSProperties = {
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: "1.5rem",
  };

  const HoverReveal = ({ text }: { text: string }) => (
    <span style={{ fontSize: 13, fontWeight: 500, color: T.text, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }} title={text}>{text}</span>
  );

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ background: T.bg, padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {editModel && <EditModal showModel={setEditModel} projectData={project} />}
        {showDesignerModal && <DesignerModal showModal={setShowDesignerModal} projectData={project} currentUser={currentUser} />}

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Progress + Milestones row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

            {/* Progress card */}
            <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <ProgressGauge progress={currentProgress} />
              <p style={{ margin: "12px 0 0", fontWeight: 600, fontSize: 14, color: T.text }}>Overall Progress</p>
              {(isAdmin) && (
                <button onClick={() => { setNewProgress(project.progress || 0); setShowProgressModal(true); }}
                  style={{ marginTop: 10, padding: "5px 16px", background: T.primaryLight, border: `1px solid ${T.primary}`, borderRadius: 20, color: T.primary, cursor: "pointer", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <ArrowUp size={13} /> Update
                </button>
              )}
            </div>

            {/* Milestones card */}
            <div style={{ background: T.primary, borderRadius: 16, padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {milestones.ongoing}<span style={{ fontSize: 28, fontWeight: 400 }}>/{milestones.total}</span>
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Ongoing Milestones</p>
              </div>
            </div>
          </div>

          {/* Repository */}
          {project?.repository && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>Repository</h2>
              <div style={{ background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, color: T.textMuted }}>{project.repository?.split("/")[4]?.split(".git")[0]}</p>
                <div style={{ background: "#dbeafe", border: "1px solid #93c5fd", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <code style={{ fontSize: 12, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.repository}</code>
                  <button onClick={() => copyTextToClipboard(project.repository)}
                    style={{ width: 28, height: 28, borderRadius: 6, background: T.primary, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
                    {isCopied ? <LucideCheckCheck size={13} color="#fff" /> : <LucideCopy size={13} color="#fff" />}
                  </button>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textMuted, textAlign: "right" }}>Clone the Repository</p>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Team Members</h2>
            {project.members && project.members.length > 0
              ? project.members.map((m, i) => {
                if (isEmployee && getUserRoleName(m) === "CLIENT") return null;
                return <TeamMemberCard key={m.user?.id || i} member={m} />;
              })
              : <p style={{ fontSize: 13, color: T.textMuted }}>No team members assigned</p>}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Project Information */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>Project Information</h2>
              {isAdmin && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {/* Designer + Budget icon group */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.bg, borderRadius: 20, padding: "4px 10px", border: `1px solid ${T.border}`, marginRight: 4 }}>
                    <button onClick={() => setShowDesignerModal(true)} title="Design System"
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: T.textMuted, display: "flex", padding: 0 }}>
                      <Palette size={15} />
                    </button>
                    <button onClick={() => setShowBudgetModal(true)} title="Edit Budget"
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: T.textMuted, display: "flex", padding: 0 }}>
                      <DollarSign size={16} />
                    </button>
                  </div>
                  <button onClick={() => setEditModel(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: T.textMuted, padding: 4 }}><LucideEdit3 size={16} /></button>
                  <button onClick={() => deleteProject(project.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: T.textMuted, padding: 4 }}><LucideTrash size={16} /></button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <PriorityBadge priority={project.priority} />

              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: T.text }}>{project.name}</h3>
                <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{project.summary}</p>
              </div>

              {isAdmin && project.projectInfo?.budget && (
                <div style={{ background: T.bg, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Budget</p>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.text }}>₹{project.projectInfo.budget.toLocaleString()}</p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {project.projectInfo?.startDate && (
                  <div style={{ background: T.bg, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Start Date</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{new Date(project.projectInfo.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                )}
                {project.projectInfo?.deadline && (
                  <div style={{ background: T.bg, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Deadline</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{new Date(project.projectInfo.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                )}
              </div>

              {project.basicDetails && (
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Details</p>
                  <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{project.basicDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Work Done History */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 1rem" }}>Work Done History</h2>
            <LatestUpdates projectId={project.id} />
          </div>
        </div>
      </div>

      {/* ── Design System Section ── */}
      {/* {designSystemInfo && (
        <div style={{ padding: "0 1.5rem 1.5rem", background: T.bg }}>
          <div style={{ display: "flex", gap: "1.5rem" }}>

            <div style={{ background: T.card, borderRadius: 16, padding: "1.5rem", border: `2px solid ${T.primary}`, position: "relative", minWidth: 300 }}>
              <span style={{ position: "absolute", top: -13, right: 60, background: T.primary, color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 14px", borderRadius: 4 }}>Design System</span>

              <div style={{ marginTop: 8 }}>
                {designSystemInfo.colors?.length > 0 && designSystemInfo.colors[0] !== "null" && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: T.text }}>Colors</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {designSystemInfo.colors.map((color: string, i: number) => (
                        <div key={i} title={color.toUpperCase()} style={{ width: 32, height: 32, borderRadius: "50%", background: color, border: `1.5px solid ${T.border}`, cursor: "pointer" }} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ overflow: "hidden", height: 140 }}>
                  <div style={{ display: "flex", transition: "transform 0.4s ease", transform: `translateX(-${currentSlide * 100}%)` }}>
                    <div style={{ minWidth: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      {designSystemInfo.brandName && <InfoRow label="Brand Name" value={designSystemInfo.brandName} />}
                      {designSystemInfo.designType?.length > 0 && designSystemInfo.designType[0] !== "null" && <InfoRow label="Design Type" value={designSystemInfo.designType.join(", ")} />}
                      {designSystemInfo.brandFeel && designSystemInfo.brandFeel !== "null" && <InfoRow label="Brand Feel" value={designSystemInfo.brandFeel} />}
                    </div>
                    <div style={{ minWidth: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      {designSystemInfo.contentTone?.length > 0 && designSystemInfo.contentTone[0] !== "null" && <InfoRow label="Content Tone" value={designSystemInfo.contentTone.join(", ")} />}
                      {designSystemInfo.theme?.length > 0 && designSystemInfo.theme[0] !== "null" && <InfoRow label="Theme" value={designSystemInfo.theme.join(", ")} />}
                      {designSystemInfo.keyPages?.length > 0 && designSystemInfo.keyPages[0] !== "null" && <InfoRow label="Key Pages" value={designSystemInfo.keyPages.join(", ")} />}
                    </div>
                    <div style={{ minWidth: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      {designSystemInfo.fonts && Object.keys(designSystemInfo.fonts).length > 0 && <InfoRow label="Fonts" value={Object.keys(designSystemInfo.fonts).join(", ")} />}
                      {designSystemInfo.layoutStyle && Object.keys(designSystemInfo.layoutStyle).length > 0 && <InfoRow label="Layout Style" value={Object.keys(designSystemInfo.layoutStyle).join(", ")} />}
                      {designSystemInfo.visualGuidelines && Object.keys(designSystemInfo.visualGuidelines).length > 0 && <InfoRow label="Visual Guidelines" value={Object.keys(designSystemInfo.visualGuidelines).join(", ")} />}
                    </div>
                    <div style={{ minWidth: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      {designSystemInfo.uniqueness && Object.keys(designSystemInfo.uniqueness).length > 0 && <InfoRow label="Uniqueness" value={Object.keys(designSystemInfo.uniqueness).join(", ")} />}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                  {currentSlide > 0 && (
                    <button onClick={() => setCurrentSlide((p) => p - 1)}
                      style={{ width: 30, height: 30, borderRadius: "50%", background: T.primaryLight, border: `1px solid ${T.primary}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ArrowRight size={14} color={T.primary} style={{ transform: "rotate(180deg)" }} />
                    </button>
                  )}
                  {currentSlide < 3 && (
                    <button onClick={() => setCurrentSlide((p) => p + 1)}
                      style={{ width: 30, height: 30, borderRadius: "50%", background: T.primaryLight, border: `1px solid ${T.primary}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ArrowRight size={14} color={T.primary} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, display: "flex", overflow: "hidden" }}>
              <div style={{ flex: 1, padding: "1.5rem", borderRight: `1px solid ${T.border}` }}>
                <p style={{ margin: "0 0 1rem", fontSize: 14, color: T.textMuted, fontWeight: 500 }}>Current Phase</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(designSystemInfo.projectPhase?.phases || [{ name: designSystemInfo.projectPhase?.current || "Design" }]).map((phase: any) => {
                    const isActive = phase.name === designSystemInfo.projectPhase?.current;
                    return (
                      <div
                        key={phase.name}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-all
      ${isActive ? "bg-[#FFAE58] text-white" : "text-[#6F6F6F]"}`}
                      >
                        {phase.name}
                      </div>
                    );
                  }) || (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium bg-[#FFAE58] text-white">
                        {designSystemInfo.projectPhase?.current || 'Design'}
                      </div>
                    )}
                </div>
              </div>

              <div className="h-full w-1 bg-[#e5e5e5] flex-shrink-0"></div>

              <div className="flex-1 p-6 relative overflow-hidden min-w-0">
                <div className="relative flex flex-col mb-5 items-start">
                  <h3 className="text-xl text-[#6F6F6F] mb-6">
                    Technology Used
                  </h3>
                  <div className="h-px w-[calc(100%+40px)] absolute -left-10 top-8 bg-[#e5e5e5]"></div>
                </div>

                {designSystemInfo.technology && designSystemInfo.technology.length > 0 ? (
                  <div className="space-y-5 text-sm overflow-y-auto max-h-[260px] pr-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {designSystemInfo.technology.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center gap-4">
                        <span className="text-[#6F6F6F] flex-shrink-0">{item.key}</span>
                        <span className="font-medium text-[#050A30] text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#6F6F6F] text-sm text-center py-8">
                    No technology stack configured
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}