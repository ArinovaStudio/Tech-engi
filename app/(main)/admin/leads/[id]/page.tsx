"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { Lead } from "@/lib/types/lead";
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    IndianRupee,
    Loader2,
    Mail,
    Phone,
    Target,
    Trash2,
    TriangleAlert,
    User,
    X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeadDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/leads?id=${params.id}`);
                const data = await res.json();

                if (data.success && data.lead) {
                    setLead(data.lead);
                } else {
                    setError("Lead not found");
                }
            } catch (err) {
                setError("Something went wrong while fetching this lead");
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) fetchLead();
    }, [params?.id]);

    const handleDelete = async () => {
        if (!params?.id) return;

        try {
            setDeleting(true);
            setDeleteError(null);

            const res = await fetch(`/api/leads?id=${params.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                router.push("/admin/leads");
            } else {
                setDeleteError(data.message ?? "Failed to delete lead");
                setDeleting(false);
            }
        } catch (err) {
            setDeleteError("Something went wrong while deleting this lead");
            setDeleting(false);
        }
    };

    return (
        <DashboardShell>
            <div className="flex flex-col gap-6">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/admin/leads")}
                        className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Leads
                    </button>

                    {!loading && !error && lead && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Lead
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-1 items-center justify-center py-24">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="text-sm">
                                Fetching lead details...
                            </span>
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-16 text-center">
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && !error && lead && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left: Profile summary */}
                        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
                            <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-lg font-semibold text-orange-600">
                                    {lead.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {lead.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {lead.userType}
                                    </p>
                                </div>
                                <StageBadge stage={lead.stage} />
                            </div>

                            <div className="flex flex-col gap-3 text-sm">
                                <InfoRow icon={Mail} label="Email" value={lead.email} />
                                <InfoRow
                                    icon={Phone}
                                    label="Phone"
                                    value={lead.phone || "Not provided"}
                                />
                                <InfoRow
                                    icon={Calendar}
                                    label="Created"
                                    value={formatDate(lead.createdAt)}
                                />
                                {/* <InfoRow
                                    icon={Calendar}
                                    label="Last updated"
                                    value={formatDate(lead.updatedAt)}
                                /> */}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            {/* Stats row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <StatCard
                                    icon={Briefcase}
                                    label="Domain"
                                    value={lead.domain}
                                />
                                <StatCard
                                    icon={IndianRupee}
                                    label="Budget"
                                    value={lead.budget}
                                />
                                <StatCard
                                    icon={Clock}
                                    label="Timeline"
                                    value={lead.timeline}
                                />
                            </div>

                            {/* Goal */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-orange-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Goal
                                    </h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {lead.goal || "No goal provided."}
                                </p>
                            </div>

                            {/* Blocker */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="mb-3 flex items-center gap-2">
                                    <TriangleAlert className="h-4 w-4 text-orange-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Blocker
                                    </h3>
                                </div>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                                    {lead.blocker || "No blocker mentioned."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {showConfirm && lead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                <Trash2 className="h-5 w-5 text-red-500" />
                            </div>
                            <button
                                onClick={() => {
                                    if (!deleting) {
                                        setShowConfirm(false);
                                        setDeleteError(null);
                                    }
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-gray-900">
                            Delete this lead?
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            This will permanently delete{" "}
                            <span className="font-medium text-gray-700">
                                {lead.name}
                            </span>
                            's record. This action cannot be undone.
                        </p>

                        {deleteError && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    if (!deleting) {
                                        setShowConfirm(false);
                                        setDeleteError(null);
                                    }
                                }}
                                disabled={deleting}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardShell>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="truncate text-sm text-gray-700">{value}</p>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>
            <p className="truncate text-sm font-semibold text-gray-800">
                {value}
            </p>
        </div>
    );
}

function StageBadge({ stage }: { stage: string }) {
    const colorMap: Record<string, string> = {
        new: "bg-blue-50 text-blue-600 border-blue-100",
        contacted: "bg-purple-50 text-purple-600 border-purple-100",
        qualified: "bg-green-50 text-green-600 border-green-100",
        lost: "bg-red-50 text-red-600 border-red-100",
        won: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const style =
        colorMap[stage?.toLowerCase()] ??
        "bg-orange-50 text-orange-600 border-orange-100";

    return (
        <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${style}`}
        >
            {stage}
        </span>
    );
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}