"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { Lead } from "@/lib/types/lead";
import {
  Briefcase,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
 Phone,
  Search,
  User,
  CalendarClock,
  Megaphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<string>("all");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/leads");
        const data = await res.json();

        if (data.success) {
          setLeads(data.leads ?? []);
        } else {
          setError(data.message ?? "Failed to load leads");
        }
      } catch (err) {
        setError("Something went wrong while fetching leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const timelines = useMemo(() => {
    const unique = new Set(
      leads
        .map((l) => l.timeline)
        .filter((timeline): timeline is string => Boolean(timeline))
    );
    return ["all", ...Array.from(unique)];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();

      const matchesSearch =
        lead.name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.domain?.toLowerCase().includes(q) ||
        lead.number?.toLowerCase().includes(q) ||
        lead.hear?.toLowerCase().includes(q) ||
        lead.timeline?.toLowerCase().includes(q);

      const matchesTimeline =
        timelineFilter === "all" || lead.timeline === timelineFilter;

      return matchesSearch && matchesTimeline;
    });
  }, [leads, search, timelineFilter]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Leads</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {loading
                ? "Loading leads..."
                : `${filteredLeads.length} lead${
                    filteredLeads.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, domain, number..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 sm:w-80 dark:border-slate-800 dark:bg-card dark:text-slate-300"
              />
            </div>

            {/* Timeline filter */}
            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-slate-800 dark:bg-card dark:text-slate-300"
            >
              {timelines.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {timeline === "all" ? "All Timelines" : timeline}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-1 items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Fetching leads...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-16 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 py-24 text-center dark:border-slate-800 dark:bg-background">
            <User className="h-8 w-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              No leads found
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => router.push(`/admin/leads/${lead.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick: () => void;
}) {
  const initials = lead.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const createdLabel = lead.createdAt
    ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:bg-card"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
            {initials || "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900 dark:text-slate-100">{lead.name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-slate-400">{lead.email}</p>
          </div>
        </div>

        {lead.timeline ? <TimelineBadge timeline={lead.timeline} /> : null}
      </div>

      {/* Domain */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
        <Briefcase className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
        <span className="truncate">{lead.domain}</span>
      </div>

      {/* Phone */}
      {lead.number && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <Phone className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
          <span className="truncate">{lead.number}</span>
        </div>
      )}

      {/* Challenge preview */}
      {lead.challenge && (
        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400">
          <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-slate-500" />
          <span className="line-clamp-3">{lead.challenge}</span>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-1 flex flex-col gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-slate-800 dark:text-slate-400">
        {lead.timeline && (
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
            <span className="truncate">Timeline: {lead.timeline}</span>
          </div>
        )}

        {lead.hear && (
          <div className="flex items-center gap-1.5">
            <Megaphone className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
            <span className="truncate">Source: {lead.hear}</span>
          </div>
        )}

        {createdLabel && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
            <span>{createdLabel}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function TimelineBadge({ timeline }: { timeline: string }) {
  const value = timeline.toLowerCase();

  const colorMap: Record<string, string> = {
    immediate: "bg-red-50 text-red-600 border-red-100",
    "within 7 days": "bg-orange-50 text-orange-600 border-orange-100",
    "within 30 days": "bg-blue-50 text-blue-600 border-blue-100",
    "1-3 months": "bg-purple-50 text-purple-600 border-purple-100",
    "3+ months": "bg-green-50 text-green-600 border-green-100",
  };

  const style =
    colorMap[value] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${style}`}
    >
      {timeline}
    </span>
  );
}