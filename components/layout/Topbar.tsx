"use client";
import { Search, Gift, Bell, Plus } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-17 bg-white border-b border-[var(--border)] flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm bg-white px-3 py-2 border border-gray-300 rounded-lg">
        <Search size={15} className="text-gray-800" />
        <input
          placeholder="Search"
          className="bg-white text-sm font-inter text-gray-800 placeholder-gray-800 outline-none flex-1"
        />
        <span className="text-xs text-gray-400 bg-white border border-[var(--border)] px-1.5 py-0.5 font-mono">⌘F</span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {[Gift, Bell, Plus].map((Icon, i) => (
          <button
            key={i}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-[#fff4e6] hover:text-[#FFAE58] transition-all"
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* User */}
      <button className="flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
        <div className="w-8 h-8 bg-[#FFAE58] flex items-center justify-center">
          <span className="text-white text-xs font-bold font-id">YA</span>
        </div>
        <div className="text-left">
          <p className="text-xs font-bold font-id text-[var(--text-primary)]">Young Alaska</p>
          <p className="text-[10px] font-inter text-[var(--text-muted)]">Business</p>
        </div>
      </button>
    </header>
  );
}
