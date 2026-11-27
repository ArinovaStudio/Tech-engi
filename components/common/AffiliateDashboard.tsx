"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, Copy, Loader2, Wallet } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";

interface Data {
  links: { id: string; code: string; commissionType: "PERCENTAGE" | "FIXED"; commissionValue: number; isActive: boolean; _count: { referredUsers: number } }[];
  earnings: { id: string; purchaseAmount: number; amount: number; createdAt: string }[];
  withdrawals: { id: string; amount: number; status: "PENDING" | "PAID" | "REJECTED"; method: string; note: string | null; createdAt: string }[];
  balance: { totalEarned: number; pendingWithdrawal: number; totalPaid: number; available: number };
  hasPayoutDetails: boolean;
  minWithdrawal: number;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const date = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const statusStyle = { PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200", PAID: "bg-green-50 text-green-700 border-green-200", REJECTED: "bg-red-50 text-red-700 border-red-200" };

export default function AffiliateDashboard({
  profileHref,
  withShell = false,
}: {
  profileHref: string;
  /** Engineer pages render their own DashboardShell; the client layout already provides one. */
  withShell?: boolean;
}) {
  const wrap = (node: React.ReactNode) => (withShell ? <DashboardShell>{node}</DashboardShell> : <>{node}</>);

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/affiliate");
      const json = await res.json();
      if (json.success) setData(json);
      else setError(json.message || "Could not load affiliate data.");
    } catch {
      setError("Could not load affiliate data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const withdraw = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setNotice("");
    try {
      const res = await fetch("/api/affiliate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: Number(amount) }) });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || "Withdrawal failed."); return; }
      setNotice("Withdrawal requested. It will be paid out after admin approval.");
      setAmount("");
      await load();
    } catch {
      setError("Withdrawal failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (code: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading) {
    return wrap(<div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#FFAE58]" size={28} /></div>);
  }

  const b = data?.balance;
  const stats = [
    { label: "Available balance", value: b?.available ?? 0, primary: true },
    { label: "Total earned", value: b?.totalEarned ?? 0 },
    { label: "Withdrawal pending", value: b?.pendingWithdrawal ?? 0 },
    { label: "Withdrawn", value: b?.totalPaid ?? 0 },
  ];

  return wrap(
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Affiliate</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Share your link. You earn commission whenever someone who signed up through it makes a purchase.</p>
        </header>

        {(error || notice) && (
          <div role={error ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{error || notice}</div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl p-5 ${s.primary ? "text-white" : "border border-[var(--border)] bg-white dark:bg-card"}`} style={s.primary ? { background: "var(--primary)" } : undefined}>
              <p className={`text-xs ${s.primary ? "opacity-90" : "text-[var(--text-muted)]"}`}>{s.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${s.primary ? "" : "text-[var(--text-primary)]"}`}>{inr(s.value)}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-card">
          <h2 className="mb-3 font-semibold text-[var(--text-primary)]">Your referral links</h2>
          {data?.links.length ? (
            <div className="space-y-3">
              {data.links.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-4 py-3">
                  <div className="min-w-0">
                    <p className="break-all font-mono text-sm font-bold text-[var(--text-primary)]">{typeof window !== "undefined" ? window.location.origin : ""}/?ref={l.code}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {l.commissionType === "PERCENTAGE" ? `${l.commissionValue}%` : inr(l.commissionValue)} per purchase · {l._count.referredUsers} signups{!l.isActive && " · inactive"}
                    </p>
                  </div>
                  <button onClick={() => void copy(l.code)} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
                    {copied === l.code ? <Check size={14} /> : <Copy size={14} />} {copied === l.code ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No affiliate link has been assigned to you yet. Contact the admin team to get one.</p>
          )}
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-card">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-[var(--text-primary)]"><Wallet size={16} /> Withdraw</h2>
          {!data?.hasPayoutDetails ? (
            <p className="text-sm text-[var(--text-muted)]">Add your UPI / bank details in <a href={profileHref} className="font-semibold text-[var(--primary)] underline">Profile</a> to withdraw.</p>
          ) : (
            <form onSubmit={withdraw} className="flex flex-wrap items-end gap-3">
              <label className="text-sm text-[var(--text-secondary)]">Amount (₹)
                <input type="number" min={data.minWithdrawal} max={b?.available} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                  className="mt-1 block w-44 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-primary)]" />
              </label>
              <button type="button" onClick={() => setAmount(String(b?.available ?? 0))} className="pb-2 text-xs font-semibold text-[var(--primary)]">Max</button>
              <button type="submit" disabled={submitting || !amount || (b?.available ?? 0) < data.minWithdrawal}
                className="flex items-center gap-2 rounded-lg bg-[#FFAE58] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {submitting && <Loader2 size={14} className="animate-spin" />} Request withdrawal
              </button>
              <p className="w-full text-xs text-[var(--text-muted)]">Minimum {inr(data.minWithdrawal)}. Paid to your saved payout method after admin approval.</p>
            </form>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-[var(--border)] bg-white dark:bg-card">
            <h2 className="border-b border-[var(--border)] px-5 py-4 font-semibold text-[var(--text-primary)]">Earnings</h2>
            {data?.earnings.length ? (
              <div className="divide-y divide-[var(--border)]">
                {data.earnings.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div><p className="font-semibold text-green-700">+{inr(e.amount)}</p><p className="text-xs text-[var(--text-muted)]">on a {inr(e.purchaseAmount)} purchase</p></div>
                    <span className="text-xs text-[var(--text-muted)]">{date(e.createdAt)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="p-6 text-center text-sm text-[var(--text-muted)]">No earnings yet.</p>}
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-white dark:bg-card">
            <h2 className="border-b border-[var(--border)] px-5 py-4 font-semibold text-[var(--text-primary)]">Withdrawals</h2>
            {data?.withdrawals.length ? (
              <div className="divide-y divide-[var(--border)]">
                {data.withdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div><p className="font-semibold text-[var(--text-primary)]">{inr(w.amount)}</p><p className="text-xs text-[var(--text-muted)]">{date(w.createdAt)} · {w.method}{w.note ? ` · ${w.note}` : ""}</p></div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[w.status]}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            ) : <p className="p-6 text-center text-sm text-[var(--text-muted)]">No withdrawals yet.</p>}
          </section>
        </div>
      </div>
  );
}