"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { Plus, Search, Filter, Users, Calendar, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  summary: string;
  basicDetails: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  membersCount: number;
  progress: number;
  createdAt: string;
}

interface TechEntry {
  key: string;
  value: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATIC_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "E-commerce Revamp",
    summary:
      "Full redesign and rebuild of the client shopping portal with improved UX and performance optimizations.",
    basicDetails: "Includes cart, checkout, and payment gateway integration.",
    priority: "HIGH",
    membersCount: 5,
    progress: 68,
    createdAt: "2024-11-12",
  },
  {
    id: "p2",
    name: "AI Analytics Dashboard",
    summary:
      "Internal analytics dashboard powered by ML models for real-time business insights and forecasting.",
    basicDetails: "Python backend with React frontend.",
    priority: "MEDIUM",
    membersCount: 3,
    progress: 35,
    createdAt: "2025-01-05",
  },
  {
    id: "p3",
    name: "Mobile Banking App",
    summary:
      "Cross-platform mobile app for retail banking with biometric authentication and instant transfers.",
    basicDetails: "React Native, Node.js, PostgreSQL stack.",
    priority: "HIGH",
    membersCount: 7,
    progress: 82,
    createdAt: "2024-09-22",
  },
  {
    id: "p4",
    name: "CMS Static Site",
    summary:
      "Lightweight static site built on Next.js with headless CMS integration for the marketing team.",
    basicDetails: "Deployed on Vercel with Contentful.",
    priority: "LOW",
    membersCount: 2,
    progress: 95,
    createdAt: "2025-02-14",
  },
  {
    id: "p5",
    name: "Cyber Security Audit Tool",
    summary:
      "Automated vulnerability scanning and reporting tool for internal infrastructure assessments.",
    basicDetails: "Python-based scanner with exportable PDF reports.",
    priority: "MEDIUM",
    membersCount: 4,
    progress: 20,
    createdAt: "2025-03-01",
  },
  {
    id: "p6",
    name: "SaaS HR Platform",
    summary:
      "Multi-tenant HR management SaaS with payroll, attendance, and leave management modules.",
    basicDetails: "Node.js, MongoDB, React. Hosted on AWS.",
    priority: "HIGH",
    membersCount: 6,
    progress: 55,
    createdAt: "2024-12-18",
  },
];

const STATIC_USERS: User[] = [
  { id: "u1", name: "Priya Sharma", role: "Developer", department: "Engineering" },
  { id: "u2", name: "Rahul Mehta", role: "Designer", department: "Design" },
  { id: "u3", name: "Anjali Singh", role: "QA Engineer", department: "Testing" },
  { id: "u4", name: "Vikram Nair", role: "Backend Dev", department: "Engineering" },
  { id: "u5", name: "Neha Kapoor", role: "PM", department: "Management" },
];

const STATIC_ADMINS = [
  { id: "a1", name: "Alex Johnson", workingAs: "CTO" },
  { id: "a2", name: "Sarah Chen", workingAs: "VP Engineering" },
  { id: "a3", name: "Mark Davis", workingAs: "Director" },
];

const PREDEFINED_TECH: { key: string; options: string[] }[] = [
  { key: "Design", options: ["Figma", "Adobe XD", "Sketch", "Canva"] },
  { key: "Frontend", options: ["React", "Next.js", "Vue.js", "Angular"] },
  { key: "Backend", options: ["Node.js", "Python", "Java", "PHP"] },
  { key: "Database", options: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { key: "Hosting", options: ["Vercel", "AWS", "Netlify", "Heroku"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getPriorityClasses = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {project.name}
        </h3>
        <span
          className={`shrink-0 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getPriorityClasses(project.priority)}`}
        >
          {project.priority}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
        {project.summary || "No summary available"}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <span className="flex items-center gap-1.5">
          <Users size={13} />
          {project.membersCount} members
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {formatDate(project.createdAt)}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progress</span>
          <span className="font-medium text-gray-600">{project.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {project.basicDetails && (
        <p className="text-xs text-gray-400 line-clamp-2 mt-3 pt-3 border-t border-gray-100">
          {project.basicDetails}
        </p>
      )}
    </div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  summary: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  basicDetails: string;
  budget: string;
  projectType: string;
  startDate: string;
  deadline: string;
  supervisorAdmin: string;
  repository: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  summary: "",
  priority: "MEDIUM",
  basicDetails: "",
  budget: "",
  projectType: "",
  startDate: "",
  deadline: "",
  supervisorAdmin: "",
  repository: "",
};

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

function CreateModal({ onClose, onSubmit }: CreateModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [techStack, setTechStack] = useState<TechEntry[]>([]);
  const [newTechKey, setNewTechKey] = useState("");
  const [newTechValue, setNewTechValue] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [currentPhase, setCurrentPhase] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = PREDEFINED_TECH.find((c) => c.key === newTechKey);
  const filteredUsers = STATIC_USERS.filter((u) =>
    u.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const handleField = (
    key: keyof FormData,
    value: string
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  const addTech = () => {
    const key = newTechKey === "custom" ? customCategory : newTechKey;
    const value = newTechValue.trim();
    if (!key || !value) return;
    setTechStack((prev) => [...prev, { key, value }]);
    setNewTechKey("");
    setNewTechValue("");
    setCustomCategory("");
  };

  const removeTech = (idx: number) =>
    setTechStack((prev) => prev.filter((_, i) => i !== idx));

  const toggleMember = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, projectType, budget, startDate, deadline, supervisorAdmin } = formData;
    if (!name.trim() || !projectType || !budget || !startDate || !deadline || !supervisorAdmin) {
      setError("Please fill all required fields.");
      return;
    }
    const newProject: Project = {
      id: `p_${Date.now()}`,
      name: formData.name,
      summary: formData.summary || "No summary provided.",
      basicDetails: formData.basicDetails,
      priority: formData.priority,
      membersCount: selectedMembers.length,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    onSubmit(newProject);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none" }}
      >
        <div className="p-7">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold text-gray-900">Create new project</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleField("name", e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => handleField("projectType", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select type</option>
                  {["AI", "Cyber Security", "SaaS", "Static Website", "E-commerce", "Web Application", "Mobile App", "Other"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleField("priority", e.target.value as FormData["priority"])}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleField("budget", e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleField("startDate", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  min={formData.startDate}
                  onChange={(e) => handleField("deadline", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Supervisor admin <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supervisorAdmin}
                  onChange={(e) => handleField("supervisorAdmin", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select supervisor</option>
                  {STATIC_ADMINS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} – {a.workingAs}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Repository</label>
                <input
                  type="text"
                  value={formData.repository}
                  onChange={(e) => handleField("repository", e.target.value)}
                  placeholder="URL ending in .git"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technology stack</label>
              {techStack.length > 0 && (
                <div className="space-y-2 mb-3">
                  {techStack.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <span>
                        <strong className="text-gray-800">{t.key}:</strong>{" "}
                        <span className="text-gray-600">{t.value}</span>
                      </span>
                      <button type="button" onClick={() => removeTech(i)} className="text-red-400 hover:text-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={newTechKey}
                  onChange={(e) => { setNewTechKey(e.target.value); setNewTechValue(""); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Category</option>
                  {PREDEFINED_TECH.map((c) => (
                    <option key={c.key} value={c.key}>{c.key}</option>
                  ))}
                  <option value="custom">Custom</option>
                </select>

                {newTechKey === "custom" ? (
                  <input
                    type="text"
                    placeholder="Category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : selectedCategory ? (
                  <select
                    value={newTechValue}
                    onChange={(e) => setNewTechValue(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Technology</option>
                    {selectedCategory.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Technology"
                    value={newTechValue}
                    onChange={(e) => setNewTechValue(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {newTechKey === "custom" && (
                  <input
                    type="text"
                    placeholder="Technology"
                    value={newTechValue}
                    onChange={(e) => setNewTechValue(e.target.value)}
                    className="col-start-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <button
                  type="button"
                  onClick={addTech}
                  disabled={
                    newTechKey === "custom"
                      ? !customCategory || !newTechValue
                      : !newTechKey || !newTechValue
                  }
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Current phase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current project phase
              </label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select phase</option>
                {["Design", "Code", "Testing", "Deployment"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleField("summary", e.target.value)}
                placeholder="Brief project summary"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Basic details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Basic details</label>
              <textarea
                value={formData.basicDetails}
                onChange={(e) => handleField("basicDetails", e.target.value)}
                placeholder="Detailed project description"
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Team members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team members{" "}
                <span className="text-gray-400 font-normal">({selectedMembers.length} selected)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsMemberDropdownOpen((o) => !o)}
                className="w-full text-left px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {selectedMembers.length > 0
                  ? `${selectedMembers.length} user(s) selected`
                  : "Select members"}{" "}
                ↓
              </button>

              {isMemberDropdownOpen && (
                <div className="mt-2 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="text-sm text-gray-400 px-4 py-3">No users found</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => toggleMember(user.id)}
                          className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${selectedMembers.includes(user.id)
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                            }`}
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">
                              {user.role} · {user.department}
                            </p>
                          </div>
                          {selectedMembers.includes(user.id) && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                Create project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPriority = priorityFilter === "ALL" || p.priority === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [projects, searchTerm, priorityFilter]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-7">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Projects</h1>
              <p className="text-gray-500 mt-1 text-[15px]">Manage and track your assigned projects</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-black focus:border-transparent w-52"
                />
              </div>

              {/* Priority filter */}
              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-black cursor-pointer appearance-none"
                >
                  <option value="ALL">All</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* New project button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFAE58] text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={16} />
                New project
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>
              <strong className="text-gray-900 font-semibold">{projects.length}</strong> total
            </span>
            <span>
              <strong className="text-red-600 font-semibold">
                {projects.filter((p) => p.priority === "HIGH").length}
              </strong>{" "}
              high priority
            </span>
            <span>
              <strong className="text-gray-900 font-semibold">{filteredProjects.length}</strong> shown
            </span>
          </div>

          {/* Projects grid */}
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <AlertCircle size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No projects found</h3>
              <p className="text-sm text-gray-400">
                {projects.length === 0
                  ? "You haven't been assigned to any projects yet."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <Link href={`/dashboard/project/${project.id}`} key={project.id}>
                  <ProjectCard key={project.id} project={project} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create modal */}
        {showCreateModal && (
          <CreateModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleProjectCreated}
          />
        )}
      </div>
    </DashboardShell>
  );
}