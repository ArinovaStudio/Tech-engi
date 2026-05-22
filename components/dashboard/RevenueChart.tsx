"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useMemo, useState } from "react";

export default function RevenueChart({
  data,
  totalRevenue,
}: {
  data: any;
  totalRevenue: number;
}) {

  // FILTER LOGIC
  const [period, setPeriod] = useState<
    "monthly" | "yearly"
  >("monthly");

  // MONTH SLIDER
  const [startIndex, setStartIndex] = useState(0);

  // ACTIVE DATA
  const activeData = useMemo(() => {
    return (
      data?.[period] ||
      Object.values(data || {})[0] ||
      []
    );
  }, [data, period]);

  // SHOW 6 MONTHS ONLY IN MONTHLY
  const visibleData =
    period === "monthly"
      ? activeData.slice(startIndex, startIndex + 6)
      : activeData;

  // TOOLTIP
  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  // HEIGHT LOGIC
  const maxValue = useMemo(() => {
    return Math.max(
      ...activeData.map(
        (item: any) => Number(item?.value || 0)
      ),
      1
    );
  }, [activeData]);

  // NEXT
  const handleNext = () => {
    if (startIndex + 6 < activeData.length) {
      setStartIndex((prev) => prev + 6);
    }
  };

  // PREV
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 6);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-[#EAEAEA] w-full">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-2">

        <div>
          <h3 className="text-[1.3rem] font-semibold text-black">
            Revenue Overview
          </h3>

          <h1 className="text-[42px] font-medium leading-none mt-3 text-black tracking-[-1.5px] mb-5">
            ₹{totalRevenue?.toLocaleString() || "0"}
          </h1>

          {/* <p className="text-[13px] text-[#9F9F9F] mt-2 font-medium">
            Total All Time
          </p> */}
        </div>

        {/* FILTER */}
        <button
          onClick={() => {
            setPeriod((prev) =>
              prev === "monthly"
                ? "yearly"
                : "monthly"
            );

            setStartIndex(0);
          }}
          className="h-[42px] px-4 rounded-xl border border-[#E5E5E5] bg-white flex items-center gap-2 text-[14px] font-semibold capitalize"
        >
          {period}
          <ChevronDown size={15} />
        </button>

      </div>

      {/* GRAPH */}
      <div className="flex items-end gap-4 h-50">

        {/* LEFT BUTTON */}
        {period === "monthly" && (
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="min-w-[40px] h-[40px] rounded-full border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* BARS */}
        <div className="flex-1 flex items-end justify-between gap-4 h-full">

          {visibleData.map((item: any, index: number) => {

            const fillHeight =
              ((Number(item?.value || 0) / maxValue) * 100);

            return (
              <div
                key={index}
                className="relative flex flex-col items-center justify-end h-full"
                onMouseEnter={() =>
                  setHoveredIndex(index)
                }
                onMouseLeave={() =>
                  setHoveredIndex(null)
                }
              >

                {/* TOOLTIP */}
                {hoveredIndex === index && (
                  <div className="absolute -top-16 z-20 bg-white border border-[#ECECEC] rounded-2xl px-4 py-3 min-w-[120px]">

                    <p className="text-[13px] font-semibold text-black">
                      {item?.name}
                    </p>

                    <p className="text-[12px] text-[#777] mt-1">
                      Revenue : ₹
                      {Number(
                        item?.revenue ||
                        item?.value ||
                        0
                      ).toLocaleString()}
                    </p>

                  </div>
                )}

                {/* BAR */}
                <div
                  className="
                    relative
                    w-[52px]
                    h-[170px]
                    rounded-full
                    overflow-hidden
                    cursor-pointer
                  "
                >

                  {/* STRIPED BG */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg,#D2D2D2 0px,#D2D2D2 3px,transparent 3px,transparent 8px)",
                    }}
                  />

                  {/* FILLED BAR */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-full
                      rounded-full
                      transition-all
                      duration-500
                    "
                    style={{
                      height: `${fillHeight}%`,
                      background: "#FFAE58",
                    }}
                  />

                </div>

                {/* LABEL */}
                <span className="mt-3 text-[13px] text-[#9E9E9E] font-medium">
                  {item?.name}
                </span>

              </div>
            );
          })}
        </div>

        {/* RIGHT BUTTON */}
        {period === "monthly" && (
          <button
            onClick={handleNext}
            disabled={startIndex + 6 >= activeData.length}
            className="min-w-[40px] h-[40px] rounded-full border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        )}

      </div>
    </div>
  );
}