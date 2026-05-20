"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS: Record<string, string> = {
  Completed: "#238B57",
  "In Progress": "#0B5D3B",
  Pending: "#C8CEC8",
};

export default function ProjectDistribution({
  data = [],
}: {
  data: any[];
}) {

  // VALUES
  const completed =
    data.find((d) => d.name === "Completed")
      ?.value || 0;

  const inProgress =
    data.find((d) => d.name === "In Progress")
      ?.value || 0;

  const pending =
    data.find((d) => d.name === "Searching")
      ?.value || 0;

  const total =
    completed + inProgress + pending;

  const percentage = Math.round(
    (completed / total) * 100
  );

  // EXACT UI DATA
  const chartData = [
    {
      name: "Completed",
      value: completed,
      fill: COLORS.Completed,
    },
    {
      name: "In Progress",
      value: inProgress,
      fill: COLORS["In Progress"],
    },
    {
      name: "Pending",
      value: pending,
      fill: "url(#pendingPattern)",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-[28px] border border-[#ECECEC] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

      {/* TITLE */}
      <h3 className="text-[15px] font-semibold text-black mb-2">
        Project Progress
      </h3>

      {/* CHART */}
      <div className="relative h-[250px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            {/* STRIPED PATTERN */}
            <defs>
              <pattern
                id="pendingPattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="#C9CEC9"
                  strokeWidth="4"
                />
              </pattern>
            </defs>

            <Pie
  data={chartData}
  dataKey="value"
  startAngle={210}
  endAngle={-30}
  innerRadius={82}
  outerRadius={122}
  paddingAngle={-2}
  cornerRadius={999}
  strokeWidth={0}
>
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.fill}
                  />
                )
              )}
            </Pie>

          </PieChart>
        </ResponsiveContainer>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <h1 className="text-[58px] leading-none font-bold tracking-[-3px] text-black">
            {percentage}%
          </h1>

          <p className="text-[15px] text-[#7D7D7D] mt-2">
            Project Ended
          </p>

        </div>
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-center gap-8 mt-[-8px] flex-wrap">

        {/* COMPLETED */}
        <div className="flex items-center gap-2">
          <span className="w-[15px] h-[15px] rounded-full bg-[#238B57]" />

          <p className="text-[14px] text-[#648067]">
            Completed
          </p>
        </div>

        {/* IN PROGRESS */}
        <div className="flex items-center gap-2">
          <span className="w-[15px] h-[15px] rounded-full bg-[#0B5D3B]" />

          <p className="text-[14px] text-[#648067]">
            In Progress
          </p>
        </div>

        {/* PENDING */}
        <div className="flex items-center gap-2">

          <span
            className="w-[15px] h-[15px] rounded-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg,#BFC5BF 0px,#BFC5BF 2px,transparent 2px,transparent 5px)",
            }}
          />

          <p className="text-[14px] text-[#648067]">
            Pending
          </p>

        </div>
      </div>
    </div>
  );
}

