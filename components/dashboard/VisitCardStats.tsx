"use client";

import { useRef, useState } from "react";
import { MapPin, Clock3, Trash2, Loader2 } from "lucide-react";

export interface VisitStat {
  ref: string;
  visits: number;
  latestVisit: string | null;
}

interface VisitStatsProps {
  stats: VisitStat[];
  loading?: boolean;
  onDeleted?: (ref: string) => void;
}

const REVEAL = 88; // width of the delete button in px

function formatTimeAgo(date: string | null) {
  if (!date) return "-";

  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60);

  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;

  return `${Math.floor(diff / 1440)}d ago`;
}

function SwipeRow({
  isOpen,
  deleting,
  onOpen,
  onClose,
  onDelete,
  children,
}: {
  isOpen: boolean;
  deleting: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const [dragX, setDragX] = useState<number | null>(null);
  const startX = useRef(0);
  const startBase = useRef(0);
  const moved = useRef(false);

  const base = isOpen ? -REVEAL : 0;
  const x = dragX ?? base;

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (deleting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startBase.current = base;
    moved.current = false;
    setDragX(base);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragX === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) moved.current = true;
    setDragX(Math.min(0, Math.max(-REVEAL, startBase.current + dx)));
  };

  const handleUp = () => {
    if (dragX === null) return;

    if (!moved.current) {
      if (isOpen) onClose(); // tap on an open row closes it
    } else if (dragX < -REVEAL / 2) {
      onOpen();
    } else {
      onClose();
    }

    setDragX(null);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* DELETE BUTTON (sits behind the row) */}
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        tabIndex={isOpen ? 0 : -1}
        aria-label="Delete"
        style={{ width: REVEAL }}
        className="absolute inset-y-0 right-4 rounded-xl flex items-center justify-center bg-red-600 text-white transition-colors hover:bg-red-700 disabled:opacity-70"
      >
        {deleting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Trash2 size={20} />
        )}
      </button>

      {/* SLIDING ROW */}
      <div
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        style={{
          transform: `translateX(${x}px)`,
          transition: dragX === null ? "transform 200ms ease" : "none",
          touchAction: "pan-y", // keep vertical scroll working
        }}
        className="relative select-none"
      >
        {children}
      </div>
    </div>
  );
}

export default function VisitStats({
  stats,
  loading = false,
  onDeleted,
}: VisitStatsProps) {
  const [openRef, setOpenRef] = useState<string | null>(null);
  const [deletingRef, setDeletingRef] = useState<string | null>(null);

  const total = stats.reduce((sum, s) => sum + s.visits, 0);

  const handleDelete = async (ref: string) => {
    setDeletingRef(ref);

    try {
      const res = await fetch(`/api/visit?ref=${encodeURIComponent(ref)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setOpenRef(null);
      onDeleted?.(ref);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingRef(null);
    }
  };

  return (
    <div className="bg-white dark:bg-card w-full h-full rounded-[28px] border border-[#ECECEC] dark:border-slate-800 p-5 overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-[1.2rem] font-semibold text-[#111] dark:text-slate-100">
            Visits by place
          </h2>

          <p className="text-[13px] text-[#8B8B8B] dark:text-slate-400 mt-1">
            total visits {total}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full border border-[#E5E5E5] dark:border-slate-700 dark:text-slate-300 flex items-center justify-center">
          <MapPin size={18} />
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 custom-scroll">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[68px] animate-pulse rounded-xl bg-[#F4F4F5] dark:bg-slate-800"
            />
          ))
        ) : stats.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-[#8B8B8B] dark:text-slate-400">
            No visits yet
          </p>
        ) : (
          stats.map((s) => (
            <SwipeRow
              key={s.ref}
              isOpen={openRef === s.ref}
              deleting={deletingRef === s.ref}
              onOpen={() => setOpenRef(s.ref)}
              onClose={() => setOpenRef((cur) => (cur === s.ref ? null : cur))}
              onDelete={() => handleDelete(s.ref)}
            >
              <div
                className="relative overflow-hidden rounded-xl border border-white/10 px-4 py-3 flex items-center justify-between"
                style={{
                  background: `
      radial-gradient(
        circle at top right,
        rgba(255,255,255,0.18),
        transparent 30%
      ),
      linear-gradient(
        135deg,
        #FF7A00 0%,
        #FFAE58 50%,
        #ffd195 100%
      )
    `,
                }}
              >
                {/* PLACE + LATEST */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin size={14} className="shrink-0" />
                    <h3 className="truncate text-[15px] font-semibold capitalize">
                      {s.ref}
                    </h3>
                  </div>

                  <div
                    className="mt-1 flex items-center gap-1 text-[11px] text-white/70"
                    title={
                      s.latestVisit
                        ? new Date(s.latestVisit).toLocaleString()
                        : ""
                    }
                  >
                    <Clock3 size={11} />
                    <span>{formatTimeAgo(s.latestVisit)}</span>
                  </div>
                </div>

                {/* COUNT */}
                <div className="flex flex-col items-end">
                  <span className="text-[22px] leading-none font-semibold text-white tabular-nums">
                    {s.visits}
                  </span>
                  <span className="mt-1 text-[11px] text-white/50">visits</span>
                </div>
              </div>
            </SwipeRow>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 999px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
