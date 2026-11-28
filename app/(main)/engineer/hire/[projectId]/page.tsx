"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Users,
  ShieldCheck,
  Briefcase,
  Award,
  Sparkles,
  Send,
  ChevronDown,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { PromoCodeField, PromoQuoteView } from "@/components/project/PromoCodeField";

interface PreviewCard {
  id: string;
  initials: string;
  skills: string[];
  experience: string;
  completedProjects: number;
}

interface HiredEngineer {
  invitationId: string;
  status: string;
  skills: string[];
  completedProjects: number;
  yearsOfExperience?: string | null;
  qualification?: string;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  user: { name: string | null; image: string | null };
}

interface HireData {
  unlocked: boolean;
  project: {
    id: string;
    title: string;
    description: string;
    budget: number;
    instruments: string[];
    status: string;
  };
  preview?: {
    profileCount: number;
    cards: PreviewCard[];
    advanceAmount: number;
  };
  engineers?: HiredEngineer[];
}

const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function HireEngineerPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { processPayment, loading: paying } = usePayment();
  const [data, setData] = useState<HireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState<PromoQuoteView | null>(null);
  const matchStarted = useRef(false);

  const startMatching = async () => {
    if (matchStarted.current) return;
    matchStarted.current = true;
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (json.success)
        toast.success("Matching started! Finding best engineers...");
      else toast.error(json.message || "Matching could not start");
    } catch {
      toast.error("Something went wrong with matching.");
    }
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/engineer/hire/${projectId}`);
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Could not load project");
        router.push("/engineer/project");
        return;
      }
      setData(json);

      // Paid but no engineers yet (e.g. matching never started because the
      // payment redirected away, or it failed earlier): start it now.
      if (
        json.unlocked &&
        (json.engineers?.length ?? 0) === 0 &&
        !matchStarted.current
      ) {
        await startMatching();
        const retry = await fetch(`/api/engineer/hire/${projectId}`);
        const retryJson = await retry.json();
        if (retryJson.success) setData(retryJson);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePay = () => {
    if (!data?.preview) return;
    processPayment({
      projectId,
      redirectPath: `/engineer/hire/${projectId}`,
      user: { name: user?.name, email: user?.email },
      description: "Advance Payment (25%)",
      promoCode: promo?.code,
      onSuccess: async () => {
        await startMatching();
        await load();
      },
      onError: () => {},
      onDismiss: () =>
        toast("Project saved. You can pay the advance later from this page."),
    });
  };

  if (loading || !data) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
        </div>
      </DashboardShell>
    );
  }

  const payableAmount = data.preview
    ? promo?.amountDue ?? data.preview.advanceAmount
    : 0;

  const remainingCount = data.preview
    ? Math.max(0, data.preview.profileCount - data.preview.cards.length)
    : 0;

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        {/* Top Project Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card border border-[var(--border)] rounded-xl p-4 sm:p-5">
          <div className="flex items-start sm:items-center gap-3">
            <Link
              href="/engineer/project"
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--primary-light)] transition-colors shrink-0"
            >
              <ArrowLeft size={16} className="text-[var(--text-muted)]" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                  {data.project.title}
                </h1>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                  Budget: {inr(data.project.budget)}
                </span>
              </div>
              {data.project.instruments?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {data.project.instruments.slice(0, 4).map((inst) => (
                    <span
                      key={inst}
                      className="text-[11px] text-[var(--text-muted)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {data.unlocked ? (
          <UnlockedProfiles engineers={data.engineers ?? []} projectId={projectId} onInvited={load} />
        ) : (
          data.preview && (
            <div className="bg-white dark:bg-card border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
              {/* Banner Header */}
              <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Users size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        {data.preview.profileCount} matching engineers found
                      </h2>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Sparkles size={11} /> Verified Pool
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Review matched skills &amp; experience below. Unlock full
                      profiles and send invites with a 25% advance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Cards Grid with Soft Full-Card Blur */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.preview.cards.map((c) => (
                    <div
                      key={c.id}
                      className="relative overflow-hidden border border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] rounded-xl p-4 hover:border-[var(--primary)]/40 transition-colors"
                    >
                      {/* Soft-blurred card content */}
                      <div
                        aria-hidden
                        className="flex flex-col justify-between h-full blur-[3px] opacity-80 select-none pointer-events-none"
                      >
                        <div>
                          {/* Header Row */}
                          <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[var(--border)]/60">
                            <div className="w-9 h-9 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xs font-bold shrink-0">
                              {c.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                Matched Engineer
                              </p>
                              <p className="text-[11px] text-[var(--text-muted)]">
                                Verified Specialist
                              </p>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {c.skills.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="text-[11px] font-medium px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-md"
                              >
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 4 && (
                              <span className="text-[11px] px-1.5 py-0.5 text-[var(--text-muted)]">
                                +{c.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Credibility Stats */}
                        <div className="pt-2.5 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1.5">
                            <Briefcase
                              size={13}
                              className="text-[var(--primary)]"
                            />
                            {c.experience}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award
                              size={13}
                              className="text-[var(--primary)]"
                            />
                            {c.completedProjects} completed
                          </span>
                        </div>
                      </div>

                      {/* Subtle Center Lock Badge Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-black/15">
                        <div className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-[var(--border)] text-[var(--text-primary)] shadow-sm">
                          <Lock size={15} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {remainingCount > 0 && (
                  <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                    +{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {remainingCount} more
                    </span>{" "}
                    matched engineer profiles will be unlocked upon payment
                  </p>
                )}
              </div>

              {/* Promo code */}
              <div className="px-6 pt-4 bg-black/[0.03] dark:bg-white/[0.02] border-t border-[var(--border)]">
                <PromoCodeField
                  budget={data.project.budget}
                  disabled={paying}
                  onPromoChange={setPromo}
                />
              </div>

              {/* Balanced Payment Footer */}
              <div className="px-6 py-4 bg-black/[0.03] dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-[var(--text-muted)]">
                    Advance Deposit (25% of {inr(data.project.budget)})
                  </p>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-0.5">
                    {promo && (
                      <span className="text-sm text-[var(--text-muted)] line-through">
                        {inr(data.preview.advanceAmount)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-[var(--text-primary)]">
                      {inr(payableAmount)}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      Escrow protected
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full sm:w-auto px-6 py-3 bg-[var(--primary)] text-zinc-950 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paying && <Loader2 size={16} className="animate-spin" />}
                  Unlock Profiles &amp; Pay {inr(payableAmount)}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </DashboardShell>
  );
}

const INVITE_STATUS: Record<string, { label: string; color: string }> = {
  NONE: { label: "Not invited", color: "bg-gray-100 text-gray-600" },
  PENDING_ADMIN: { label: "Matched", color: "bg-blue-100 text-blue-700" },
  SENT: { label: "Invitation sent", color: "bg-yellow-100 text-yellow-700" },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "Declined", color: "bg-red-100 text-red-600" },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-600" },
  DROPPED: { label: "Dropped", color: "bg-gray-100 text-gray-600" },
  ADMIN_REJECTED: { label: "Not available", color: "bg-gray-100 text-gray-600" },
};

// Statuses from which an invitation can be sent (matches the API).
const INVITABLE = ["NONE", "PENDING_ADMIN", "EXPIRED", "DROPPED"];

interface EngineerRow {
  key: string;
  invitationId?: string | null;
  engineerId?: string;
  status: string; // "NONE" when never matched/invited
  name: string | null;
  email?: string;
  image: string | null;
  skills: string[];
  completedProjects: number;
  yearsOfExperience?: string | null;
  qualification?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
}

interface SearchResult {
  engineerId: string;
  invitationId: string | null;
  status: string | null;
  assigned: boolean;
  name: string | null;
  email: string;
  image: string | null;
  skills: string[];
  completedProjects: number;
  yearsOfExperience?: string | null;
  qualification?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
}

function EngineerCard({
  row,
  sending,
  onInvite,
}: {
  row: EngineerRow;
  sending: boolean;
  onInvite: (row: EngineerRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = INVITE_STATUS[row.status] ?? { label: row.status, color: "bg-gray-100 text-gray-600" };
  const canInvite = INVITABLE.includes(row.status);
  const links = [
    { label: "GitHub", href: row.github },
    { label: "LinkedIn", href: row.linkedin },
    { label: "Portfolio", href: row.portfolio },
  ].filter((l) => !!l.href);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 dark:bg-card">
      <div className="flex items-center gap-3 mb-3">
        {row.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.image} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
            {(row.name ?? "E")[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{row.name ?? "Engineer"}</p>
          {row.email && <p className="text-[11px] text-[var(--text-muted)] truncate">{row.email}</p>}
          <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
            {meta.label}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {row.skills.slice(0, open ? row.skills.length : 5).map((s) => (
          <span key={s} className="text-[11px] px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-md">
            {s}
          </span>
        ))}
      </div>

      {open && (
        <div className="space-y-2 mb-3 text-xs text-[var(--text-muted)]">
          {row.yearsOfExperience && (
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Experience:</span> {row.yearsOfExperience}
            </p>
          )}
          {row.qualification && (
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Qualification:</span> {row.qualification}
            </p>
          )}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
                >
                  {l.label} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]/60">
        {row.completedProjects} projects completed
      </p>

      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
        >
          {open ? "Hide profile" : "View profile"}
          <ChevronDown size={13} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
        {canInvite && (
          <button
            type="button"
            onClick={() => onInvite(row)}
            disabled={sending}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--primary)] text-zinc-950 hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
          >
            {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            Send invitation
          </button>
        )}
      </div>
    </div>
  );
}

function UnlockedProfiles({
  engineers,
  projectId,
  onInvited,
}: {
  engineers: HiredEngineer[];
  projectId: string;
  onInvited: () => Promise<void> | void;
}) {
  const [sendingKey, setSendingKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    let active = true;
    setSearching(true);
    fetch(`/api/engineer/hire/${projectId}/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((json) => {
        if (active) setResults(json.success ? json.engineers : []);
      })
      .catch(() => {
        if (active) setResults([]);
      })
      .finally(() => {
        if (active) setSearching(false);
      });
    return () => {
      active = false;
    };
  }, [debounced, projectId, refreshKey]);

  const sendInvite = async (row: EngineerRow) => {
    setSendingKey(row.key);
    try {
      const res = await fetch(`/api/engineer/hire/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          row.invitationId ? { invitationId: row.invitationId } : { engineerId: row.engineerId }
        ),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Invitation sent to ${row.name ?? "engineer"}`);
        await onInvited();
        setRefreshKey((k) => k + 1);
      } else {
        toast.error(json.message || "Could not send invitation");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSendingKey(null);
    }
  };

  const matchedRows: EngineerRow[] = engineers.map((e) => ({
    key: `m-${e.invitationId}`,
    invitationId: e.invitationId,
    status: e.status,
    name: e.user.name,
    image: e.user.image,
    skills: e.skills,
    completedProjects: e.completedProjects,
    yearsOfExperience: e.yearsOfExperience,
    qualification: e.qualification,
    github: e.github,
    linkedin: e.linkedin,
    portfolio: e.portfolio,
  }));

  const searchRows: EngineerRow[] = results
    .filter((r) => !r.assigned)
    .map((r) => ({
      key: `s-${r.engineerId}`,
      invitationId: r.invitationId,
      engineerId: r.engineerId,
      status: r.status ?? "NONE",
      name: r.name,
      email: r.email,
      image: r.image,
      skills: r.skills,
      completedProjects: r.completedProjects,
      yearsOfExperience: r.yearsOfExperience,
      qualification: r.qualification,
      github: r.github,
      linkedin: r.linkedin,
      portfolio: r.portfolio,
    }));

  return (
    <div className="space-y-6">
      {/* Search any engineer by name or email */}
      <div>
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search engineers by name or email"
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white dark:bg-card text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {debounced.length >= 2 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">
              {searching ? "Searching..." : `Search results (${searchRows.length})`}
            </p>
            {!searching && searchRows.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No engineer found with that name or email.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                {searchRows.map((row) => (
                  <EngineerCard key={row.key} row={row} sending={sendingKey === row.key} onInvite={sendInvite} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Matched engineers */}
      {engineers.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-xl p-8 text-center dark:bg-card">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Payment received. Matching is in progress.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Matched engineer profiles will appear here shortly. You can also search for an engineer above.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Matched engineers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {matchedRows.map((row) => (
              <EngineerCard key={row.key} row={row} sending={sendingKey === row.key} onInvite={sendInvite} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
