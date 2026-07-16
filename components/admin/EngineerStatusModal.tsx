"use client";

import React, { useState, useEffect } from "react";
import { X, Send, ShieldAlert, AlertCircle } from "lucide-react";
import { engineerStatusData } from "@/lib/engineerReasons";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

export default function EngineerStatusModal({ isOpen, user, onClose, onSuccess, initialStatus }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number>(-1);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(-1);
  const [customMessage, setCustomMessage] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setStatus(initialStatus || user.engineerProfile?.status || "PENDING");
      setSelectedReasonIndex(-1);
      setSelectedTagIndex(-1);
      setCustomMessage("");
      setSubject("");
    }
  }, [isOpen, user, initialStatus]);

  const currentOptions = status === "APPROVED" ? engineerStatusData.APPROVED : (status === "REJECTED" ? engineerStatusData.REJECTED : []);
  const currentReason = selectedReasonIndex >= 0 ? currentOptions[selectedReasonIndex] : null;

  const handleReasonChange = (index: number) => {
    setSelectedReasonIndex(index);
    setSelectedTagIndex(-1);
    setCustomMessage("");
    setSubject(currentOptions[index].reason);
  };

  const handleTagClick = (tagIndex: number, tag: any) => {
    setSelectedTagIndex(tagIndex);
    setCustomMessage(tag.message);
    setSubject(`${currentReason?.reason} - ${tag.label}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    setIsProcessing(true);

    try {
      const payload =
        status === "PENDING"
          ? { status }
          : { status, subject, customMessage };

      const res = await fetch(`/api/admin/engineers/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update engineer.");
        return;
      }

      toast.success(data.message || "Engineer updated successfully.");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black dark:text-white">
      <div className="w-full max-w-3xl bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] border border-gray-200 dark:border-slate-700">

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2 font-inter">
            <ShieldAlert size={18} className="text-[var(--primary)]" /> Manage Approval
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">

          <div className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700 px-6 py-4 space-y-4">
            {/* STATUS SELECTOR */}
            <div className="flex items-center">
              <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">Status</span>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value as any); setSelectedReasonIndex(-1); }}
                className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-[var(--primary)] shadow-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* REASON SELECTOR (Only if Approved or Rejected) */}
            {status !== "PENDING" && (
              <div className="flex items-center animate-fadeIn">
                <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">Reason</span>
                <select
                  required
                  value={selectedReasonIndex}
                  onChange={(e) => handleReasonChange(Number(e.target.value))}
                  className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-[var(--primary)] shadow-sm"
                >
                  <option value="-1" disabled>Select category...</option>
                  {currentOptions.map((item, idx) => <option key={idx} value={idx}>{item.reason}</option>)}
                </select>
              </div>
            )}

            {/* TAGS */}
            {currentReason && (
              <div className="flex items-start animate-fadeIn">
                <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400 mt-2">Tag</span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {currentReason.tags.map((tag, tIdx) => (
                    <button type="button" key={tIdx} onClick={() => handleTagClick(tIdx, tag)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${selectedTagIndex === tIdx ? "bg-[var(--primary)] border-[var(--primary)] text-white" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"}`}>
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* EMAIL COMPOSER (Hidden if Pending) */}
          {status !== "PENDING" && (
            <>
              <div className="flex items-center px-6 py-3 border-b border-gray-100 dark:border-slate-700">
                <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">Subject</span>
                <input required value={subject} onChange={e => setSubject(e.target.value)} className="flex-1 text-sm font-medium text-gray-800 dark:text-slate-200 outline-none bg-transparent dark:placeholder-slate-500" placeholder="Email subject..." />
              </div>
              <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/30">
                <textarea required value={customMessage} onChange={e => setCustomMessage(e.target.value)} className="w-full h-full flex-1 resize-none outline-none text-sm text-gray-700 dark:text-slate-200 dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-700 rounded-xl dark:placeholder-slate-500" placeholder="Write message..." />
              </div>
            </>
          )}

          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg">Discard</button>
            <button type="submit" disabled={isProcessing} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-bold bg-[var(--primary)] hover:opacity-90 disabled:opacity-50">
              {isProcessing ? "Processing..." : "Update Status"} <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}