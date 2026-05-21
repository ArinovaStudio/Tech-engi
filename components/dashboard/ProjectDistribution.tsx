"use client";

import React from "react";

// ─────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────
const COLORS = {
  completed: "#2d7d45",
  progress: "#5cb86b",
  pending: "#c8c8c8",
};

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface DataItem {
  name: string;
  value: number;
}

interface ProjectProgressGaugeProps {
  label?: string;
  data?: DataItem[];
}

// ─────────────────────────────────────────────────────────
// SVG CONFIG
// ─────────────────────────────────────────────────────────
const CONFIG = {
  cx: 200,
  cy: 170,
  radius: 120,
  strokeWidth: 38,
  startDeg: 180,
  totalArc: 180,
};

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const toRad = (deg: number) =>
  (deg * Math.PI) / 180;

const getPoint = (deg: number) => {
  const { cx, cy, radius } = CONFIG;

  return {
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy + radius * Math.sin(toRad(deg)),
  };
};

const createArc = (
  startDeg: number,
  endDeg: number
) => {
  const start = getPoint(startDeg);
  const end = getPoint(endDeg);

  const largeArc =
    endDeg - startDeg > 180 ? 1 : 0;

  return `
    M ${start.x.toFixed(2)} ${start.y.toFixed(2)}
    A ${CONFIG.radius} ${CONFIG.radius}
    0 ${largeArc} 1
    ${end.x.toFixed(2)} ${end.y.toFixed(2)}
  `;
};

// ─────────────────────────────────────────────────────────
// LEGEND ITEM
// ─────────────────────────────────────────────────────────
function LegendItem({
  x,
  y,
  label,
  color,
  striped = false,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  striped?: boolean;
}) {
  return (
    <>
      {!striped ? (
        <circle cx={x} cy={y} r="6" fill={color} />
      ) : (
        <>
          <circle cx={x} cy={y} r="6" fill="#e8e8e8" />

          <rect
            x={x - 6}
            y={y - 6}
            width="12"
            height="12"
            fill="url(#legendHatch)"
            clipPath="url(#legendClip)"
          />

          <circle
            cx={x}
            cy={y}
            r="6"
            fill="none"
            stroke="#c0c0c0"
            strokeWidth="0.8"
          />
        </>
      )}

      <text
        x={x + 12}
        y={y + 5}
        fontSize="12"
        fill="#444"
        fontFamily="-apple-system,BlinkMacSystemFont,sans-serif"
      >
        {label}
      </text>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
const ProjectProgressGauge: React.FC<
  ProjectProgressGaugeProps
> = ({
  label = "Project Ended",

  data = [
    { name: "Completed", value: 62 },
    { name: "In Progress", value: 10 },
    { name: "Searching", value: 28 },
  ],
}) => {
  // ───────────────────────────────────────────────────────
  // VALUES
  // ───────────────────────────────────────────────────────
  const total =
    data.reduce(
      (acc, item) => acc + item.value,
      0
    ) || 1;

  const completed =
    data.find((d) => d.name === "Completed")
      ?.value || 0;

  const progress =
    data.find((d) => d.name === "In Progress")
      ?.value || 0;

  const percentage = Math.round(
    ((completed + progress) / total) * 100
  );

  // ───────────────────────────────────────────────────────
  // ANGLES
  // ───────────────────────────────────────────────────────
  const completedEnd =
    CONFIG.startDeg +
    CONFIG.totalArc * (completed / total);

  const progressEnd =
    completedEnd +
    CONFIG.totalArc * (progress / total);

  const finalEnd =
    CONFIG.startDeg + CONFIG.totalArc;

  const startPoint = getPoint(CONFIG.startDeg);
  const endPoint = getPoint(finalEnd);

  // ───────────────────────────────────────────────────────
  // TRACK PATH
  // ───────────────────────────────────────────────────────
  const trackPath = `
    M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)}
    A ${CONFIG.radius} ${CONFIG.radius}
    0 0 1
    ${endPoint.x.toFixed(2)} ${endPoint.y.toFixed(2)}
  `;

  return (
    <div className="gauge-card">
      <p className="gauge-title">
        Project Progress
      </p>

      <svg
        viewBox="0 0 400 230"
        className="gauge-svg"
      >
        {/* DEFINITIONS */}
        <defs>
          {/* Main Hatch */}
          <pattern
            id="hatch"
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
              stroke="#b0b0b0"
              strokeWidth="3"
            />
          </pattern>

          {/* Legend Hatch */}
          <pattern
            id="legendHatch"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              stroke="#aaa"
              strokeWidth="1.5"
            />
          </pattern>

          {/* Legend Clip */}
          <clipPath id="legendClip">
            <circle
              cx="298"
              cy="220"
              r="6"
            />
          </clipPath>
        </defs>

        {/* TRACK */}
        <path
          d={trackPath}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={CONFIG.strokeWidth}
          strokeLinecap="round"
        />

        {/* PENDING */}
        <path
          d={createArc(progressEnd, finalEnd)}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={CONFIG.strokeWidth}
          strokeLinecap="round"
        />

        <path
          d={createArc(progressEnd, finalEnd)}
          fill="none"
          stroke="url(#hatch)"
          strokeWidth={CONFIG.strokeWidth + 3}
          strokeLinecap="round"
        />

        <path
          d={createArc(progressEnd, finalEnd)}
          fill="none"
          stroke="#ccc"
          strokeWidth={CONFIG.strokeWidth}
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* IN PROGRESS */}
        {progress > 0 && (
          <path
            d={createArc(
              completedEnd,
              progressEnd
            )}
            fill="none"
            stroke={COLORS.progress}
            strokeWidth={CONFIG.strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* COMPLETED */}
        {completed > 0 && (
          <path
            d={createArc(
              CONFIG.startDeg,
              completedEnd
            )}
            fill="none"
            stroke={COLORS.completed}
            strokeWidth={CONFIG.strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* PERCENTAGE */}
        <text
          x={CONFIG.cx}
          y={CONFIG.cy - 10}
          textAnchor="middle"
          fontSize="42"
          fontWeight="700"
          fill="#1a1a1a"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {percentage}%
        </text>

        {/* LABEL */}
        <text
          x={CONFIG.cx}
          y={CONFIG.cy + 18}
          textAnchor="middle"
          fontSize="13"
          fill="#999"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {label}
        </text>

        {/* LEGENDS */}
        <LegendItem
          x={40}
          y={220}
          label="Completed"
          color={COLORS.completed}
        />

        <LegendItem
          x={158}
          y={220}
          label="In Progress"
          color={COLORS.progress}
        />

        <LegendItem
          x={298}
          y={220}
          label="Pending"
          color={COLORS.pending}
          striped
        />
      </svg>

      <style jsx>{`
        .gauge-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 14px;
          padding: 22px 24px 18px;
          box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
          width: 100%;
          height: 100%;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .gauge-title {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .gauge-svg {
          width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ProjectProgressGauge;