"use client";

import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type Period = "weekly" | "monthly" | "yearly";

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  change?: string;
  changeType?: "up" | "down";
  subtitle?: string;
  highlighted?: boolean;
  period?: Period;
  onPeriodChange?: (p: Period) => void;
}

const PERIODS: Period[] = ["weekly", "monthly", "yearly"];

export default function StatCard({ title, value, change, changeType, subtitle, highlighted, period, onPeriodChange, }: StatCardProps) {
  const isUp = changeType === "up";

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="">
      <div className={`relative rounded-[24px] border p-6 m-2 h-43 transition-all duration-300 flex flex-col
       
        ${highlighted
          ? "bg-gradient-to-br from-[#FF7A00] via-[#FFAE58] to-[#FFE0B8] border-transparent text-white"
          : "bg-white dark:bg-card border-[#E7E7E7] dark:border-slate-800 text-black dark:text-white"
        }
      `}
    >
      {/* Top */}
      <div className="flex items-start justify-between ">
        <div className="min-w-0 pr-2">
          <p
            className={`text-[1.1rem] font-medium leading-tight line-clamp-2 ${highlighted ? "text-white/90" : "text-[#111] dark:text-slate-100"
              }`}
          >
            {title}
          </p>
        </div>

        {/* Arrow Button */}
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border
            ${highlighted
              ? "bg-white text-black border-white/20"
              : "bg-white dark:bg-slate-800 text-black dark:text-white border-[#DADADA] dark:border-slate-700"
            }
          `}
        >
          <ArrowUpRight size={18} strokeWidth={2.2} />
        </div>
      </div>

      {/* Value */}
      <div className="mt-2 mb-8 flex-1 flex items-end">
        <h2 className={`text-[36px] leading-none font-medium tracking-tight ${highlighted ? "text-white" : "text-black dark:text-white"
            }`}
        >
          {value || "0"}
        </h2>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between">
        {change && changeType ? (
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium border
              ${highlighted
                ? "bg-white/10 border-white/20 text-white"
                : isUp
                  ? "bg-[#EEF9F1] dark:bg-emerald-950/40 border-[#D7F0DD] dark:border-emerald-800 text-[#238B57] dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-800 text-red-500 dark:text-red-400"
              }
            `}
          >
            {isUp ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}

            <span>{change}</span>
          </div>
        ) : (
          <span className={`text-[13px] ${highlighted ? "text-white/80" : "text-[#6B6B6B] dark:text-slate-400"
              }`}
          >
            {subtitle}
          </span>
        )}

        {/* Optional Period Dropdown */}
        {onPeriodChange && period && (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs capitalize
                ${highlighted
                  ? "bg-white/10 text-white"
                  : "bg-white dark:bg-slate-800 text-[#444] dark:text-slate-300"
                }
              `}
            >
              {period}
              <ChevronDown size={12} />
            </button>

            {open && (
              <div className="absolute right-0 bottom-12 w-[110px] overflow-hidden rounded-xl border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-card z-50">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      onPeriodChange(p);
                      setOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-[#F5F5F5] dark:hover:bg-slate-800
                      ${p === period
                        ? "font-semibold text-[#177A47]"
                        : "text-[#444] dark:text-slate-300"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}