"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, Loader2, Percent, Plus, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";

interface PromoCode {
  id: string;
  code: string;
  percentage: number;
  isActive: boolean;
  createdAt: string;
  createdBy: { name: string | null; email: string };
  _count: { redemptions: number };
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("10");
  const [editingPercentage, setEditingPercentage] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPromoCodes = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/promo-codes");
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Could not load promo codes.");
        return;
      }
      setPromoCodes(data.promoCodes);
      setEditingPercentage((current) => {
        const next = { ...current };
        for (const promo of data.promoCodes as PromoCode[]) {
          next[promo.id] ??= String(promo.percentage);
        }
        return next;
      });
    } catch {
      setError("Could not load promo codes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPromoCodes();
  }, [loadPromoCodes]);

  const createPromoCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, percentage: Number(percentage) }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Could not create promo code.");
        return;
      }
      setCode("");
      setNotice(`${data.promoCode.code} created.`);
      await loadPromoCodes();
    } catch {
      setError("Could not create promo code. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updatePromoCode = async (
    promo: PromoCode,
    changes: { percentage?: number; isActive?: boolean },
  ) => {
    setUpdatingId(promo.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: promo.id, ...changes }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Could not update promo code.");
        return;
      }
      setNotice(`${promo.code} updated.`);
      await loadPromoCodes();
    } catch {
      setError("Could not update promo code. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Promo Codes</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Create percentage discounts for client advance payments. Each client can redeem a code once.
          </p>
        </header>

        {(error || notice) && (
          <div
            role={error ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || notice}
          </div>
        )}

        <form
          onSubmit={createPromoCode}
          className="grid gap-4 rounded-xl border border-[var(--border)] bg-white p-5 dark:bg-card sm:grid-cols-[1fr_180px_auto]"
        >
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Code
            <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 focus-within:ring-2 focus-within:ring-orange-200">
              <Tag size={15} className="text-[var(--text-muted)]" />
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="WELCOME10"
                maxLength={32}
                className="w-full bg-transparent py-2 text-sm text-[var(--text-primary)] outline-none"
                required
              />
            </span>
          </label>
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Discount percent
            <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 focus-within:ring-2 focus-within:ring-orange-200">
              <Percent size={15} className="text-[var(--text-muted)]" />
              <input
                type="number"
                min={1}
                max={99}
                step={1}
                value={percentage}
                onChange={(event) => setPercentage(event.target.value)}
                className="w-full bg-transparent py-2 text-sm text-[var(--text-primary)] outline-none"
                required
              />
              <span className="text-xs text-[var(--text-muted)]">%</span>
            </span>
          </label>
          <button
            type="submit"
            disabled={saving || !code.trim()}
            className="flex items-center justify-center gap-2 self-end rounded-lg bg-[#FFAE58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f29a3e] disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Create code
          </button>
          <p className="text-xs text-[var(--text-muted)] sm:col-span-3">
            Use 3–32 letters, numbers, hyphens, or underscores. Discounts must be between 1% and 99%.
          </p>
        </form>

        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white dark:bg-card">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">All codes</h2>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {promoCodes.length} code{promoCodes.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadPromoCodes()}
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-[#FFAE58]" size={24} />
            </div>
          ) : promoCodes.length === 0 ? (
            <p className="p-10 text-center text-sm text-[var(--text-muted)]">No promo codes created yet.</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {promoCodes.map((promo) => (
                <div
                  key={promo.id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_150px_120px_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono font-bold text-[var(--text-primary)]">{promo.code}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Created by {promo.createdBy.name || promo.createdBy.email} ·{" "}
                      {new Date(promo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={editingPercentage[promo.id] ?? promo.percentage}
                      onChange={(event) =>
                        setEditingPercentage((current) => ({
                          ...current,
                          [promo.id]: event.target.value,
                        }))
                      }
                      className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1.5 text-[var(--text-primary)]"
                      aria-label={`${promo.code} discount percentage`}
                    />
                    %
                    {Number(editingPercentage[promo.id]) !== promo.percentage && (
                      <button
                        type="button"
                        disabled={updatingId === promo.id}
                        onClick={() =>
                          void updatePromoCode(promo, {
                            percentage: Number(editingPercentage[promo.id]),
                          })
                        }
                        className="rounded p-1 text-green-700 hover:bg-green-50 disabled:opacity-50"
                        aria-label={`Save ${promo.code} percentage`}
                      >
                        <Check size={15} />
                      </button>
                    )}
                  </label>
                  <div className="text-xs text-[var(--text-muted)]">
                    {promo._count.redemptions} redemption{promo._count.redemptions === 1 ? "" : "s"}
                  </div>
                  <button
                    type="button"
                    disabled={updatingId === promo.id}
                    onClick={() =>
                      void updatePromoCode(promo, { isActive: !promo.isActive })
                    }
                    className={`flex items-center gap-2 text-sm font-semibold disabled:opacity-50 ${
                      promo.isActive ? "text-green-700" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {updatingId === promo.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : promo.isActive ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                    {promo.isActive ? "Active" : "Inactive"}
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
