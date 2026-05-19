"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ArrowLeft, Ban, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import AdminEngMetaCard from "@/components/admin/engineer-profile/AdminEngMetaCard";
import AdminEngInfoCard from "@/components/admin/engineer-profile/AdminEngInfoCard";
import AdminEngDetailsCard from "@/components/admin/engineer-profile/AdminEngDetailsCard";
import AdminEngAccountCard from "@/components/admin/engineer-profile/AdminEngAccountCard";
import EngineerModal from "@/components/engineer/profile/modals/EngineerModal"; 
import ConfirmModal from "@/components/ConfirmModal";
import DashboardShell from "@/components/layout/DashboardShell";
import SuspendUserModal from "@/components/admin/SuspendUserModal";

export default function AdminEngineerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR(`/api/admin/users/${id}`, fetcher);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  
  const [targetStatus, setTargetStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [rejectionReason, setRejectionReason] = useState("");

   if (isLoading) {
    return (
            <DashboardShell>
            <div className="flex items-center justify-center h-[80vh]">
                <div 
                className="animate-spin rounded-full h-10 w-10 border-b-2" 
                style={{ borderColor: "var(--primary)" }} 
                />
            </div>
            </DashboardShell>
        );
    }

  const user = data?.user;
  const profile = user?.engineerProfile;

  if (!user) return <p className="text-center mt-10">User not found</p>;

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) { router.push("/admin/engineer-management"); }
      else toast.error("Failed to delete user");
    } catch { toast.error("Error occurred"); } 
    finally { setIsProcessing(false); }
  };

  const handleStatusChange = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          approvalStatus: targetStatus, 
          rejectionReason: targetStatus === "REJECTED" ? rejectionReason : null 
        }),
      });
      if (res.ok) { mutate(); setShowStatus(false); }
      else toast.error("Failed to update status");
    } catch { toast.error("Error occurred"); } 
    finally { setIsProcessing(false); }
  };

  return (
    <DashboardShell>
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* TOP ACTION BAR */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold font-inter text-[var(--text-primary)]">Manage Engineer</h2>
            <p className="text-xs font-inter text-[var(--text-muted)]">ID: {user.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setTargetStatus(profile?.status || "PENDING"); setRejectionReason(profile?.rejectionReason || ""); setShowStatus(true); }} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:bg-gray-50"
          >
            <ShieldAlert size={16} /> Approval Status
          </button>
          <button 
            onClick={() => setShowSuspend(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 text-sm font-semibold"
          >
            {user.isSuspended ? <CheckCircle size={16}/> : <Ban size={16}/>} 
            {user.isSuspended ? "Unsuspend" : "Suspend"}
          </button>
          <button 
            onClick={() => setShowDelete(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm font-semibold"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* PROFILE CARDS */}
      <div className="space-y-6">
        <AdminEngMetaCard user={user} />
        <AdminEngInfoCard user={user} onUpdate={() => mutate()} />
        <AdminEngDetailsCard profile={profile} user={user} onUpdate={() => mutate()} />
        <AdminEngAccountCard payoutData={user.payoutDetail} userId={user.id} onUpdate={() => mutate()} />
      </div>

      {/* MODALS */}
      <ConfirmModal isOpen={showDelete} title="Delete Engineer" message={`Permanently delete ${user.name}? This removes all their data.`} confirmText="Delete" isDanger={true} isLoading={isProcessing} onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      
      <SuspendUserModal 
        isOpen={showSuspend} 
        user={user} 
        onClose={() => setShowSuspend(false)} 
        onSuccess={() => { mutate(); toast.success(`User status updated.`); }} 
      />

      <EngineerModal isOpen={showStatus} onClose={() => setShowStatus(false)} className="max-w-[450px]">
        <div className="p-8">
          <h4 className="text-2xl font-bold font-inter text-[var(--text-primary)] mb-2">Change Status</h4>
          <div className="space-y-4 mt-6">
            <select value={targetStatus} onChange={e => setTargetStatus(e.target.value as any)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50">
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {targetStatus === "REJECTED" && (
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." rows={3} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50 resize-none" />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button onClick={() => setShowStatus(false)} className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleStatusChange} disabled={isProcessing || (targetStatus === "REJECTED" && !rejectionReason)} className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold disabled:opacity-50">
                {isProcessing ? "Saving..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </EngineerModal>
    </div>
    </DashboardShell>
  );
}