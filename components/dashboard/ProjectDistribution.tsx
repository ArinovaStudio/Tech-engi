"use client";

import React from "react";

// ─────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────
const COLORS = {
  completed: "#FFAE58",
  progress: "#FFCB92",
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
// BIGGER + CLEANER SCALE
// ─────────────────────────────────────────────────────────
const CONFIG = {
  cx: 145,
  cy: 125,
  radius: 95,
  strokeWidth: 32,
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
        <circle cx={x} cy={y} r="5" fill={color} />
      ) : (
        <>
          <circle cx={x} cy={y} r="5" fill="#e8e8e8" />

          <rect
            x={x - 5}
            y={y - 5}
            width="10"
            height="10"
            fill="url(#legendHatch)"
            clipPath="url(#legendClip)"
          />

          <circle
            cx={x}
            cy={y}
            r="5"
            fill="none"
            stroke="#c0c0c0"
            strokeWidth="0.7"
          />
        </>
      )}

      <text
        x={x + 12}
        y={y + 4}
        fontSize="11"
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
    { name: "Completed", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Searching", value: 100 },
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
    <div className="gauge-card ">
      <p className="gauge-title ">
        Project Progress
      </p>

      <svg
        viewBox="0 0 290 205"
        className="gauge-svg"
      >
        {/* DEFINITIONS */}
        <defs>
          {/* Main Hatch */}
          <pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#b0b0b0"
              strokeWidth="2"
            />
          </pattern>

          {/* Legend Hatch */}
          <pattern
            id="legendHatch"
            patternUnits="userSpaceOnUse"
            width="3"
            height="3"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="3"
              stroke="#aaa"
              strokeWidth="1"
            />
          </pattern>

          {/* Legend Clip */}
          <clipPath id="legendClip">
            <circle
              cx="220"
              cy="185"
              r="5"
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
          stroke="#ffffff"
          strokeWidth={CONFIG.strokeWidth}
          strokeLinecap="round"
        />

        <path
          d={createArc(progressEnd, finalEnd)}
          fill="none"
          stroke="url(#hatch)"
          strokeWidth={CONFIG.strokeWidth + 2}
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
          y={CONFIG.cy - 2}
          textAnchor="middle"
          fontSize="40"
          fontWeight="400"
          fill="#1a1a1a"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {percentage}%
        </text>

        {/* LABEL */}
        <text
          x={CONFIG.cx}
          y={CONFIG.cy + 28}
          textAnchor="middle"
          fontSize="13"
          fill="#999"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {label}
        </text>

        {/* LEGENDS */}
        <LegendItem
          x={28}
          y={185}
          label="Completed"
          color={COLORS.completed}
        />

        <LegendItem
          x={118}
          y={185}
          label="In Progress"
          color={COLORS.progress}
        />

        <LegendItem
          x={220}
          y={185}
          label="Pending"
          color={COLORS.pending}
          striped
        />
      </svg>

      <style jsx>{`
        .gauge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          background: #ffffff;
          border-radius: 14px;

          padding: 12px;

          width: 100%;

          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .gauge-title {
          width: 100%;
          margin: 0 0 6px;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .gauge-svg {
          width: 100%;
          max-width: 460px;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ProjectProgressGauge;