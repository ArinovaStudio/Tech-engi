"use client";

import React, { useState, useEffect } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import { suspensionData } from "@/lib/suspensionReasons";

interface SuspendUserModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SuspendUserModal({ isOpen, user, onClose, onSuccess }: SuspendUserModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number>(-1);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(-1);
  const [customMessage, setCustomMessage] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setSelectedReasonIndex(-1);
      setSelectedTagIndex(-1);
      setCustomMessage(user.isSuspended ? "We have reviewed your account and your suspension has been lifted. Your access to the platform has been fully restored." : "");
      setSubject(user.isSuspended ? "Suspension Lifted" : "");
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const currentReason = selectedReasonIndex >= 0 ? suspensionData[selectedReasonIndex] : null;

  const handleReasonChange = (index: number) => {
    setSelectedReasonIndex(index);
    setSelectedTagIndex(-1);
    setCustomMessage("");
    setSubject(index >= 0 ? suspensionData[index].reason : "");
  };

  const handleTagClick = (tagIndex: number, tag: any) => {
    setSelectedTagIndex(tagIndex);
    setCustomMessage(tag.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/users/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isSuspended: !user.isSuspended, 
          customMessage: customMessage,
          subject: subject,
        }),
      });
      const result = await res.json();
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black dark:text-white">
      <div className="w-full max-w-3xl bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700 h-[85vh] max-h-[800px]">
        
        {/* HEADER*/}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2 font-inter">
            {user.isSuspended ? (
              <><AlertCircle size={18} className="text-green-500" /> Restore Account Access</>
            ) : (
              <><AlertCircle size={18} className="text-red-500" /> Issue Suspension Notice</>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          {/* TO FIELD */}
          <div className="flex items-center px-6 py-3 border-b border-gray-100 dark:border-slate-700">
            <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">To</span>
            <div className="flex-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                {user.email}
              </span>
            </div>
          </div>

          {/* DYNAMIC COMPOSER TOOLS*/}
          {!user.isSuspended && (
            <div className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700 px-6 py-4 space-y-4">
              
              {/* REASON SELECTOR */}
              <div className="flex items-center">
                <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">Reason</span>
                <select 
                  required
                  value={selectedReasonIndex}
                  onChange={(e) => handleReasonChange(Number(e.target.value))}
                  className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all cursor-pointer shadow-sm"
                >
                  <option value="-1" disabled>Select violation category...</option>
                  {suspensionData.map((item, idx) => (
                    <option key={idx} value={idx}>{item.reason}</option>
                  ))}
                </select>
              </div>

              {/* TAGS SELECTOR */}
              {currentReason && (
                <div className="flex items-start animate-fadeIn">
                  <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400 mt-2">Tag</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {currentReason.tags.map((tag, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => handleTagClick(tIdx, tag)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                          selectedTagIndex === tIdx 
                            ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500"
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUBJECT FIELD */}
          <div className="flex items-center px-6 py-3 border-b border-gray-100 dark:border-slate-700">
            <span className="w-20 text-sm font-semibold text-gray-400 dark:text-slate-400">Subject</span>
            <input 
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="flex-1 text-sm font-medium text-gray-800 dark:text-slate-200 outline-none bg-transparent dark:placeholder-slate-500"
            />
          </div>

          {/* MESSAGE BODY TEXT BOX */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/20">
            {!user.isSuspended && selectedTagIndex === -1 && selectedReasonIndex !== -1 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                Select a tag above to generate the message template...
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all">
                <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                   <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Email Message</span>
                </div>
                <textarea
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write your email message here..."
                  className="w-full h-full flex-1 resize-none outline-none text-sm text-gray-700 dark:text-slate-200 dark:bg-slate-900 leading-relaxed font-inter p-4 dark:placeholder-slate-500"
                />
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-300 border border-transparent hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              Discard
            </button>
            
            <button
              type="submit"
              disabled={isProcessing || (!user.isSuspended && selectedTagIndex === -1) || !customMessage || !subject}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-bold shadow-md transition-all ${
                user.isSuspended 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isProcessing ? "Sending..." : user.isSuspended ? "Restore Account" : "Send & Suspend"}
              {!isProcessing && <Send size={16} />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}