"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const MIN_BUDGET = 2000;

export function HireEngineerModal({ onClose, initial }: { onClose: () => void; initial?: { title: string; description: string; budget: number } }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: initial?.title ?? "", description: initial?.description ?? "", budget: initial ? String(initial.budget) : "", startDate: "", endDate: "" });
  const [instruments, setInstruments] = useState<string[]>([]);
  const [instrInput, setInstrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const budget = Number(form.budget) || 0;
  const inputCls =
    "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input-bg)] text-[var(--text-primary)]";

  const addInstrument = () => {
    const v = instrInput.trim();
    if (v && !instruments.includes(v)) setInstruments((p) => [...p, v]);
    setInstrInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.title.length < 5) return setError("Title must be at least 5 characters");
    if (form.description.length < 20) return setError("Description must be at least 20 characters");
    if (!Number.isFinite(budget) || budget < MIN_BUDGET) return setError("Budget must be at least ₹2,000");

    setLoading(true);
    try {
      const res = await fetch("/api/engineer/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          budget,
          instruments,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          isCoWorker: !!initial,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to create project");
        setLoading(false);
        return;
      }
      // Step 2: payment preview screen (before Razorpay/PayU)
      router.push(`/engineer/hire/${data.projectId}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl dark:bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Hire an Engineer</h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">
            Create your project first. You&apos;ll see a preview and pay a 25% advance on the next screen.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Title *</label>
              <input className={inputCls} placeholder="Project title (min 5 chars)" maxLength={100} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} disabled={loading} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description *</label>
              <textarea className={`${inputCls} resize-none`} rows={3} maxLength={500} placeholder="Describe the work (min 20 chars)"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Budget (₹) *</label>
              <input type="number" className={inputCls} placeholder="Min ₹2,000" min={MIN_BUDGET} value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })} disabled={loading} required />
              {budget >= MIN_BUDGET && (
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 p-2 bg-blue-50 rounded border border-blue-100">
                  25% advance: <span className="font-bold text-[var(--primary)]">₹{(budget * 0.25).toLocaleString("en-IN")}</span>
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
                <input type="date" className={inputCls} value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })} disabled={loading} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">End Date</label>
                <input type="date" className={inputCls} value={form.endDate} min={form.startDate || undefined}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={loading} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Skills Needed</label>
              <div className="flex gap-2 mb-2">
                <input className={inputCls} placeholder="e.g. React, Node.js" value={instrInput}
                  onChange={(e) => setInstrInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInstrument())} disabled={loading} />
                <button type="button" onClick={addInstrument} disabled={loading}
                  className="px-3 py-2 bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8] rounded-lg text-xs font-semibold disabled:opacity-50">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {instruments.map((i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] border border-[#ffd9a8] rounded-full flex items-center gap-1">
                    {i}
                    <button type="button" onClick={() => setInstruments((p) => p.filter((x) => x !== i))} disabled={loading} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} disabled={loading}
                className="flex-1 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />} Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
