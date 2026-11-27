"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2, Plus } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";

type CommissionType = "PERCENTAGE" | "FIXED";
interface Owner { id: string; name: string | null; email: string; role: "CLIENT" | "ENGINEER" }
interface Link {
  id: string;
  code: string;
  commissionType: CommissionType;
  commissionValue: number;
  isActive: boolean;
  createdAt: string;
  totalEarned: number;
  owner: Owner;
  _count: { referredUsers: number; earnings: number };
}
interface Withdrawal {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "REJECTED";
  method: string;
  payoutInfo: string;
  createdAt: string;
  user: { name: string | null; email: string; role: string };
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const commissionLabel = (t: CommissionType, v: number) => (t === "PERCENTAGE" ? `${v}% per purchase` : `${inr(v)} per purchase`);
const input = "w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-orange-200";

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [role, setRole] = useState<"CLIENT" | "ENGINEER">("CLIENT");
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [type, setType] = useState<CommissionType>("PERCENTAGE");
  const [value, setValue] = useState("10");
  const [code, setCode] = useState("");

  const load = useCallback(async () => {
    try {
      const [l, w] = await Promise.all([
        fetch("/api/admin/affiliate-links").then((r) => r.json()),
        fetch("/api/admin/affiliate-withdrawals").then((r) => r.json()),
      ]);
      if (!l.success) setError(l.message || "Could not load affiliate links.");
      else setLinks(l.links);
      if (w.success) setWithdrawals(w.withdrawals);
    } catch {
      setError("Could not load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/affiliate-links/owners?role=${role}&search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data.success) setOwners(data.users);
      } catch { /* ignore */ }
    }, 250);
    return () => clearTimeout(t);
  }, [role, search]);

  useEffect(() => { setOwnerId(""); }, [role]);

  const linkUrl = (c: string) => `${window.location.origin}/?ref=${c}`;

  const copy = async (l: Link) => {
    await navigator.clipboard.writeText(linkUrl(l.code));
    setCopiedId(l.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, commissionType: type, commissionValue: Number(value), ...(code.trim() ? { code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || "Could not create link."); return; }
      setNotice(`Link ${data.link.code} created.`);
      setCode("");
      await load();
    } catch {
      setError("Could not create link. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const patch = async (url: string, body: object, id: string) => {
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || "Update failed."); return; }
      await load();
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const pending = withdrawals.filter((w) => w.status === "PENDING");

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Affiliate Links</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Generate a referral link for a client or engineer. They earn a percentage or a fixed amount on every purchase made by users who sign up through it.
          </p>
        </header>

        {(error || notice) && (
          <div role={error ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
            {error || notice}
          </div>
        )}

        <form onSubmit={create} className="grid gap-4 rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-card md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Create link for</p>
            <div className="flex gap-2">
              {(["CLIENT", "ENGINEER"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${role === r ? "border-[#FFAE58] bg-orange-50 text-[#c77a1c]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                  {r === "CLIENT" ? "Client" : "Engineer"}
                </button>
              ))}
            </div>
            <input className={input} placeholder={`Search ${role.toLowerCase()} by name or email`} value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className={input} value={ownerId} onChange={(e) => setOwnerId(e.target.value)} required>
              <option value="">Select {role.toLowerCase()}…</option>
              {owners.map((o) => <option key={o.id} value={o.id}>{o.name || "Unnamed"} — {o.email}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Commission per purchase</p>
            <div className="flex gap-2">
              {(["PERCENTAGE", "FIXED"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${type === t ? "border-[#FFAE58] bg-orange-50 text-[#c77a1c]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                  {t === "PERCENTAGE" ? "Percentage (%)" : "Fixed (₹)"}
                </button>
              ))}
            </div>
            <input className={input} type="number" min={0.01} max={type === "PERCENTAGE" ? 100 : undefined} step="0.01" value={value} onChange={(e) => setValue(e.target.value)} required />
            <input className={`${input} font-mono`} placeholder="Custom code (optional — auto-generated if empty)" value={code} maxLength={32} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <button type="submit" disabled={saving || !ownerId}
              className="flex items-center gap-2 rounded-lg bg-[#FFAE58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f29a3e] disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Generate link
            </button>
          </div>
        </form>

        {pending.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50/40 dark:bg-card">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Pending withdrawals ({pending.length})</h2>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">Pay manually using the details below, then mark as paid.</p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {pending.map((w) => (
                <div key={w.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text-primary)]">{inr(w.amount)} · {w.user.name || w.user.email} <span className="text-xs font-normal text-[var(--text-muted)]">({w.user.role.toLowerCase()})</span></p>
                    <p className="mt-1 break-all font-mono text-xs text-[var(--text-muted)]">{w.payoutInfo}</p>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={busyId === w.id} onClick={() => void patch("/api/admin/affiliate-withdrawals", { id: w.id, status: "PAID" }, w.id)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Mark paid</button>
                    <button disabled={busyId === w.id} onClick={() => void patch("/api/admin/affiliate-withdrawals", { id: w.id, status: "REJECTED" }, w.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white dark:bg-card">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold text-[var(--text-primary)]">All affiliate links</h2>
          </div>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#FFAE58]" size={24} /></div>
          ) : links.length === 0 ? (
            <p className="p-10 text-center text-sm text-[var(--text-muted)]">No affiliate links yet.</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {links.map((l) => (
                <div key={l.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-mono font-bold text-[var(--text-primary)]"><Link2 size={14} />{l.code}</p>
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{l.owner.name || l.owner.email} · {l.owner.role.toLowerCase()}</p>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    <p className="font-semibold text-[var(--text-secondary)]">{commissionLabel(l.commissionType, l.commissionValue)}</p>
                    <p>{l._count.referredUsers} signups · {l._count.earnings} purchases · {inr(l.totalEarned)} earned</p>
                  </div>
                  <button onClick={() => void copy(l)} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
                    {copiedId === l.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === l.id ? "Copied" : "Copy link"}
                  </button>
                  <button disabled={busyId === l.id} onClick={() => void patch("/api/admin/affiliate-links", { id: l.id, isActive: !l.isActive }, l.id)}
                    className={`text-sm font-semibold disabled:opacity-50 ${l.isActive ? "text-green-700" : "text-[var(--text-muted)]"}`}>
                    {l.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
