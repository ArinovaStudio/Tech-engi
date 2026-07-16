"use client";

import React from "react";
import { LucideLoader, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDanger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined} />
      <div className="relative w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${isDanger ? "bg-red-100 dark:bg-red-900/40 text-red-600" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"}`}>
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#050A30] dark:text-white ">{title}</h2>
        </div>
        <p className="text-[#4B4B4B] dark:text-slate-300  text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg  text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center min-w-[90px] px-4 py-2 rounded-lg  text-sm text-white ${
              isDanger ? "bg-red-600 hover:bg-red-700" : "bg-[#FFAE58] hover:bg-[#e89b45]"
            }`}
          >
            {isLoading ? <LucideLoader className="animate-spin" size={16} /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}