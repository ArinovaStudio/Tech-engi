"use client";

import { fetcher } from "@/lib/fetcher";
import { Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import React, { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal"; 

function PayoutRow({
  payout,
  onView,
  onEdit,
  onDelete,
  readOnly
}: {
  payout: any;
  onView: (proof?: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}) {
  const displayDate = payout.completedAt ? new Date(payout.completedAt) : new Date(payout.createdAt);
  const payoutDate = displayDate.toLocaleDateString();

  const isSuccess = payout.status === "SUCCESS";
  const isFailed = payout.status === "FAILED";
  
  const borderColor = isSuccess 
    ? "border-green-500 bg-green-50/20" 
    : isFailed 
      ? "border-red-500 bg-red-50/20" 
      : "border-gray-300 bg-gray-50/50";
      
  const badgeColor = isSuccess 
    ? "bg-green-100 text-green-700" 
    : isFailed 
      ? "bg-red-100 text-red-700" 
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className={`relative p-4 rounded-xl border mb-4 transition-colors ${borderColor}`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-lg text-gray-900 font-inter">
          ₹{payout.amount.toLocaleString()}
        </h3>
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle size={18} className="text-green-500" />}
          {isFailed && <XCircle size={18} className="text-red-500" />}
          {!isSuccess && !isFailed && <Clock size={18} className="text-yellow-500" />}
          
          {/* ONLY SHOW EDIT/DELETE IF NOT READ-ONLY */}
          {!readOnly && onEdit && (
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 transition-colors">
              <Edit size={16} />
            </button>
          )}
          {!readOnly && onDelete && (
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 items-start">
        <p className="text-sm text-gray-600 font-inter">
          {payout.razorpayPaymentId || `Manual-TX-${payout.id.slice(-6)}`}
        </p>
        <p className="text-xs text-gray-500 font-inter">
          {payout.razorpaySignature || "Bank"} • {payoutDate}
        </p>
        <p className="text-xs text-gray-500 font-inter">
          From: {payout.user?.email || "admin@tech-engi.com"}
        </p>

        <span className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-inter ${badgeColor}`}>
          {payout.status}
        </span>

        <button
          onClick={() => onView(payout?.proof)}
          className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium font-inter"
        >
          <Eye size={14} /> View Proof
        </button>
      </div>
    </div>
  );
}

export default function PayoutHistory({ 
  transactions, 
  onEdit, 
  onMutate, 
  readOnly = false 
}: { 
  transactions: any[], 
  onEdit?: (tx: any) => void, 
  onMutate?: () => void,
  readOnly?: boolean
}) {
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId || !onMutate) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/ledger/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Transaction deleted successfully");
        onMutate();
      } else {
        toast.error(data.message || "Failed to delete transaction");
      }
    } catch {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-xl flex-1 border border-[var(--border)] bg-white p-5 h-full">
        <h3 className="text-lg font-semibold font-inter mb-5" style={{ color: "var(--text-primary)" }}>
          Payout History
        </h3>

        {transactions.length > 0 ? (
          <div className="space-y-1">
            {transactions.map((p: any) => (
              <PayoutRow
                key={p.id}
                payout={p}
                readOnly={readOnly}
                onView={(proof) => {
                  if(proof) setProofModal(proof);
                  else toast.error("No proof uploaded for this transaction.");
                }}
                onEdit={onEdit ? () => onEdit(p) : undefined}
                onDelete={() => setDeleteId(p.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-10 font-inter" style={{ color: "var(--text-muted)" }}>
            No payouts yet.
          </p>
        )}
      </div>

      {!readOnly && (
        <ConfirmModal 
          isOpen={!!deleteId}
          title="Delete Transaction"
          message="Are you sure you want to permanently delete this transaction? The payment proof will also be deleted."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={isDeleting}
          isDanger={true}
        />
      )}

      {proofModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full shadow-2xl relative">
            <h2 className="font-bold text-lg mb-4 font-inter" style={{ color: "var(--text-primary)" }}>
              Payment Proof
            </h2>
            <div className="bg-gray-50 rounded-lg border border-[var(--border)] p-2 flex items-center justify-center overflow-hidden min-h-[200px]">
              <img
                src={proofModal}
                alt="Payment Proof"
                className="max-h-[60vh] object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/two-guys.png"; 
                }}
              />
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setProofModal(null)}
                className="px-6 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                style={{ background: "var(--primary)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}